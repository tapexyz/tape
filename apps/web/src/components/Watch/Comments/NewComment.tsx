import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useApolloClient } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import { utils } from 'ethers'
import type {
  CreateCommentBroadcastItemResult,
  CreateDataAvailabilityCommentRequest,
  CreatePublicCommentRequest,
  Publication
} from 'lens'
import {
  PublicationDetailsDocument,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastDataAvailabilityMutation,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation,
  useCreateDataAvailabilityCommentTypedDataMutation,
  useCreateDataAvailabilityCommentViaDispatcherMutation,
  usePublicationDetailsLazyQuery
} from 'lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'
type Props = {
  video: Publication
  defaultValue?: string
  placeholder?: string
  hideEmojiPicker?: boolean
}

const formSchema = z.object({
  comment: z
    .string({ required_error: t`Enter valid comment` })
    .trim()
    .min(1, { message: t`Enter valid comment` })
    .max(5000, { message: t`Comment should not exceed 5000 characters` })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({
  video,
  defaultValue = '',
  placeholder = t`How's this video?`,
  hideEmojiPicker = false
}) => {
  const { cache } = useApolloClient()

  const [loading, setLoading] = useState(false)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  // Dispatcher
  const canUseRelay = selectedChannel?.dispatcher?.canUseRelay
  const isSponsored = selectedChannel?.dispatcher?.sponsor

  const {
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      comment: defaultValue
    },
    resolver: zodResolver(formSchema)
  })

  useEffect(() => {
    setValue('comment', defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
      setQueuedComments([
        {
          comment: getValues('comment'),
          txnId: txn.txnId,
          txnHash: txn.txnHash,
          pubId: video.id
        },
        ...(queuedComments || [])
      ])
    }
    reset()
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    Analytics.track(TRACK.PUBLICATION.NEW_COMMENT, {
      publication_id: video.id,
      publication_state: video.isDataAvailability ? 'DATA_ONLY' : 'ON_CHAIN'
    })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeComment } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => {
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    }
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => {
      onCompleted(broadcast.__typename)
      if (broadcast.__typename === 'RelayerResult') {
        setToQueue(broadcast.txId)
      }
    }
  })

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onError,
    onCompleted: ({ createCommentViaDispatcher }) => {
      onCompleted(createCommentViaDispatcher.__typename)
      if (createCommentViaDispatcher.__typename === 'RelayerResult') {
        setToQueue(createCommentViaDispatcher.txId)
      }
    }
  })

  const [getComment] = usePublicationDetailsLazyQuery()

  const fetchAndCacheComment = async (commentId: string) => {
    const { data } = await getComment({
      variables: {
        request: {
          publicationId: commentId
        }
      }
    })
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

  const getSignatureFromTypedData = async (
    data: CreateCommentBroadcastItemResult
  ) => {
    const { typedData } = data
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync({
      domain: omitKey(typedData?.domain, '__typename'),
      types: omitKey(typedData?.types, '__typename'),
      value: omitKey(typedData?.value, '__typename')
    })
    return signature
  }

  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      const { typedData, id } = createCommentTypedData
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData
      } = typedData?.value
      try {
        const signature = await getSignatureFromTypedData(
          createCommentTypedData
        )
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig: { v, r, s, deadline: typedData.value.deadline }
        }
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          writeComment?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const createTypedData = (request: CreatePublicCommentRequest) => {
    createCommentTypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request }
    })
    if (data?.createCommentViaDispatcher.__typename === 'RelayError') {
      createTypedData(request)
    }
  }

  /**
   * DATA AVAILABILITY STARTS
   */
  const [broadcastDataAvailabilityComment] =
    useBroadcastDataAvailabilityMutation({
      onCompleted: async (data) => {
        onCompleted()
        if (data.broadcastDataAvailability.__typename === 'RelayError') {
          return toast.error(ERROR_MESSAGE)
        }
        if (
          data?.broadcastDataAvailability.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          const commentId = data?.broadcastDataAvailability.id
          await fetchAndCacheComment(commentId)
        }
      },
      onError
    })

  const [createDataAvailabilityCommentViaDispatcher] =
    useCreateDataAvailabilityCommentViaDispatcherMutation({
      onCompleted: async (data) => {
        if (
          data?.createDataAvailabilityCommentViaDispatcher?.__typename ===
          'RelayError'
        ) {
          return
        }
        if (
          data?.createDataAvailabilityCommentViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          onCompleted()
          const { id: commentId } =
            data.createDataAvailabilityCommentViaDispatcher
          await fetchAndCacheComment(commentId)
        }
      },
      onError
    })

  const [createDataAvailabilityCommentTypedData] =
    useCreateDataAvailabilityCommentTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityCommentTypedData }) => {
        const { id } = createDataAvailabilityCommentTypedData
        const signature = await getSignatureFromTypedData(
          createDataAvailabilityCommentTypedData
        )
        return await broadcastDataAvailabilityComment({
          variables: { request: { id, signature } }
        })
      }
    })

  const createViaDataAvailablityDispatcher = async (
    request: CreateDataAvailabilityCommentRequest
  ) => {
    const variables = { request }

    const { data } = await createDataAvailabilityCommentViaDispatcher({
      variables
    })

    if (
      data?.createDataAvailabilityCommentViaDispatcher?.__typename ===
      'RelayError'
    ) {
      return await createDataAvailabilityCommentTypedData({ variables })
    }
  }
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

      const dataAvailablityRequest = {
        from: selectedChannel?.id,
        commentOn: video.id,
        contentURI: metadataUri
      }
      const request = {
        profileId: selectedChannel?.id,
        publicationId: video?.id,
        contentURI: metadataUri,
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      if (canUseRelay) {
        if (video.isDataAvailability && isSponsored) {
          return await createViaDataAvailablityDispatcher(
            dataAvailablityRequest
          )
        }

        return await createViaDispatcher(request)
      }

      return createTypedData(request)
    } catch {}
  }

  if (!selectedChannel || !selectedChannelId) {
    return null
  }

  return (
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
        <div className="relative w-full">
          <InputMentions
            placeholder={placeholder}
            autoComplete="off"
            validationError={errors.comment?.message}
            value={watch('comment')}
            onContentChange={(value) => {
              setValue('comment', value)
              clearErrors('comment')
            }}
            mentionsSelector="input-mentions-single"
          />
          {!hideEmojiPicker && (
            <div className="absolute bottom-2 right-2">
              <EmojiPicker
                onEmojiSelect={(emoji) =>
                  setValue('comment', `${getValues('comment')}${emoji}`)
                }
              />
            </div>
          )}
        </div>
      </div>
      <Button loading={loading}>
        <Trans>Comment</Trans>
      </Button>
    </form>
  )
}

export default NewComment
