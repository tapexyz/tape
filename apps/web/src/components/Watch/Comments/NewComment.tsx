import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { LENSHUB_PROXY_ABI } from '@dragverse/abis'
import { getUserLocale } from '@dragverse/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@dragverse/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData,
  getSignature,
  Tower,
  trimify,
  uploadToAr
} from '@dragverse/generic'
import type {
  AnyPublication,
  CreateMomokaCommentEip712TypedData,
  CreateOnchainCommentEip712TypedData
} from '@dragverse/lens'
import {
  PublicationDocument,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCommentOnchainMutation,
  useCommentOnMomokaMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  usePublicationLazyQuery
} from '@dragverse/lens'
import { useApolloClient } from '@dragverse/lens/apollo'
import type { CustomErrorWithData } from '@dragverse/lens/custom-types'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { Button } from '@radix-ui/themes'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
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
  resetReply?: () => void
}

const formSchema = object({
  comment: string({ required_error: `Enter valid comment` })
    .trim()
    .min(1, { message: `Enter valid comment` })
    .max(5000, { message: `Comment should not exceed 5000 characters` })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({
  video,
  defaultValue = '',
  placeholder = 'What do you think?',
  hideEmojiPicker = false,
  resetReply
}) => {
  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)
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
    if (txn.txnHash || txn.txnId) {
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
    Tower.track(EVENTS.PUBLICATION.NEW_COMMENT, {
      publication_id: targetVideo.id,
      publication_state: targetVideo.momoka?.proof ? 'DATA_ONLY' : 'ON_CHAIN'
    })
    reset()
    resetReply?.()
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
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
      onCompleted()
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
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
        const args = [typedData.value]
        try {
          if (canBroadcast) {
            const signature = await getSignatureFromTypedData(typedData)
            const { data } = await broadcastOnchain({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return write({ args })
            }
            return
          }
          return write({ args })
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
        const args = [typedData.value]
        try {
          if (canBroadcast) {
            const signature = await getSignatureFromTypedData(typedData)
            const { data } = await broadcastOnMomoka({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
              return write({ args })
            }
            return
          }
          return write({ args })
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
    if (video.momoka?.proof && !activeProfile?.sponsor) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
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
          value: `${getProfile(activeProfile)?.slug}`
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'app',
          value: TAPE_WEBSITE_URL
        }
      ]
      const metadata = textOnly({
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes,
        content: trimify(formData.comment),
        locale: getUserLocale(),
        marketplace: {
          name: `${getProfile(activeProfile)
            ?.slug}'s comment on video ${getPublicationData(
            targetVideo.metadata
          )?.title}`,
          attributes,
          description: trimify(formData.comment),
          external_url: `${TAPE_WEBSITE_URL}/watch/${video?.id}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (video.momoka?.proof) {
        // MOMOKA
        if (canUseLensManager) {
          return await commentOnMomoka({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: video.id
              }
            }
          })
        }

        return await createMomokaCommentTypedData({
          variables: {
            request: {
              contentURI: metadataUri,
              commentOn: video.id
            }
          }
        })
      }

      // ON-CHAIN
      if (canUseLensManager) {
        return await commentOnchain({
          variables: {
            request: {
              commentOn: targetVideo.id,
              contentURI: metadataUri
            }
          }
        })
      }

      return await createOnchainCommentTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            commentOn: targetVideo.id,
            contentURI: metadataUri
          }
        }
      })
    } catch (error) {
      console.error('🚀 ~ NewComment ', error)
    }
  }

  if (!activeProfile?.id) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit(submitComment)}
      className="mb-2 flex w-full flex-wrap items-start justify-end gap-2"
    >
      <div className="flex flex-1 items-start space-x-2 md:space-x-3">
        <div className="flex-none">
          <img
            src={getProfilePicture(activeProfile, 'AVATAR')}
            className="h-8 w-8 rounded-full"
            draggable={false}
            alt={getProfile(activeProfile)?.slug}
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
            mentionsSelector="input-mentions-single !pb-1"
          />
          {!hideEmojiPicker && (
            <div className="absolute right-2 top-1.5">
              <EmojiPicker
                onEmojiSelect={(emoji) =>
                  setValue('comment', `${getValues('comment')}${emoji}`)
                }
              />
            </div>
          )}
        </div>
      </div>
      <Button variant="surface" disabled={loading}>
        Comment
      </Button>
    </form>
  )
}

export default NewComment
