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
import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import type { CustomErrorWithData, IPFSUploadResult } from 'utils'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import omitKey from 'utils/functions/omitKey'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import { useContractWrite, useSignMessage, useSignTypedData } from 'wagmi'

import ChoosePicture from './ChoosePicture'
import CropImageModal from './CropImageModal'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const [showProfileModal, setProfileModal] = useState(false)
  const [showCropImageModal, setCropImageModal] = useState(false)
  const [imagePreviewSrc, setImagePreviewSrc] = useState('')

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setSelectedPfp(getProfilePicture(channel, 'avatar_lg'))
  }

  const onCompleted = () => {
    setLoading(false)
    if (selectedChannel && selectedPfp)
      setSelectedChannel({
        ...selectedChannel,
        picture: { original: { url: selectedPfp } }
      })
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
      onCompleted: async (data) => {
        const { typedData, id } =
          data.createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
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
          if (!RELAYER_ENABLED) {
            return writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError')
            writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
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

  const [loadChallenge] = useNftChallengeLazyQuery()

  const { signMessageAsync } = useSignMessage()

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

  const onChooseImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setProfileModal(false)
      setImagePreviewSrc(URL.createObjectURL(e.target.files[0]))
      setCropImageModal(true)
    }
  }

  const onPfpUpload = async (file: File) => {
    try {
      setLoading(true)
      setCropImageModal(false)
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
    <div className="relative flex-none overflow-hidden rounded-full group">
      <img
        src={
          selectedPfp
            ? sanitizeIpfsUrl(selectedPfp)
            : getProfilePicture(channel, 'avatar_lg')
        }
        className="object-cover w-32 h-32 border-2 rounded-full"
        draggable={false}
        alt={selectedPfp ? selectedChannel?.handle : channel.handle}
      />
      <label
        className={clsx(
          'absolute top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg invisible group-hover:visible dark:bg-theme',
          { '!visible': loading && !pfpData?.hash }
        )}
        onClick={() => setProfileModal(true)}
      >
        {loading && !pfpData?.hash ? (
          <Loader />
        ) : (
          <RiImageAddLine className="text-xl" />
        )}
      </label>

      <ChoosePicture
        isModalOpen={showProfileModal}
        onClose={() => setProfileModal(false)}
        onChooseImage={onChooseImage}
        channel={channel}
        setNFTAvatar={setNFTAvatar}
      />

      <CropImageModal
        isModalOpen={showCropImageModal}
        onClose={() => setCropImageModal(false)}
        imageSrc={imagePreviewSrc}
        onPfpUpload={onPfpUpload}
      />
    </div>
  )
}

export default ChannelPicture
