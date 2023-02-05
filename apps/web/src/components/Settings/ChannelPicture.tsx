import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { utils } from 'ethers'
import type {
  CreateSetProfileImageUriBroadcastItemResult,
  Profile,
  UpdateProfileImageRequest
} from 'lens'
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation,
  useNftChallengeLazyQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import type { CustomErrorWithData, IPFSUploadResult } from 'utils'
import { Analytics, ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, TRACK } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import omitKey from 'utils/functions/omitKey'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import { useContractWrite, useSignMessage, useSignTypedData } from 'wagmi'

import ImagePicker from './ImagePicker'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const [loading, setLoading] = useState(false)
  const [selectedPfp, setSelectedPfp] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

  const [loadChallenge] = useNftChallengeLazyQuery()
  const { signMessageAsync } = useSignMessage()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setSelectedPfp(getProfilePicture(channel, 'avatar_lg'))
  }

  const onCompleted = () => {
    setLoading(false)
    if (selectedChannel && selectedPfp) {
      setSelectedChannel({
        ...selectedChannel,
        picture: { original: { url: selectedPfp } }
      })
    }
    toast.success('Channel image updated')
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { data: pfpData, write: writePfpUri } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [createSetProfileImageViaDispatcher] =
    useCreateSetProfileImageUriViaDispatcherMutation({
      onError,
      onCompleted
    })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createSetProfileImageURITypedData] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        const { typedData, id } =
          createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            profileId,
            imageURI,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          setUserSigNonce(userSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
          }
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const signTypedData = (request: UpdateProfileImageRequest) => {
    createSetProfileImageURITypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    })
  }

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileImageURIViaDispatcher.__typename === 'RelayError'
    ) {
      signTypedData(request)
    }
  }

  const onPfpUpload = async (file: File) => {
    try {
      setLoading(true)
      setShowProfileModal(false)
      const result: IPFSUploadResult = await uploadToIPFS(file)
      const request = {
        profileId: selectedChannel?.id,
        url: result.url
      }
      setSelectedPfp(result.url)
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return signTypedData(request)
      }
      await createViaDispatcher(request)
    } catch (error) {
      onError(error as CustomErrorWithData)
    }
  }

  const setNFTAvatar = async (
    contractAddress: string,
    tokenId: string,
    chainId: Number
  ) => {
    try {
      Analytics.track(TRACK.PFP.UPLOAD_FROM_COLLECTION)
      const challengeResponse = await loadChallenge({
        variables: {
          request: {
            ethereumAddress: selectedChannel?.ownedBy,
            nfts: [
              {
                contractAddress,
                tokenId,
                chainId
              }
            ]
          }
        }
      })
      const signature = await signMessageAsync({
        message: challengeResponse?.data?.nftOwnershipChallenge?.text as string
      })
      const request = {
        profileId: selectedChannel?.id,
        nftData: {
          id: challengeResponse?.data?.nftOwnershipChallenge?.id,
          signature
        }
      }
      if (selectedChannel?.dispatcher?.canUseRelay) {
        return await createViaDispatcher(request)
      }
      return await createSetProfileImageURITypedData({
        variables: { options: { overrideSigNonce: userSigNonce }, request }
      })
    } catch {}
  }

  return (
    <div className="group relative flex-none overflow-hidden rounded-full">
      <img
        src={
          selectedPfp
            ? sanitizeIpfsUrl(selectedPfp)
            : getProfilePicture(channel, 'avatar_lg')
        }
        className="h-32 w-32 rounded-full border-2 object-cover"
        draggable={false}
        alt={selectedPfp ? selectedChannel?.handle : channel.handle}
      />
      <label
        className={clsx(
          'dark:bg-theme invisible absolute top-0 grid h-32 w-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible',
          { '!visible': loading && !pfpData?.hash }
        )}
        onClick={() => {
          Analytics.track(TRACK.PFP.OPEN_MODAL)
          setShowProfileModal(true)
        }}
      >
        {loading && !pfpData?.hash ? (
          <Loader />
        ) : (
          <RiImageAddLine className="text-xl" />
        )}
      </label>
      <ImagePicker
        channel={channel}
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        setNFTAvatar={setNFTAvatar}
        onPfpUpload={onPfpUpload}
      />
    </div>
  )
}

export default ChannelPicture
