import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import { TextArea } from '@components/UIElements/TextArea'
import { BROADCAST_MUTATION } from '@gql/queries'
import { CREATE_COMMENT_VIA_DISPATHCER } from '@gql/queries/dispatcher'
import { CREATE_COMMENT_TYPED_DATA } from '@gql/queries/typed-data'
import { zodResolver } from '@hookform/resolvers/zod'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE,
  STATIC_ASSETS
} from '@utils/constants'
import imageCdn from '@utils/functions/imageCdn'
import omitKey from '@utils/functions/omitKey'
import uploadToAr from '@utils/functions/uploadToAr'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { Mixpanel, TRACK } from '@utils/track'
import { BigNumber, utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { TbHeartHandshake } from 'react-icons/tb'
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes
} from 'src/types'
import { LenstubePublication } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import {
  useContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData
} from 'wagmi'
import { z } from 'zod'

type Props = {
  show: boolean
  setShowTip: React.Dispatch<boolean>
  video: LenstubePublication
}

const formSchema = z.object({
  tipQuantity: z
    .number()
    .min(1, { message: 'Tip amount requrired' })
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
  const [buttonText, setButtonText] = useState<string | null>(null)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error.message)
    setLoading(false)
    setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
  }

  const { config: prepareTxn } = usePrepareSendTransaction({
    request: {}
  })
  const { sendTransactionAsync } = useSendTransaction({
    ...prepareTxn,
    onError,
    mode: 'recklesslyUnprepared'
  })
  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeComment, data: writeCommentData } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onError
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError
  })

  const [createCommentViaDispatcher, { data: dispatcherData }] = useMutation(
    CREATE_COMMENT_VIA_DISPATHCER,
    {
      onError
    }
  )

  const { indexed } = usePendingTxn({
    txHash: writeCommentData?.hash,
    txId:
      broadcastData?.broadcast?.txId ??
      dispatcherData?.createCommentViaDispatcher?.txId
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
      toast.success('Tipped successfully.')
      setShowTip(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createCommentTypedData] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } = data.createCommentTypedData
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
        setButtonText('Commenting...')
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
          return writeComment?.({ recklesslySetUnpreparedArgs: args })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.reason)
          writeComment?.({ recklesslySetUnpreparedArgs: args })
      } catch (error) {
        logger.error('[Error Create Tip Comment Typed Data]', error)
      }
    },
    onError
  })

  const submitComment = async (txnHash: string) => {
    try {
      setLoading(true)
      setButtonText('Uploading to Arweave...')
      const { url } = await uploadToAr({
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: getValues('message'),
        content: getValues('message'),
        locale: 'en',
        mainContentFocus: PublicationMainFocus.TextOnly,
        external_url: LENSTUBE_URL,
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
      setButtonText('Commenting...')
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
      if (selectedChannel?.dispatcher?.canUseRelay) {
        createCommentViaDispatcher({ variables: { request } })
      } else {
        createCommentTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request
          }
        })
      }
    } catch (error) {
      logger.error('[Error Store & Tip Video]', error)
    }
  }

  const onSendTip = async () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    setButtonText('Sending...')
    const amountToSend = getValues('tipQuantity') * 1
    try {
      const data = await sendTransactionAsync?.({
        recklesslySetUnpreparedRequest: {
          to: video.profile?.ownedBy,
          value: BigNumber.from(utils.parseEther(amountToSend.toString()))
        }
      })
      Mixpanel.track(TRACK.TIP.SENT)
      if (data?.hash) await submitComment(data.hash)
    } catch (error) {
      setLoading(false)
      setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
      logger.error('[Error Send Tip]', error)
    }
  }

  return (
    <Modal
      title={
        <span className="flex items-center space-x-2 outline-none">
          <TbHeartHandshake />
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
          <Button disabled={loading}>
            {buttonText
              ? buttonText
              : `Send ${
                  isNaN(watchTipQuantity * 1) ? 0 : watchTipQuantity * 1
                } MATIC`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TipModal
