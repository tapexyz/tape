import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import {
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import {
  BROADCAST_MUTATION,
  CREATE_MIRROR_TYPED_DATA
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdPublishedWithChanges } from 'react-icons/md'
import { LenstubePublication } from 'src/types/local'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: LenstubePublication
  onMirrorSuccess: () => void
}

const MirrorVideo: FC<Props> = ({ video, onMirrorSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { selectedChannel, isAuthenticated } = useAppStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })
  const { write: mirrorWithSig, data: mirrorData } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'mirrorWithSig',
    {
      onError(error: any) {
        toast.error(error?.data?.message || error?.message)
        setLoading(false)
      }
    }
  )

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError(error) {
      toast.error(error.message)
      setLoading(false)
    }
  })

  const { indexed } = usePendingTxn(
    mirrorData?.hash || broadcastData?.broadcast?.txHash
  )

  useEffect(() => {
    if (indexed) {
      onMirrorSuccess()
      toast.success(`Mirrored video across lens.`)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createMirrorTypedData] = useMutation(CREATE_MIRROR_TYPED_DATA, {
    onCompleted(data) {
      const { id, typedData } = data.createMirrorTypedData
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData
      } = typedData?.value
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      }).then((signature) => {
        const { v, r, s } = utils.splitSignature(signature)
        const sig = { v, r, s, deadline: typedData.value.deadline }
        const inputStruct = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig
        }
        if (RELAYER_ENABLED) {
          broadcast({ variables: { request: { id, signature } } })
        } else {
          mirrorWithSig({ args: inputStruct })
        }
      })
    },
    onError(error) {
      toast.error(error.message)
      setLoading(false)
    }
  })

  const mirrorVideo = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    createMirrorTypedData({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          publicationId: video?.id,
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  return (
    <Tooltip placement="top-start" content="Mirror across Lens">
      <button
        disabled={loading}
        onClick={() => mirrorVideo()}
        className="p-3.5 bg-gray-200 dark:bg-gray-800 rounded-full"
      >
        {loading ? <Loader size="sm" /> : <MdPublishedWithChanges />}
      </button>
    </Tooltip>
  )
}

export default MirrorVideo
