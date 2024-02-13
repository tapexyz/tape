import { zodResolver } from '@hookform/resolvers/zod'
import { MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
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
  getPublicationData,
  getSignature,
  imageCdn,
  logger,
  Tower,
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
import { Button, Input, TextArea } from '@tape.xyz/ui'
import type { Dispatch, FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { parseEther } from 'viem'
import { useSendTransaction, useSignTypedData, useWriteContract } from 'wagmi'
import type { z } from 'zod'
import { number, object, string } from 'zod'

type Props = {
  video: AnyPublication
  setShow: Dispatch<boolean>
}

const formSchema = object({
  tipQuantity: number()
    .nonnegative({ message: `Tip should to greater than zero` })
    .max(100, { message: `Tip should be less than or equal to 100 MATIC` })
    .refine((n) => n > 0, { message: `Tip should be greater than 0 MATIC` }),
  message: string().min(1, { message: `Tip message is requried` })
})
type FormData = z.infer<typeof formSchema>

const TipForm: FC<Props> = ({ video, setShow }) => {
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
      message: `Thanks for creating this content!`
    }
  })
  const watchTipQuantity = watch('tipQuantity', 1)

  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error.message)
    setLoading(false)
  }

  const { sendTransactionAsync } = useSendTransaction({
    mutation: { onError }
  })
  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn.txnHash || txn.txnId) {
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
    setLoading(false)
    setShow(false)
    toast.success(`Tipped successfully`)
    Tower.track(EVENTS.PUBLICATION.NEW_COMMENT, {
      publication_id: targetVideo.id,
      comment_type: 'tip',
      publication_state: targetVideo.momoka?.proof ? 'MOMOKA' : 'ON_CHAIN'
    })
  }

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (hash) => {
        setToQueue({ txnHash: hash })
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
        fetchAndCacheComment(commentOnMomoka.id)
      }
    }
  })

  const submitComment = async (txnHash: string) => {
    try {
      setLoading(true)
      const attributes = [
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

      const title = getPublicationData(targetVideo.metadata)?.title
      const profileSlug = getProfile(activeProfile)?.slug
      const metadata = textOnly({
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes,
        content: getValues('message'),
        locale: getUserLocale(),
        marketplace: {
          name: `${profileSlug}'s comment on video ${title}`,
          attributes,
          description: getValues('message'),
          external_url: `${TAPE_WEBSITE_URL}/watch/${video?.id}`
        }
      })
      const metadataUri = await uploadToAr(metadata)

      if (targetVideo.momoka?.proof) {
        // MOMOKA
        if (canUseLensManager) {
          return await commentOnMomoka({
            variables: {
              request: {
                contentURI: metadataUri,
                commentOn: targetVideo.id
              }
            }
          })
        }

        return await createMomokaCommentTypedData({
          variables: {
            request: {
              contentURI: metadataUri,
              commentOn: targetVideo.id
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
      logger.error('[NEW TIP ERROR]', error)
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
      const hash = await sendTransactionAsync?.({
        to: targetVideo.by?.ownedBy.address,
        value: BigInt(parseEther(amountToSend.toString()))
      })
      if (hash) {
        await submitComment(hash)
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
          className="w-full rounded-xl border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-800"
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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
          <Button loading={loading} disabled={!isValid || loading}>
            {`Tip ${
              isNaN(Number(watchTipQuantity) * 1) ||
              Number(watchTipQuantity) < 0
                ? 0
                : Number(watchTipQuantity) * 1
            } MATIC`}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default TipForm
