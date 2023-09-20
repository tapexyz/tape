import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import { uploadToIPFS } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getProfilePicture,
  getSignature,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type {
  OnchainSetProfileMetadataRequest,
  Profile,
  ProfilePicture
} from '@lenstube/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation
} from '@lenstube/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult,
  SimpleProfile
} from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import clsx from 'clsx'
import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)
  const activeChannel = useChannelStore((state) => state.activeChannel)
  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  // Dispatcher
  const canUseRelay = activeChannel?.sponsor && activeChannel?.lensManager

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setSelectedPfp(getProfilePicture(channel, 'AVATAR_LG'))
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    if (activeChannel && selectedPfp) {
      const picture: ProfilePicture = {
        raw: { uri: selectedPfp }
      }
      setActiveChannel({
        ...activeChannel,
        metadata: {
          ...activeChannel.metadata,
          picture,
          attributes: activeChannel?.metadata?.attributes ?? [],
          rawURI: activeChannel?.metadata?.rawURI
        }
      })
      setSelectedSimpleProfile({
        ...(selectedSimpleProfile as SimpleProfile),
        metadata: {
          picture,
          attributes: selectedSimpleProfile?.metadata?.attributes ?? [],
          rawURI: selectedSimpleProfile?.metadata?.rawURI
        }
      })
    }
    toast.success(t`Channel image updated`)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { data: pfpData, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setProfileImageURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createSetProfileImageURITypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { typedData, id } = createOnchainSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          setUserSigNonce(userSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            const { profileId, metadataURI } = typedData.value
            return write?.({ args: [profileId, metadataURI] })
          }
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true)
        const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
        const request: OnchainSetProfileMetadataRequest = {
          metadataURI: result.url
        }
        setSelectedPfp(result.url)
        if (canUseRelay) {
          return await createSetProfileImageURITypedData({
            variables: { options: { overrideSigNonce: userSigNonce }, request }
          })
        }
      } catch (error) {
        onError(error as CustomErrorWithData)
      }
    }
  }

  return (
    <div className="group relative flex-none overflow-hidden rounded-full">
      <img
        src={
          selectedPfp
            ? sanitizeDStorageUrl(selectedPfp)
            : getProfilePicture(channel, 'AVATAR_LG')
        }
        className="h-32 w-32 rounded-full border-2 object-cover"
        draggable={false}
        alt={selectedPfp ? activeChannel?.handle : channel.handle}
      />
      <label
        htmlFor="choosePfp"
        className={clsx(
          'dark:bg-theme invisible absolute top-0 grid h-32 w-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible',
          { '!visible': loading && !pfpData?.hash }
        )}
      >
        {loading && !pfpData?.hash ? (
          <Loader />
        ) : (
          <AddImageOutline className="h-5 w-5" />
        )}
        <input
          id="choosePfp"
          type="file"
          accept=".png, .jpg, .jpeg, .svg, .gif"
          className="hidden w-full"
          onChange={onPfpUpload}
        />
      </label>
    </div>
  )
}

export default ChannelPicture
