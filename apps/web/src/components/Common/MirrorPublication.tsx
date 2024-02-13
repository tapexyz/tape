import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getSignature,
  Tower
} from '@tape.xyz/generic'
import type {
  CreateMomokaMirrorEip712TypedData,
  CreateOnchainMirrorEip712TypedData,
  MirrorablePublication,
  MomokaMirrorRequest
} from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnchainMutation,
  useMirrorOnMomokaMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

type Props = {
  video: MirrorablePublication
  onMirrorSuccess?: () => void
  children: React.ReactNode
  successToast?: string
}

const MirrorPublication: FC<Props> = ({
  video,
  children,
  onMirrorSuccess,
  successToast = 'Mirrored video across lens.'
}) => {
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    onMirrorSuccess?.()
    setLoading(false)
    toast.success(successToast)
    Tower.track(EVENTS.PUBLICATION.MIRROR, {
      publication_id: video.id,
      publication_state: video.momoka?.proof ? 'MOMOKA' : 'ON_CHAIN'
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        onCompleted()
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
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
      functionName: 'mirror',
      args
    })
  }

  const getSignatureFromTypedData = async (
    data: CreateMomokaMirrorEip712TypedData | CreateOnchainMirrorEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        onCompleted()
      }
    }
  })

  const [createOnChainMirrorTypedData] =
    useCreateOnchainMirrorTypedDataMutation({
      onCompleted: async ({ createOnchainMirrorTypedData }) => {
        const { typedData, id } = createOnchainMirrorTypedData
        try {
          if (canBroadcast) {
            const signature = await getSignatureFromTypedData(typedData)
            const { data } = await broadcastOnchain({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return await write({ args: [typedData.value] })
            }
            return
          }
          return await write({ args: [typedData.value] })
        } catch {}
      },
      onError
    })

  const [mirrorOnChain] = useMirrorOnchainMutation({
    onCompleted: async (data) => {
      if (data?.mirrorOnchain.__typename === 'LensProfileManagerRelayError') {
        return await createOnChainMirrorTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: {
              mirrorOn: video.id
            }
          }
        })
      }
      onCompleted()
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
      }
    }
  })

  const [createMomokaMirrorTypedData] = useCreateMomokaMirrorTypedDataMutation({
    onCompleted: async ({ createMomokaMirrorTypedData }) => {
      const { typedData, id } = createMomokaMirrorTypedData
      try {
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return write({ args: [typedData.value] })
          }
          return
        }
        return write({ args: [typedData.value] })
      } catch {}
    },
    onError
  })

  const [mirrorOnMomoka] = useMirrorOnMomokaMutation({
    onCompleted: () => onCompleted()
  })

  const mirrorPublication = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    if (video.momoka?.proof && !activeProfile?.sponsor) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      )
    }

    try {
      setLoading(true)
      const request: MomokaMirrorRequest = {
        mirrorOn: video.id
      }
      // MOMOKA
      if (video.momoka?.proof) {
        if (canUseLensManager) {
          return await mirrorOnMomoka({
            variables: {
              request
            }
          })
        }
        return await createMomokaMirrorTypedData({
          variables: {
            request
          }
        })
      }

      //  ON-CHAIN
      if (canUseLensManager) {
        return await mirrorOnChain({
          variables: {
            request
          }
        })
      }
      return await createOnChainMirrorTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      })
    } catch {}
  }

  return (
    <div className="inline-flex">
      <button
        type="button"
        className="disabled:opacity-50"
        disabled={loading}
        onClick={() => mirrorPublication()}
      >
        {children}
      </button>
    </div>
  )
}

export default MirrorPublication
