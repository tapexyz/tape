import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import Tooltip from '@components/UIElements/Tooltip'
import { BROADCAST_MUTATION } from '@gql/queries'
import { CREATE_MIRROR_VIA_DISPATHCER } from '@gql/queries/dispatcher'
import { CREATE_MIRROR_TYPED_DATA } from '@gql/queries/typed-data'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateMirrorBroadcastItemResult, CreateMirrorRequest } from 'src/types'
import { LenstubePublication } from 'src/types/local'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: LenstubePublication
  onMirrorSuccess?: () => void
  children: React.ReactNode
}

const MirrorVideo: FC<Props> = ({ video, children, onMirrorSuccess }) => {
  const [loading, setLoading] = useState(false)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onMirrorSuccess?.()
    toast.success('Mirrored video across lens.')
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [createMirrorViaDispatcher] = useMutation(
    CREATE_MIRROR_VIA_DISPATHCER,
    {
      onError,
      onCompleted
    }
  )

  const { write: mirrorWithSig } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted
  })

  const [createMirrorTypedData] = useMutation(CREATE_MIRROR_TYPED_DATA, {
    async onCompleted(data) {
      const { id, typedData } =
        data.createMirrorTypedData as CreateMirrorBroadcastItemResult
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
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
        const sig = { v, r, s, deadline: typedData.value.deadline }
        const args = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig
        }
        setUserSigNonce(userSigNonce + 1)
        if (!RELAYER_ENABLED) {
          return mirrorWithSig?.({ recklesslySetUnpreparedArgs: [args] })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.reason)
          mirrorWithSig?.({ recklesslySetUnpreparedArgs: [args] })
      } catch (error) {
        setLoading(false)
        logger.error('[Error Mirror Video Typed Data]', error)
      }
    },
    onError
  })

  const signTypedData = (request: CreateMirrorRequest) => {
    createMirrorTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request
      }
    })
  }

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const { data } = await createMirrorViaDispatcher({
      variables: { request }
    })
    if (!data?.createMirrorViaDispatcher?.txId) {
      signTypedData(request)
    }
  }

  const mirrorVideo = async () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    const request = {
      profileId: selectedChannel?.id,
      publicationId: video?.id,
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }
    const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
    if (!canUseDispatcher) {
      return signTypedData(request)
    }
    await createViaDispatcher(request)
  }

  if (!video?.canMirror.result) return null

  return (
    <Tooltip
      placement="top-start"
      content={loading ? 'Mirroring' : 'Mirror video across Lens'}
    >
      <div className="flex">
        <button
          type="button"
          className="disabled:opacity-50"
          disabled={loading}
          onClick={() => mirrorVideo()}
        >
          {children}
        </button>
      </div>
    </Tooltip>
  )
}

export default MirrorVideo
