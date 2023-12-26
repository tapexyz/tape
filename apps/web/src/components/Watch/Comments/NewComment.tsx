import type { MetadataAttribute } from '@lens-protocol/metadata'
import type {
  AnyPublication,
  CreateMomokaCommentEip712TypedData,
  CreateOnchainCommentEip712TypedData
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import type { z } from 'zod'

import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import { Button } from '@radix-ui/themes'
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
  getProfilePicture,
  getPublication,
  getPublicationData,
  getSignature,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
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
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string } from 'zod'

type Props = {
  defaultValue?: string
  hideEmojiPicker?: boolean
  placeholder?: string
  resetReply?: () => void
  video: AnyPublication
}

const formSchema = object({
  comment: string({ required_error: `Enter valid comment` })
    .trim()
    .min(1, { message: `Enter valid comment` })
    .max(5000, { message: `Comment should not exceed 5000 characters` })
})
type FormData = z.infer<typeof formSchema>

const NewComment: FC<Props> = ({
  defaultValue = '',
  hideEmojiPicker = false,
  placeholder = 'What do you think?',
  resetReply,
  video
}) => {
  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)

  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)
  const targetVideo = getPublication(video)

  const {
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch
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

  const setToQueue = (txn: { txnHash?: string; txnId?: string }) => {
    if (txn.txnHash || txn.txnId) {
      setQueuedComments([
        {
          comment: getValues('comment'),
          pubId: targetVideo.id,
          txnHash: txn.txnHash,
          txnId: txn.txnId
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
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'comment',
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    },
    onSuccess: (data) => {
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
      onCompleted()
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
        const { id, typedData } = createOnchainCommentTypedData
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
    onCompleted: ({ commentOnchain }) => {
      if (commentOnchain.__typename === 'RelaySuccess') {
        setToQueue({ txnId: commentOnchain.txId })
        onCompleted(commentOnchain.__typename)
      }
    },
    onError
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
        const { id, typedData } = createMomokaCommentTypedData
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
    onCompleted: ({ commentOnMomoka }) => {
      if (commentOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted()
        fetchAndCacheComment(commentOnMomoka.id)
      }
    },
    onError
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
          key: 'publication',
          type: MetadataAttributeType.STRING,
          value: video.id
        },
        {
          key: 'creator',
          type: MetadataAttributeType.STRING,
          value: `${getProfile(activeProfile)?.slug}`
        },
        {
          key: 'app',
          type: MetadataAttributeType.STRING,
          value: TAPE_WEBSITE_URL
        }
      ]
      const metadata = textOnly({
        appId: TAPE_APP_ID,
        attributes,
        content: trimify(formData.comment),
        id: uuidv4(),
        locale: getUserLocale(),
        marketplace: {
          attributes,
          description: trimify(formData.comment),
          external_url: `${TAPE_WEBSITE_URL}/watch/${video?.id}`,
          name: `${getProfile(activeProfile)
            ?.slug}'s comment on video ${getPublicationData(
            targetVideo.metadata
          )?.title}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (video.momoka?.proof) {
        // MOMOKA
        if (canUseLensManager) {
          return await commentOnMomoka({
            variables: {
              request: {
                commentOn: video.id,
                contentURI: metadataUri
              }
            }
          })
        }

        return await createMomokaCommentTypedData({
          variables: {
            request: {
              commentOn: video.id,
              contentURI: metadataUri
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
      className="mb-2 flex w-full flex-wrap items-start justify-end gap-2"
      onSubmit={handleSubmit(submitComment)}
    >
      <div className="flex flex-1 items-start space-x-2 md:space-x-3">
        <div className="flex-none">
          <img
            alt={getProfile(activeProfile)?.slug}
            className="size-8 rounded-full"
            draggable={false}
            src={getProfilePicture(activeProfile, 'AVATAR')}
          />
        </div>
        <div className="relative w-full">
          <InputMentions
            autoComplete="off"
            mentionsSelector="input-mentions-single !pb-1"
            onContentChange={(value) => {
              setValue('comment', value)
              clearErrors('comment')
            }}
            placeholder={placeholder}
            validationError={errors.comment?.message}
            value={watch('comment')}
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
      <Button disabled={loading} variant="surface">
        Comment
      </Button>
    </form>
  )
}

export default NewComment
