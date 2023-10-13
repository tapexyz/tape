import CollectOutline from '@components/Common/Icons/CollectOutline'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { getPublication } from '@tape.xyz/generic'
import { type AnyPublication, TriStateValue } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData } from 'wagmi'

import CollectInfo from './CollectInfo'

type Props = {
  video: AnyPublication
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  text?: string
}

const CollectPublication: FC<Props> = ({ video, variant = 'solid', text }) => {
  const targetPublication = getPublication(video)
  const handleWrongNetwork = useHandleWrongNetwork()

  const [loading, setLoading] = useState(false)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [alreadyCollected, setAlreadyCollected] = useState(
    targetPublication.operations.hasActed.value
  )
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    // setAlreadyCollected(true)
    toast.success(t`Collected as NFT`)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  // const { data, loading: fetchingCollectModule } =
  //   usePublicationCollectModuleQuery({
  //     variables: { request: { publicationId: video?.id } }
  //   })
  const canAct = targetPublication.operations.canAct === TriStateValue.Yes

  // if (!canAct) {
  //   return null
  // }
  // const collectAmount =
  //   collectModule?.amount?.value ?? collectModule?.fee?.amount?.value
  // const currency =
  //   collectModule?.amount?.asset?.symbol ??
  //   collectModule?.fee?.amount?.asset?.symbol

  // const { write } = useContractWrite({
  //   address: LENSHUB_PROXY_ADDRESS,
  //   abi: LENSHUB_PROXY_ABI,
  //   functionName: 'collect',
  //   onError,
  //   onSuccess: () => onCompleted()
  // })

  // const [broadcast] = useBroadcastMutation({
  //   onError,
  //   onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  // })

  // const [createProxyActionFreeCollect] = useProxyActionMutation({
  //   onError,
  //   onCompleted: () => onCompleted()
  // })

  // const [createCollectTypedData] = useCreateCollectTypedDataMutation({
  //   onCompleted: async ({ createCollectTypedData }) => {
  //     const { typedData, id } =
  //       createCollectTypedData as CreateCollectBroadcastItemResult
  //     try {
  //       toast.loading(REQUESTING_SIGNATURE_MESSAGE)
  //       const signature = await signTypedDataAsync(getSignature(typedData))
  //       setUserSigNonce(userSigNonce + 1)
  //       const { data } = await broadcast({
  //         variables: { request: { id, signature } }
  //       })
  //       if (data?.broadcast?.__typename === 'RelayError') {
  //         const { profileId, pubId, data: collectData } = typedData.value
  //         return write?.({ args: [profileId, pubId, collectData] })
  //       }
  //     } catch {
  //       setLoading(false)
  //     }
  //   },
  //   onError
  // })

  // const createTypedData = async () => {
  //   await createCollectTypedData({
  //     variables: {
  //       request: { publicationId: video?.id },
  //       options: { overrideSigNonce: userSigNonce }
  //     }
  //   })
  // }

  // const viaProxyAction = async () => {
  //   const { data } = await createProxyActionFreeCollect({
  //     variables: {
  //       request: {
  //         collect: { freeCollect: { publicationId: video?.id } }
  //       }
  //     }
  //   })
  //   if (!data?.proxyAction) {
  //     await createTypedData()
  //   }
  // }

  // const collectNow = async () => {
  //   setShowCollectModal(false)
  //   setLoading(true)
  //   if (!Boolean(collectAmount) && !collectModule?.followerOnly) {
  //     Analytics.track(TRACK.PUBLICATION.COLLECT, { fee: false })
  //     await viaProxyAction()
  //   } else {
  //     Analytics.track(TRACK.PUBLICATION.COLLECT, { fee: true })
  //     await createTypedData()
  //   }
  // }

  // const onClickCollect = () => {
  //   if (!selectedSimpleProfile?.id) {
  //     return openConnectModal?.()
  //   }
  //   return setShowCollectModal(true)
  // }

  // const collectTooltipText = collectAmount ? (
  //   <span>
  //     <Trans>Collect as NFT for</Trans>
  //     <b className="ml-1 space-x-1">
  //       <span>{collectAmount}</span>
  //       <span>{currency}</span>
  //     </b>
  //   </span>
  // ) : (
  //   t`Collect as NFT`
  // )

  return (
    <Dialog.Root>
      {/* {showCollectModal && collectModule && (
        <CollectModal
          video={video}
          showModal={showCollectModal}
          setShowModal={setShowCollectModal}
          collectNow={collectNow}
          collecting={loading}
          collectModule={collectModule}
          fetchingCollectModule={fetchingCollectModule}
        />
      )} */}
      <Dialog.Trigger>
        <Button
          variant={variant}
          disabled={loading || alreadyCollected}
          highContrast
        >
          <CollectOutline className="h-5 w-5" />
          {text}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Collect</Dialog.Title>

        <Flex direction="column" gap="3">
          <CollectInfo publication={video} onCollect={() => {}} />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button highContrast>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default CollectPublication
