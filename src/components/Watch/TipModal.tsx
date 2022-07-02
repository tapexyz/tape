import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE,
  STATIC_ASSETS
} from '@utils/constants'
import imageCdn from '@utils/functions/imageCdn'
import omitKey from '@utils/functions/omitKey'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import {
  BROADCAST_MUTATION,
  CREATE_COMMENT_TYPED_DATA
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { BigNumber, utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { TbHeartHandshake } from 'react-icons/tb'
import { LenstubePublication } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { useSendTransaction } from 'wagmi'
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

  const { selectedChannel, isAuthenticated } = usePersistStore()
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState<string | null>(null)

  const onError = () => {
    setLoading(false)
    setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
  }

  const { sendTransactionAsync } = useSendTransaction({
    onError
  })
  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeComment, data: writeCommentData } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'commentWithSig',
    onError
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError
  })

  const { indexed } = usePendingTxn(
    writeCommentData?.hash || broadcastData?.broadcast?.txHash
  )

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
      toast.success('Tipped successfully.')
      setShowTip(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createTypedData] = useMutation(CREATE_COMMENT_TYPED_DATA, {
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
        setUserSigNonce(userSigNonce + 1)
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
        if (RELAYER_ENABLED) {
          broadcast({ variables: { request: { id, signature } } })
        } else {
          writeComment({ args })
        }
      } catch (error) {
        onError()
      }
    },
    onError
  })

  const submitComment = async () => {
    setLoading(true)
    setButtonText('Storing...')
    const { ipfsUrl } = await uploadDataToIPFS({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: getValues('message'),
      content: getValues('message'),
      external_url: null,
      image: null,
      imageMimeType: null,
      name: `${selectedChannel?.handle}'s comment on video ${video.metadata.name}`,
      attributes: [
        {
          traitType: 'string',
          trait_type: 'publication',
          key: 'publication',
          value: 'comment'
        },
        {
          traitType: 'string',
          key: 'app',
          trait_type: 'app',
          value: LENSTUBE_APP_ID
        },
        {
          traitType: 'string',
          key: 'type',
          trait_type: 'type',
          value: 'tip'
        }
      ],
      media: [],
      appId: LENSTUBE_APP_ID
    })
    createTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
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

  const onSendTip = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    setButtonText('Sending...')
    const amountToSend = getValues('tipQuantity') * 1
    sendTransactionAsync({
      request: {
        to: video.profile?.ownedBy,
        value: BigNumber.from(utils.parseEther(amountToSend.toString()))
      }
    })
      .then(() => {
        submitComment()
      })
      .catch(() => {
        setLoading(false)
        setButtonText(`Send ${watchTipQuantity * 1} MATIC`)
      })
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
      <form className="mt-4" onSubmit={handleSubmit(onSendTip)}>
        <div className="flex items-center justify-center p-10 space-x-2 flex-nowrap">
          <span className="flex items-center space-x-4">
            <img
              src={imageCdn(`${STATIC_ASSETS}/images/raise-hand.png`)}
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
          <div className="flex items-center mb-1 space-x-1.5">
            <div className="text-[11px] font-semibold uppercase opacity-70">
              Message
            </div>
          </div>
          <textarea
            {...register('message')}
            placeholder="Say something nice"
            autoComplete="off"
            className="w-full p-2 text-sm bg-white border border-gray-200 outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl dark:bg-gray-900 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20"
            rows={3}
          />
          <div className="text-[11px] mx-1 opacity-50">
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
          <Button disabled={loading} onClick={() => {}}>
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
