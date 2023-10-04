import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
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
  CreateSetProfileImageUriBroadcastItemResult,
  Profile,
  ProfileMedia,
  UpdateProfileImageRequest
} from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation
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
  const handleWrongNetwork = useHandleWrongNetwork()

  // Dispatcher
  const canUseRelay = activeChannel?.dispatcher?.canUseRelay
  const isSponsored = activeChannel?.dispatcher?.sponsor

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setSelectedPfp(getProfilePicture(channel, 'AVATAR_LG'))
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    if (activeChannel && selectedPfp) {
      const picture: ProfileMedia = {
        original: { url: selectedPfp },
        onChain: { url: selectedPfp },
        __typename: 'MediaSet'
      }
      setActiveChannel({
        ...activeChannel,
        picture
      })
      setSelectedSimpleProfile({
        ...(selectedSimpleProfile as SimpleProfile),
        picture
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

  const [createSetProfileImageViaDispatcher] =
    useCreateSetProfileImageUriViaDispatcherMutation({
      onError,
      onCompleted: ({ createSetProfileImageURIViaDispatcher }) =>
        onCompleted(createSetProfileImageURIViaDispatcher.__typename)
    })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  })

  const [createSetProfileImageURITypedData] =
    useCreateSetProfileImageUriTypedDataMutation({
      onCompleted: async ({ createSetProfileImageURITypedData }) => {
        const { typedData, id } =
          createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          setUserSigNonce(userSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            const { profileId, imageURI } = typedData.value
            return write?.({ args: [profileId, imageURI] })
          }
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const createTypedData = async (request: UpdateProfileImageRequest) => {
    await createSetProfileImageURITypedData({
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
      createTypedData(request)
    }
  }

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        if (handleWrongNetwork()) {
          return
        }
        setLoading(true)
        const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
        const request = {
          profileId: activeChannel?.id,
          url: result.url
        }
        setSelectedPfp(result.url)
        if (canUseRelay && isSponsored) {
          return await createViaDispatcher(request)
        }
        return await createTypedData(request)
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
          'invisible absolute top-0 grid h-32 w-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
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
