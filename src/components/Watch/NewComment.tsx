import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import {
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL,
  RELAYER_ENABLED
} from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import {
  BROADCAST_MUTATION,
  CREATE_COMMENT_TYPED_DATA
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CreateCommentBroadcastItemResult } from 'src/types'
import { LenstubePublication } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData
} from 'wagmi'
import { z } from 'zod'

type Props = {
  video: LenstubePublication
  refetchComments: () => void
}
const formSchema = z.object({
  comment: z.string().min(1, { message: 'Enter valid comment' })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({ video, refetchComments }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Comment')
  const { isAuthenticated, selectedChannel } = usePersistStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onError = () => {
    setButtonText('Comment')
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError(error: any) {
      onError()
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const { config: prepareCommentWrite } = usePrepareContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig'
  })
  const { write: writeComment, data: writeCommentData } = useContractWrite({
    ...prepareCommentWrite,
    onSuccess() {
      setButtonText('Indexing...')
      reset()
    }
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError(error) {
      toast.error(error.message)
      onError()
    }
  })

  const { indexed } = usePendingTxn(
    writeCommentData?.hash || broadcastData?.broadcast?.txHash
  )

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      refetchComments()
      setButtonText('Comment')
      reset()
      toast.success('Commented successfully.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createTypedData] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createCommentTypedData as CreateCommentBroadcastItemResult
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
      setButtonText('Signing...')
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
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
        setButtonText('Commenting...')
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason)
            writeComment?.({ recklesslySetUnpreparedArgs: args })
        } else {
          writeComment?.({ recklesslySetUnpreparedArgs: args })
        }
      } catch (error) {
        onError()
        logger.error('[Error New Comment]', error)
      }
    },
    onError
  })

  const submitComment = async (data: FormData) => {
    setButtonText('Storing metadata...')
    setLoading(true)
    const { ipfsUrl } = await uploadDataToIPFS({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: data.comment,
      content: data.comment,
      external_url: LENSTUBE_URL,
      image: null,
      imageMimeType: null,
      name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
      attributes: [
        {
          displayType: 'string',
          traitType: 'publication',
          key: 'publication',
          value: 'comment'
        },
        {
          displayType: 'string',
          traitType: 'app',
          key: 'app',
          value: LENSTUBE_APP_ID
        }
      ],
      media: [],
      appId: LENSTUBE_APP_ID
    })
    createTypedData({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          publicationId: video?.id,
          contentURI: ipfsUrl,
          collectModule: {
            freeCollectModule: {
              followerOnly: false
            }
          },
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  if (!selectedChannel || !isAuthenticated) return null

  return (
    <div className="my-1">
      <form
        onSubmit={handleSubmit(submitComment)}
        className="flex items-start mb-2 space-x-1 md:space-x-3"
      >
        <div className="flex-none">
          <img
            src={getProfilePicture(selectedChannel, 'avatar')}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl"
            draggable={false}
            alt="channel picture"
          />
        </div>
        <TextArea
          {...register('comment')}
          placeholder="How's this video?"
          autoComplete="off"
          rows={1}
          hideErrorMessage
          className="!py-1.5 md:!py-2"
          validationError={errors.comment?.message}
        />
        <Button disabled={loading}>{buttonText}</Button>
      </form>
    </div>
  )
}

export default NewComment
