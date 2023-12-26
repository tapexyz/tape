import type {
  AnyPublication,
  CreateMomokaCommentEip712TypedData,
  CreateOnchainCommentEip712TypedData
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { Dispatch, FC } from 'react'
import type { z } from 'zod'

import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import { Button, Flex } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale } from '@tape.xyz/browser'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED,
  STATIC_ASSETS,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getPublication,
  getSignature,
  imageCdn,
  logger,
  Tower,
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
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { parseEther } from 'viem'
import { useContractWrite, useSendTransaction, useSignTypedData } from 'wagmi'
import { number, object, string } from 'zod'

type Props = {
  setShow: Dispatch<boolean>
  video: AnyPublication
}

const formSchema = object({
  message: string().min(1, { message: `Tip message is requried` }),
  tipQuantity: number()
    .nonnegative({ message: `Tip should to greater than zero` })
    .max(100, { message: `Tip should be less than or equal to 100 MATIC` })
    .refine((n) => n > 0, { message: `Tip should be greater than 0 MATIC` })
})
type FormData = z.infer<typeof formSchema>

const TipForm: FC<Props> = ({ setShow, video }) => {
  const targetVideo = getPublication(video)

  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    watch
  } = useForm<FormData>({
    defaultValues: {
      message: `Thanks for creating this content!`,
      tipQuantity: 1
    },
    resolver: zodResolver(formSchema)
  })
  const watchTipQuantity = watch('tipQuantity', 1)

  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)

  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error.message)
    setLoading(false)
  }

  const { sendTransactionAsync } = useSendTransaction({
    onError
  })
  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const setToQueue = (txn: { txnHash?: string; txnId?: string }) => {
    if (txn.txnHash || txn.txnId) {
      setQueuedComments([
        {
          comment: getValues('message'),
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
    setLoading(false)
    setShow(false)
    toast.success(`Tipped successfully`)
    Tower.track(EVENTS.PUBLICATION.NEW_COMMENT, {
      comment_type: 'tip',
      publication_id: targetVideo.id,
      publication_state: targetVideo.momoka?.proof ? 'MOMOKA' : 'ON_CHAIN'
    })
  }

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'comment',
    onError,
    onSuccess: (data) => {
      setToQueue({ txnHash: data.hash })
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
        onCompleted(commentOnchain.__typename)
        setToQueue({ txnId: commentOnchain.txId })
      }
    },
    onError
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        fetchAndCacheComment(broadcastOnMomoka?.id)
      }
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
        fetchAndCacheComment(commentOnMomoka.id)
      }
    },
    onError
  })

  const submitComment = async (txnHash: string) => {
    try {
      setLoading(true)
      const attributes = [
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
        },
        {
          key: 'type',
          type: MetadataAttributeType.STRING,
          value: 'TIP'
        },
        {
          key: 'hash',
          type: MetadataAttributeType.STRING,
          value: txnHash
        }
      ]
      const metadata = textOnly({
        appId: TAPE_APP_ID,
        attributes,
        content: getValues('message'),
        id: uuidv4(),
        locale: getUserLocale(),
        marketplace: {
          attributes,
          description: getValues('message'),
          external_url: `${TAPE_WEBSITE_URL}/watch/${video?.id}`,
          name: `${getProfile(activeProfile)
            ?.slug}'s comment on video ${targetVideo.metadata.marketplace
            ?.name}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (targetVideo.momoka?.proof) {
        // MOMOKA
        if (canUseLensManager) {
          return await commentOnMomoka({
            variables: {
              request: {
                commentOn: targetVideo.id,
                contentURI: metadataUri
              }
            }
          })
        }

        return await createMomokaCommentTypedData({
          variables: {
            request: {
              commentOn: targetVideo.id,
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
          request: {
            commentOn: targetVideo.id,
            contentURI: metadataUri
          }
        }
      })
    } catch (error) {
      console.error('🚀 ~ ', error)
    }
  }

  const onSendTip = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (video.momoka?.proof && !activeProfile?.sponsor) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      )
    }
    setLoading(true)
    const amountToSend = Number(getValues('tipQuantity')) * 1
    try {
      const data = await sendTransactionAsync?.({
        to: targetVideo.by?.ownedBy.address,
        value: BigInt(parseEther(amountToSend.toString() as `${number}`))
      })
      if (data?.hash) {
        await submitComment(data.hash)
      }
      Tower.track(EVENTS.PUBLICATION.TIP.SENT)
    } catch (error) {
      setLoading(false)
      logger.error('[Error Send Tip]', error)
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSendTip)}>
      <div className="flex flex-nowrap items-center justify-center space-x-2 p-10">
        <span className="flex items-center space-x-4">
          <img
            alt="Raising Hand"
            className="h-10"
            draggable={false}
            loading="eager"
            src={imageCdn(
              `${STATIC_ASSETS}/images/raise-hand.png`,
              'AVATAR_LG'
            )}
          />
          <span>x</span>
          <Input
            className="w-14"
            step="any"
            type="number"
            {...register('tipQuantity', { valueAsNumber: true })}
          />
        </span>
      </div>
      <div className="mt-4">
        <TextArea
          label="Message"
          {...register('message')}
          autoComplete="off"
          className="w-full rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-800"
          placeholder="Say something nice"
          rows={3}
        />
        <div className="mt-1 text-xs opacity-70">
          This will be published as a public comment
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="w-1/2 truncate">
          {(errors.tipQuantity || errors.message) && (
            <div>
              <p className="text-xs font-medium text-red-500">
                {errors?.tipQuantity?.message || errors?.message?.message}
              </p>
            </div>
          )}
        </span>
        <Flex gap="2">
          <Button onClick={() => setShow(false)} type="button" variant="soft">
            Cancel
          </Button>
          <Button disabled={!isValid || loading} highContrast>
            {`Tip ${
              isNaN(Number(watchTipQuantity) * 1) ||
              Number(watchTipQuantity) < 0
                ? 0
                : Number(watchTipQuantity) * 1
            } MATIC`}
          </Button>
        </Flex>
      </div>
    </form>
  )
}

export default TipForm
