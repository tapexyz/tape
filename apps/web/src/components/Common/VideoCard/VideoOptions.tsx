import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import Confirm from '@components/UIElements/Confirm'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import clsx from 'clsx'
import { utils } from 'ethers'
import type {
  CreatePublicSetProfileMetadataUriRequest,
  Publication
} from 'lens'
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  useHidePublicationMutation
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED_MESSAGE,
  TRACK
} from 'utils'
import getChannelCoverPicture from 'utils/functions/getChannelCoverPicture'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import omitKey from 'utils/functions/omitKey'
import uploadToAr from 'utils/functions/uploadToAr'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import ExternalOutline from '../Icons/ExternalOutline'
import FlagOutline from '../Icons/FlagOutline'
import PinOutline from '../Icons/PinOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TrashOutline from '../Icons/TrashOutline'

type Props = {
  video: Publication
  setShowShare: React.Dispatch<boolean>
  setShowReport: React.Dispatch<boolean>
  showOnHover?: boolean
}

const VideoOptions: FC<Props> = ({
  video,
  setShowShare,
  setShowReport,
  showOnHover = true
}) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const isVideoOwner = selectedChannel?.id === video?.profile?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    selectedChannel?.attributes,
    'pinnedPublicationId'
  )

  const [hideVideo] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({ id: video?.id, __typename: 'Post' })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success('Video deleted')
      Analytics.track(TRACK.PUBLICATION.DELETE, {
        publication_type: video.__typename?.toLowerCase()
      })
    }
  })

  const onHideVideo = () => {
    hideVideo({ variables: { request: { publicationId: video?.id } } })
  }

  const onClickReport = () => {
    if (!selectedChannelId) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    }
    setShowReport(true)
  }

  const otherAttributes =
    selectedChannel?.attributes
      ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
      .map(({ traitType, key, value, displayType }) => ({
        traitType,
        key,
        value,
        displayType
      })) ?? []

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const onCompleted = () => {
    toast.success('Transaction submitted')
    Analytics.track(TRACK.PUBLICATION.PIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeMetaData } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            user: selectedChannel?.ownedBy,
            profileId,
            metadata,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            writeMetaData?.({ recklesslySetUnpreparedArgs: [args] })
          }
        } catch {}
      },
      onError
    })

  const createTypedData = (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    createSetProfileMetadataTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError'
    ) {
      createTypedData(request)
    }
  }

  const onPinVideo = async () => {
    if (!selectedChannel) {
      return
    }
    try {
      toast.loading('Pinning video...')
      const { url } = await uploadToAr({
        version: '1.0.0',
        metadata_id: uuidv4(),
        name: selectedChannel?.name ?? '',
        bio: selectedChannel?.bio ?? '',
        cover_picture: getChannelCoverPicture(selectedChannel),
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'pinnedPublicationId',
            key: 'pinnedPublicationId',
            value: video.id
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      })
      const request = {
        profileId: selectedChannel?.id,
        metadata: url
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return createTypedData(request)
      }
      createViaDispatcher(request)
    } catch {}
  }

  return (
    <>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideVideo}
      />
      <DropMenu
        trigger={
          <div
            className={clsx(
              'py-1 text-white group-hover:visible md:text-inherit',
              showOnHover && 'lg:invisible'
            )}
            role="button"
          >
            <ThreeDotsOutline className="h-3.5 w-3.5" />
          </div>
        }
      >
        <div className="bg-secondary mt-0.5 w-36 overflow-hidden rounded-xl border border-gray-200 p-1 shadow dark:border-gray-800">
          <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
            {isVideoOwner && (
              <>
                {pinnedVideoId !== video.id && (
                  <Menu.Item
                    as="button"
                    className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onPinVideo()}
                  >
                    <PinOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">Pin Video</span>
                  </Menu.Item>
                )}
                <Menu.Item
                  as={NextLink}
                  href={getPublicationMediaUrl(video)}
                  target="_blank"
                >
                  <div className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ExternalOutline className="h-3 w-3" />
                    <span className="whitespace-nowrap">Raw Video</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  as="button"
                  className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={() => setShowConfirm(true)}
                >
                  <TrashOutline className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">Delete</span>
                </Menu.Item>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShareOutline className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Share</span>
            </button>
            <button
              type="button"
              onClick={() => onClickReport()}
              className="hhover:opacity-100 inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FlagOutline className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Report</span>
            </button>
          </div>
        </div>
      </DropMenu>
    </>
  )
}

export default VideoOptions
