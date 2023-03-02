import { useApolloClient } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import {
  PublicationDetailsDocument,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastDataAvailabilityMutation,
  useCreateDataAvailabilityCommentTypedDataMutation,
  useCreateDataAvailabilityCommentViaDispatcherMutation,
  usePublicationDetailsLazyQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  TRACK
} from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import logger from 'utils/logger'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  video: Publication
}

const formSchema = z.object({
  comment: z
    .string({ required_error: 'Enter valid comment' })
    .trim()
    .min(1, { message: 'Enter valid comment' })
    .max(5000, { message: 'Comment should not exceed 5000 characters' })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({ video }) => {
  const { cache } = useApolloClient()

  const [loading, setLoading] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

  const {
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      comment: ''
    },
    resolver: zodResolver(formSchema)
  })

  const onCompleted = () => {
    reset()
    setLoading(false)
    Analytics.track(TRACK.PUBLICATION.NEW_COMMENT)
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [getComment] = usePublicationDetailsLazyQuery({
    onCompleted: (data) => {
      if (data?.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: { publication: data?.publication },
                query: PublicationDetailsDocument
              })
            }
          }
        })
      }
    }
  })

  /**
   * DATA AVAILABILITY STARTS
   */
  const [broadcastDataAvailabilityComment] =
    useBroadcastDataAvailabilityMutation({
      onCompleted: async (data) => {
        if (
          data?.broadcastDataAvailability.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          await getComment({
            variables: {
              request: {
                publicationId: data?.broadcastDataAvailability.id
              }
            }
          })
        }
        onCompleted()
      },
      onError
    })

  const [createDataAvailabilityCommentViaDispatcher] =
    useCreateDataAvailabilityCommentViaDispatcherMutation({
      onCompleted: async (data) => {
        if (
          data?.createDataAvailabilityCommentViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          const { id: publicationId } =
            data.createDataAvailabilityCommentViaDispatcher
          await getComment({
            variables: {
              request: {
                publicationId
              }
            }
          })
        }
        onCompleted()
      },
      onError
    })

  const [createDataAvailabilityCommentTypedData] =
    useCreateDataAvailabilityCommentTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityCommentTypedData }) => {
        const { id, typedData } = createDataAvailabilityCommentTypedData
        toast.loading('Requesting signature...')
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        return await broadcastDataAvailabilityComment({
          variables: { request: { id, signature } }
        })
      }
    })
  /**
   * DATA AVAILABILITY ENDS
   */

  const submitComment = async (formData: FormData) => {
    try {
      setLoading(true)
      const metadataUri = await uploadToAr({
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(formData.comment),
        content: trimify(formData.comment),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.TextOnly,
        external_url: `${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`,
        image: null,
        imageMimeType: null,
        name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
        attributes: [
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'publication',
            value: 'comment'
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        media: [],
        appId: LENSTUBE_APP_ID
      })

      // Create Data Availability comment
      const dataAvailablityRequest = {
        from: selectedChannel?.id,
        commentOn: video.id,
        contentURI: metadataUri
      }
      const { data } = await createDataAvailabilityCommentViaDispatcher({
        variables: { request: dataAvailablityRequest }
      })
      // Fallback to DA dispatcher error
      if (
        data?.createDataAvailabilityCommentViaDispatcher?.__typename ===
        'RelayError'
      ) {
        return await createDataAvailabilityCommentTypedData({
          variables: { request: dataAvailablityRequest }
        })
      }
    } catch (error) {
      logger.error('[Error Store & Post Comment]', error)
    }
  }

  if (!selectedChannel || !selectedChannelId) {
    return null
  }

  return (
    <div className="my-1">
      <form
        onSubmit={handleSubmit(submitComment)}
        className="mb-2 flex w-full flex-wrap items-start justify-end gap-2"
      >
        <div className="flex flex-1 items-center space-x-2 md:space-x-3">
          <div className="flex-none">
            <img
              src={getProfilePicture(selectedChannel, 'avatar')}
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={selectedChannel?.handle}
            />
          </div>
          <InputMentions
            placeholder="How's this video?"
            autoComplete="off"
            validationError={errors.comment?.message}
            value={watch('comment')}
            onContentChange={(value) => {
              setValue('comment', value)
              clearErrors('comment')
            }}
            mentionsSelector="input-mentions-single"
          />
        </div>
        <Button loading={loading}>Comment</Button>
      </form>
    </div>
  )
}

export default NewComment
