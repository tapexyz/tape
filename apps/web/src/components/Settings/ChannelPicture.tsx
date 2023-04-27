import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import { Loader } from '@components/UIElements/Loader'
import useChannelStore from '@lib/store/channel'
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
  useCreateSetProfileImageUriViaDispatcherMutation
} from 'lens'
import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, IPFSUploadResult } from 'utils'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import omitKey from 'utils/functions/omitKey'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const ChannelPicture: FC<Props> = ({ channel }) => {
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

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
        picture: { original: { url: selectedPfp }, __typename: 'MediaSet' }
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
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
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

  const createTypedData = (request: UpdateProfileImageRequest) => {
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
      createTypedData(request)
    }
  }

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true)
        const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
        const request = {
          profileId: selectedChannel?.id,
          url: result.url
        }
        setSelectedPfp(result.url)
        const canUseDispatcher =
          selectedChannel?.dispatcher?.canUseRelay &&
          selectedChannel.dispatcher.sponsor
        if (!canUseDispatcher) {
          return createTypedData(request)
        }
        await createViaDispatcher(request)
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
            : getProfilePicture(channel, 'avatar_lg')
        }
        className="h-32 w-32 rounded-full border-2 object-cover"
        draggable={false}
        alt={selectedPfp ? selectedChannel?.handle : channel.handle}
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
