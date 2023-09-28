import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import { Analytics, getUserLocale, TRACK } from '@lenstube/browser'
import {
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE,
  STATIC_ASSETS
} from '@lenstube/constants'
import {
  getPublication,
  getSignature,
  imageCdn,
  logger,
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
import { Button } from '@radix-ui/themes'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { parseEther } from 'viem'
import { useContractWrite, useSendTransaction, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { number, object, string } from 'zod'

type Props = {
  video: AnyPublication
}

const formSchema = object({
  tipQuantity: number()
    .nonnegative({ message: t`Tip should to greater than zero` })
    .max(100, { message: t`Tip should be less than or equal to 100 MATIC` })
    .refine((n) => n > 0, { message: t`Tip should be greater than 0 MATIC` }),
  message: string().min(1, { message: t`Tip message is requried` })
})
type FormData = z.infer<typeof formSchema>

const TipForm: FC<Props> = ({ video }) => {
  const targetVideo = getPublication(video)

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipQuantity: 1,
      message: t`Thanks for making this video!`
    }
  })
  const watchTipQuantity = watch('tipQuantity', 1)

  const { openConnectModal } = useConnectModal()
  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
  const activeChannel = useChannelStore((state) => state.activeChannel)
  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

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

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
      setQueuedComments([
        {
          comment: getValues('message'),
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
    toast.success(t`Tipped successfully`)
    Analytics.track(TRACK.PUBLICATION.NEW_COMMENT, {
      publication_id: targetVideo.id,
      comment_type: 'tip',
      publication_state: targetVideo.momoka?.proof ? 'DATA_ONLY' : 'ON_CHAIN'
    })
    setLoading(false)
  }

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
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
        onCompleted(commentOnchain.__typename)
        setToQueue({ txnId: commentOnchain.txId })
      }
    }
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
        fetchAndCacheComment(commentOnMomoka.id)
      }
    }
  })

  const submitComment = async (txnHash: string) => {
    try {
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
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'type',
          value: 'TIP'
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'hash',
          value: txnHash
        }
      ]
      const metadata = textOnly({
        appId: LENSTUBE_APP_ID,
        id: uuidv4(),
        attributes,
        content: getValues('message'),
        locale: getUserLocale(),
        marketplace: {
          name: `${activeChannel?.handle}'s comment on video ${targetVideo.metadata.marketplace?.name}`,
          attributes,
          description: getValues('message'),
          external_url: `${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (targetVideo.momoka?.proof) {
        // MOMOKA
        if (canUseRelay) {
          return await commentOnMomoka({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: targetVideo.id
              }
            }
          })
        } else {
          return await createMomokaCommentTypedData({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: targetVideo.id
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

  const onSendTip = async () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (video.momoka?.proof && !activeChannel?.sponsor) {
      return toast.error(
        t`Momoka is currently in beta - during this time certain actions are not available to all profiles.`
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
      Analytics.track(TRACK.PUBLICATION.TIP.SENT)
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
            src={imageCdn(
              `${STATIC_ASSETS}/images/raise-hand.png`,
              'AVATAR_LG'
            )}
            alt="Raising Hand"
            className="h-10"
            loading="eager"
            draggable={false}
          />
          <span>x</span>
          <Input
            type="number"
            className="w-14"
            step="any"
            {...register('tipQuantity', { valueAsNumber: true })}
          />
        </span>
      </div>
      <div className="mt-4">
        <TextArea
          label="Message"
          {...register('message')}
          placeholder="Say something nice"
          autoComplete="off"
          className="w-full rounded-xl border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-800"
          rows={3}
        />
        <div className="mx-1 mt-1 text-[11px] opacity-50">
          <Trans>This will be published as a public comment.</Trans>
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
        <Button highContrast disabled={!isValid || loading}>
          {`Tip ${
            isNaN(Number(watchTipQuantity) * 1) || Number(watchTipQuantity) < 0
              ? 0
              : Number(watchTipQuantity) * 1
          } MATIC`}
        </Button>
      </div>
    </form>
  )
}

export default TipForm
