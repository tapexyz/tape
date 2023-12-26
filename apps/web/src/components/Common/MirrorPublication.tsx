import type {
  CreateMomokaMirrorEip712TypedData,
  CreateOnchainMirrorEip712TypedData,
  MirrorablePublication,
  MomokaMirrorRequest
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

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
import {
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnchainMutation,
  useMirrorOnMomokaMutation
} from '@tape.xyz/lens'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  children: React.ReactNode
  onMirrorSuccess?: () => void
  successToast?: string
  video: MirrorablePublication
}

const MirrorPublication: FC<Props> = ({
  children,
  onMirrorSuccess,
  successToast = 'Mirrored video across lens.',
  video
}) => {
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { canBroadcast, canUseLensManager } =
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
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'mirror',
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    },
    onSuccess: () => {
      onCompleted()
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    }
  })

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
        const { id, typedData } = createOnchainMirrorTypedData
        try {
          if (canBroadcast) {
            const signature = await getSignatureFromTypedData(typedData)
            const { data } = await broadcastOnchain({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return write({ args: [typedData.value] })
            }
            return
          }
          return write({ args: [typedData.value] })
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
      const { id, typedData } = createMomokaMirrorTypedData
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
    if (handleWrongNetwork()) {
      return
    }

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
        className="disabled:opacity-50"
        disabled={loading}
        onClick={() => mirrorPublication()}
        type="button"
      >
        {children}
      </button>
    </div>
  )
}

export default MirrorPublication
