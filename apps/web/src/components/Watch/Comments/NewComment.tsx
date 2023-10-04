import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import { LENSHUB_PROXY_ABI } from '@lenstube/abis'
import { Analytics, getUserLocale, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getProfilePicture,
  getPublication,
  getSignature,
  trimify,
  uploadToAr
} from '@lenstube/generic'
import type {
  AnyPublication,
  CreateMomokaCommentEip712TypedData,
  CreateOnchainCommentEip712TypedData
} from '@lenstube/lens'
import {
  PublicationDocument,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCommentOnchainMutation,
  useCommentOnMomokaMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  usePublicationLazyQuery
} from '@lenstube/lens'
import { useApolloClient } from '@lenstube/lens/apollo'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

type Props = {
  video: AnyPublication
  defaultValue?: string
  placeholder?: string
  hideEmojiPicker?: boolean
}

const formSchema = object({
  comment: string({ required_error: t`Enter valid comment` })
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
  const activeChannel = useChannelStore((state) => state.activeChannel)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const handleWrongNetwork = useHandleWrongNetwork()
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor
  const targetVideo = getPublication(video)

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
          pubId: targetVideo.id
        },
        ...(queuedComments || [])
      ])
    }
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    Analytics.track(TRACK.PUBLICATION.NEW_COMMENT, {
      publication_id: targetVideo.id,
      publication_state: targetVideo.momoka?.proof ? 'DATA_ONLY' : 'ON_CHAIN'
    })
    reset()
    setLoading(false)
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'comment',
    onSuccess: (data) => {
      onCompleted()
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError
  })

  const [getComment] = usePublicationLazyQuery()

  const fetchAndCacheComment = async (commentId: string) => {
    const { data } = await getComment({
      variables: {
        request: {
          forId: commentId
        }
      }
    })
    if (data?.publication) {
      cache.modify({
        fields: {
          publications() {
            cache.writeQuery({
              data: { publication: data?.publication },
              query: PublicationDocument
            })
          }
        }
      })
    }
  }

  const getSignatureFromTypedData = async (
    data:
      | CreateMomokaCommentEip712TypedData
      | CreateOnchainCommentEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      onCompleted(broadcastOnchain.__typename)
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        const txnId = broadcastOnchain?.txId
        setToQueue({ txnId })
      }
      onCompleted(broadcastOnchain.__typename)
    }
  })

  const [createOnchainCommentTypedData] =
    useCreateOnchainCommentTypedDataMutation({
      onCompleted: async ({ createOnchainCommentTypedData }) => {
        const { typedData, id } = createOnchainCommentTypedData
        try {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return write?.({ args: [typedData.value] })
          }
        } catch {}
      },
      onError
    })

  const [commentOnchain] = useCommentOnchainMutation({
    onError,
    onCompleted: ({ commentOnchain }) => {
      if (commentOnchain.__typename === 'RelaySuccess') {
        setToQueue({ txnId: commentOnchain.txId })
        onCompleted(commentOnchain.__typename)
      }
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        fetchAndCacheComment(broadcastOnMomoka?.id)
      }
      onCompleted()
    }
  })

  const [createMomokaCommentTypedData] =
    useCreateMomokaCommentTypedDataMutation({
      onCompleted: async ({ createMomokaCommentTypedData }) => {
        const { typedData, id } = createMomokaCommentTypedData
        try {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return write?.({ args: [typedData.value] })
          }
        } catch {}
      },
      onError
    })

  const [commentOnMomoka] = useCommentOnMomokaMutation({
    onError,
    onCompleted: ({ commentOnMomoka }) => {
      if (commentOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted()
        fetchAndCacheComment(commentOnMomoka.id)
      }
    }
  })

  const submitComment = async (formData: FormData) => {
    if (video.momoka?.proof && !activeChannel?.sponsor) {
      return toast.error(
        t`Momoka is currently in beta - during this time certain actions are not available to all profiles.`
      )
    }
    try {
      if (handleWrongNetwork()) {
        return
      }
      setLoading(true)
      const attributes: MetadataAttribute[] = [
        {
          type: MetadataAttributeType.STRING,
          key: 'publication',
          value: video.id
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'creator',
          value: `${activeChannel?.handle}`
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'app',
          value: LENSTUBE_WEBSITE_URL
        }
      ]
      const metadata = textOnly({
        appId: LENSTUBE_APP_ID,
        id: uuidv4(),
        attributes,
        content: trimify(formData.comment),
        locale: getUserLocale(),
        marketplace: {
          name: `${activeChannel?.handle}'s comment on video ${targetVideo.metadata.marketplace?.name}`,
          attributes,
          description: trimify(formData.comment),
          external_url: `${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (video.momoka?.proof) {
        // MOMOKA
        if (canUseRelay) {
          return await commentOnMomoka({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: video.id
              }
            }
          })
        } else {
          return await createMomokaCommentTypedData({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: video.id
              }
            }
          })
        }
      } else {
        // ON-CHAIN
        if (canUseRelay) {
          return await commentOnchain({
            variables: {
              request: {
                commentOn: targetVideo.id,
                contentURI: metadataUri
              }
            }
          })
        } else {
          return await createOnchainCommentTypedData({
            variables: {
              request: {
                commentOn: targetVideo.id,
                contentURI: metadataUri
              }
            }
          })
        }
      }
    } catch (error) {
      console.error('🚀 ~ ', error)
    }
  }

  if (!activeChannel || !selectedSimpleProfile?.id) {
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
            src={getProfilePicture(activeChannel, 'AVATAR')}
            className="h-9 w-9 rounded-full"
            draggable={false}
            alt={activeChannel?.handle}
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
      <Button variant="outline" loading={loading}>
        <Trans>Comment</Trans>
      </Button>
    </form>
  )
}

export default NewComment
