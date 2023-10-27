import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useAuthPersistStore from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import { EVENTS, getSignature, Tower } from '@tape.xyz/generic'
import type {
  CreateMomokaMirrorEip712TypedData,
  CreateOnchainMirrorEip712TypedData,
  MirrorablePublication
} from '@tape.xyz/lens'
import {
  TriStateValue,
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
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: MirrorablePublication
  onMirrorSuccess?: () => void
  children: React.ReactNode
}

const MirrorVideo: FC<Props> = ({ video, children, onMirrorSuccess }) => {
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const canUseRelay = activeProfile?.signless && activeProfile?.sponsor

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    onMirrorSuccess?.()
    toast.success('Mirrored video across lens.')
    setLoading(false)
    Tower.track(EVENTS.PUBLICATION.MIRROR, {
      publication_id: video.id,
      publication_state: video.momoka?.proof ? 'MOMOKA' : 'ON_CHAIN'
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'mirror',
    onSuccess: () => {
      onCompleted()
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
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
        const { typedData, id } = createOnchainMirrorTypedData
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

  const [mirrorOnMomoka] = useMirrorOnMomokaMutation({
    onCompleted: () => onCompleted()
  })

  const mirrorVideo = async () => {
    if (!selectedSimpleProfile?.id) {
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

      // MOMOKA
      if (video.momoka?.proof) {
        if (canUseRelay) {
          return await mirrorOnMomoka({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        }
        return await createMomokaMirrorTypedData({
          variables: {
            request: {
              mirrorOn: video.id
            }
          }
        })
      } else {
        //  ON-CHAIN
        if (canUseRelay) {
          return await mirrorOnChain({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        }
        return await createOnChainMirrorTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: {
              mirrorOn: video.id
            }
          }
        })
      }
    } catch {}
  }

  if (video?.operations.canMirror === TriStateValue.No) {
    return null
  }

  return (
    <div className="inline-flex">
      <button
        type="button"
        className="disabled:opacity-50"
        disabled={loading}
        onClick={() => mirrorVideo()}
      >
        {children}
      </button>
    </div>
  )
}

export default MirrorVideo
