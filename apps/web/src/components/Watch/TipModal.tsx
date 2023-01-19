import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { BigNumber, utils } from 'ethers'
import type { CreatePublicCommentRequest, Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE,
  STATIC_ASSETS,
  TRACK
} from 'utils'
import getUserLocale from 'utils/functions/getUserLocale'
import imageCdn from 'utils/functions/imageCdn'
import omitKey from 'utils/functions/omitKey'
import uploadToAr from 'utils/functions/uploadToAr'
import logger from 'utils/logger'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSendTransaction, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  show: boolean
  setShowTip: React.Dispatch<boolean>
  video: Publication
}

const formSchema = z.object({
  tipQuantity: z
    .number()
    .min(1, { message: 'Tip amount required' })
    .nonnegative({ message: 'Should to greater than zero' }),
  message: z.string().min(1, { message: 'Message is requried' })
})
type FormData = z.infer<typeof formSchema>

const TipModal: FC<Props> = ({ show, setShowTip, video }) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipQuantity: 1,
      message: 'Thanks for the making this video!'
    }
  })
  const watchTipQuantity = watch('tipQuantity', 1)

  const [loading, setLoading] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error.message)
    setLoading(false)
  }

  const { sendTransactionAsync } = useSendTransaction({
    request: {},
    onError,
    mode: 'recklesslyUnprepared'
  })
  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    setQueuedComments([
      {
        comment: getValues('message'),
        txnId: txn.txnId,
        txnHash: txn.txnHash,
        pubId: video.id
      },
      ...(queuedComments || [])
    ])
    Analytics.track(TRACK.TIP.COMMENT)
    setLoading(false)
    toast.success('Tipped successfully.')
    setShowTip(false)
  }

  const onCompleted = (data: any) => {
    if (
      data?.broadcast?.reason === 'NOT_ALLOWED' ||
      data.createCommentViaDispatcher?.reason
    ) {
      return logger.error('[Error Comment Dispatcher]', data)
    }
    const txnId =
      data?.createCommentViaDispatcher?.txId ?? data?.broadcast?.txId
    return setToQueue({ txnId })
  }

  const { write: writeComment } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => {
      setToQueue({ txnHash: data.hash })
    }
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onError,
    onCompleted
  })

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
        setUserSigNonce(userSigNonce + 1)
        if (!RELAYER_ENABLED) {
          return writeComment?.({ recklesslySetUnpreparedArgs: [args] })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError')
          writeComment?.({ recklesslySetUnpreparedArgs: [args] })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const signTypedData = (request: CreatePublicCommentRequest) => {
    createCommentTypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request }
    })
    if (data?.createCommentViaDispatcher?.__typename === 'RelayError') {
      signTypedData(request)
    }
  }

  const submitComment = async (txnHash: string) => {
    try {
      setLoading(true)
      const { url } = await uploadToAr({
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: getValues('message'),
        content: getValues('message'),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.TextOnly,
        external_url: `${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`,
        image: null,
        imageMimeType: null,
        name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
        attributes: [
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            value: LENSTUBE_APP_ID
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'type',
            value: 'tip'
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'hash',
            value: txnHash
          }
        ],
        media: [],
        appId: LENSTUBE_APP_ID
      })
      const request = {
        profileId: selectedChannel?.id,
        publicationId: video?.id,
        contentURI: url,
        collectModule: {
          freeCollectModule: {
            followerOnly: false
          }
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return signTypedData(request)
      }
      await createViaDispatcher(request)
    } catch {}
  }

  const onSendTip = async () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    const amountToSend = Number(getValues('tipQuantity')) * 1
    try {
      const data = await sendTransactionAsync?.({
        recklesslySetUnpreparedRequest: {
          to: video.profile?.ownedBy,
          value: BigNumber.from(utils.parseEther(amountToSend.toString()))
        }
      })
      Analytics.track(TRACK.TIP.SENT)
      if (data?.hash) await submitComment(data.hash)
    } catch (error) {
      setLoading(false)
      logger.error('[Error Send Tip]', error)
    }
  }

  return (
    <Modal
      title={
        <span className="flex items-center space-x-2 outline-none">
          <HeartOutline className="w-4 h-4" />
          <span>Tip {video.profile?.handle}</span>
        </span>
      }
      onClose={() => setShowTip(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <form className="mt-2" onSubmit={handleSubmit(onSendTip)}>
        <div className="flex items-center justify-center p-10 space-x-2 flex-nowrap">
          <span className="flex items-center space-x-4">
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/raise-hand.png`,
                'avatar_lg'
              )}
              alt="Raising Hand"
              className="h-10"
              loading="eager"
              draggable={false}
            />
            <span>x</span>
            <Input
              {...register('tipQuantity', { valueAsNumber: true })}
              className="w-14"
              min={1}
              type="number"
            />
          </span>
        </div>
        <div className="mt-4">
          <TextArea
            label="Message"
            {...register('message')}
            placeholder="Say something nice"
            autoComplete="off"
            className="w-full p-2 text-sm bg-white border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl dark:bg-gray-900 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20"
            rows={3}
          />
          <div className="text-[11px] mx-1 mt-1 opacity-50">
            This will be published as public comment.
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="w-1/2 truncate">
            {(errors.tipQuantity || errors.message) && (
              <div>
                <p className="text-xs font-medium text-red-500">
                  {errors?.tipQuantity?.message || errors?.message?.message}
                </p>
              </div>
            )}
          </span>
          <Button disabled={loading} loading={loading}>
            {`Tip ${
              isNaN(Number(watchTipQuantity) * 1)
                ? 0
                : Number(watchTipQuantity) * 1
            } MATIC`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TipModal
