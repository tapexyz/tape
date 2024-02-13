import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getPublication,
  getPublicationData,
  getSignature,
  logger,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  AnyPublication,
  CreateMomokaCommentEip712TypedData,
  CreateOnchainCommentEip712TypedData
} from '@tape.xyz/lens'
import {
  PublicationDocument,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCommentOnchainMutation,
  useCommentOnMomokaMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  usePublicationLazyQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData, useWriteContract } from 'wagmi'
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
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
        if (hash) {
          setToQueue({ txnHash: hash })
        }
        onCompleted()
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'comment',
      args
    })
  }

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
              return await write({ args })
            }
            return
          }
          return await write({ args })
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
              return await write({ args })
            }
            return
          }
          return await write({ args })
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
      await handleWrongNetwork()

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

      const title = getPublicationData(targetVideo.metadata)?.title
      const profileSlug = getProfile(activeProfile)?.slug
      const metadata = textOnly({
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes,
        content: trimify(formData.comment),
        locale: getUserLocale(),
        marketplace: {
          name: `${profileSlug}'s comment on video ${title}`,
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
      logger.error('[NEW COMMENT ERROR]', error)
    }
  }

  if (!activeProfile?.id) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit(submitComment)}
      className="mb-2 flex w-full flex-col flex-wrap items-end gap-2"
    >
      <div className="relative flex w-full flex-1 items-start space-x-2 md:space-x-3">
        <InputMentions
          placeholder={placeholder}
          autoComplete="off"
          error={errors.comment?.message}
          value={watch('comment')}
          onContentChange={(value) => {
            setValue('comment', value)
            clearErrors('comment')
          }}
          className="w-full !pb-1"
        />
        {!hideEmojiPicker && (
          <div className="absolute right-2 top-2">
            <EmojiPicker
              onEmojiSelect={(emoji) =>
                setValue('comment', `${getValues('comment')}${emoji}`)
              }
            />
          </div>
        )}
      </div>
      <Button loading={loading} disabled={loading}>
        Comment
      </Button>
    </form>
  )
}

export default NewComment
