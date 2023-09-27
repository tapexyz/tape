import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import ReportPublication from '@components/ReportPublication'
import Confirm from '@components/UIElements/Confirm'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getProfilePicture,
  getSignature,
  getValueFromKeyInAttributes,
  uploadToAr
} from '@lenstube/generic'
import type { Attribute, MirrorablePublication, Profile } from '@lenstube/lens'
import {
  useAddPublicationBookmarkMutation,
  useAddPublicationNotInterestedMutation,
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useHidePublicationMutation,
  useRemovePublicationBookmarkMutation,
  useUndoPublicationNotInterestedMutation
} from '@lenstube/lens'
import { useApolloClient } from '@lenstube/lens/apollo'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Box, Dialog, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import FlagOutline from '../Icons/FlagOutline'
import ForbiddenOutline from '../Icons/ForbiddenOutline'
import PinOutline from '../Icons/PinOutline'
import SaveToListOutline from '../Icons/SaveToListOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TrashOutline from '../Icons/TrashOutline'

type Props = {
  video: MirrorablePublication
  setShowShare: React.Dispatch<boolean>
  setShowReport: React.Dispatch<boolean>
}

const VideoOptions: FC<Props> = ({ video, setShowShare, setShowReport }) => {
  const { openConnectModal } = useConnectModal()
  const [showConfirm, setShowConfirm] = useState(false)

  const { cache } = useApolloClient()

  const activeChannel = useChannelStore((state) => state.activeChannel)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const isVideoOwner = activeChannel?.id === video?.by?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    activeChannel?.metadata?.attributes,
    'pinnedPublicationId'
  )

  const [hideVideo] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({ id: video?.id, __typename: 'Post' })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success(t`Video deleted`)
      Analytics.track(TRACK.PUBLICATION.DELETE, {
        publication_type: video.__typename?.toLowerCase()
      })
    }
  })

  const onHideVideo = () => {
    hideVideo({ variables: { request: { for: video?.id } } })
  }

  const onClickReport = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
  }

  const otherAttributes =
    (activeChannel?.metadata?.attributes as Attribute[])
      ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
      .map(({ type, key, value }) => ({
        type,
        key,
        value
      })) ?? []

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    toast.success(t`Transaction submitted`)
    Analytics.track(TRACK.PUBLICATION.PIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { typedData, id } = createOnchainSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            const { profileId, metadataURI } = typedData.value
            return write?.({ args: [profileId, metadataURI] })
          }
        } catch {}
      },
      onError
    })

  const onPinVideo = async () => {
    if (!activeChannel) {
      return openConnectModal?.()
    }
    try {
      toast.loading(t`Pinning video...`)
      const metadata = profile({
        appId: LENSTUBE_APP_ID,
        bio: activeChannel?.metadata?.bio,
        coverPicture: getChannelCoverPicture(activeChannel),
        id: uuidv4(),
        name: activeChannel?.metadata?.displayName ?? '',
        picture: getProfilePicture(activeChannel as Profile),
        attributes: [
          ...(otherAttributes as unknown as MetadataAttribute[]),
          {
            type: MetadataAttributeType.STRING,
            key: 'pinnedPublicationId',
            value: video.id
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      })
      const metadataUri = await uploadToAr(metadata)
      const canUseDispatcher =
        activeChannel?.lensManager && activeChannel.sponsor
      if (!canUseDispatcher) {
        return createSetProfileMetadataTypedData({
          variables: { request: { metadataURI: metadataUri } }
        })
      }
    } catch {}
  }

  const modifyInterestCache = (notInterested: boolean) => {
    cache.modify({
      id: `Post:${video?.id}`,
      fields: { notInterested: () => notInterested }
    })
    toast.success(
      notInterested
        ? t`Video marked as not interested`
        : t`Video removed from not interested`
    )
    Analytics.track(TRACK.PUBLICATION.TOGGLE_INTEREST)
  }

  const modifyListCache = (saved: boolean) => {
    cache.modify({
      id: `Post:${video?.id}`,
      fields: { bookmarked: () => saved }
    })
    toast.success(
      saved ? t`Video added to your list` : t`Video removed from your list`
    )
    Analytics.track(TRACK.PUBLICATION.TOGGLE_INTEREST)
  }

  const [addNotInterested] = useAddPublicationNotInterestedMutation({
    onError,
    onCompleted: () => modifyInterestCache(true)
  })

  const [removeNotInterested] = useUndoPublicationNotInterestedMutation({
    onError,
    onCompleted: () => modifyInterestCache(false)
  })

  const [saveVideoToList] = useAddPublicationBookmarkMutation({
    onError,
    onCompleted: () => modifyListCache(true)
  })

  const [removeVideoFromList] = useRemovePublicationBookmarkMutation({
    onError,
    onCompleted: () => modifyListCache(false)
  })

  const notInterested = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (video.operations.isNotInterested) {
      addNotInterested({
        variables: {
          request: {
            on: video.id
          }
        }
      })
    } else {
      removeNotInterested({
        variables: {
          request: {
            on: video.id
          }
        }
      })
    }
  }

  const saveToList = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (video.operations.hasBookmarked) {
      removeVideoFromList({
        variables: {
          request: {
            on: video.id
          }
        }
      })
    } else {
      saveVideoToList({
        variables: {
          request: {
            on: video.id
          }
        }
      })
    }
  }

  return (
    <>
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideVideo}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Box>
            <ThreeDotsOutline className="h-3.5 w-3.5" />
          </Box>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
          <div className="flex w-40 flex-col rounded-lg transition duration-150 ease-in-out">
            <DropdownMenu.Item onClick={() => setShowShare(true)}>
              <Flex align="center" gap="2">
                <ShareOutline className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">
                  <Trans>Share</Trans>
                </span>
              </Flex>
            </DropdownMenu.Item>
            {isVideoOwner && (
              <>
                {pinnedVideoId !== video.id && (
                  <DropdownMenu.Item onClick={() => onPinVideo()}>
                    <Flex align="center" gap="2">
                      <PinOutline className="h-3.5 w-3.5" />
                      <span className="whitespace-nowrap">
                        <Trans>Pin Video</Trans>
                      </span>
                    </Flex>
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  color="red"
                  onClick={() => setShowConfirm(true)}
                >
                  <Flex align="center" gap="2">
                    <TrashOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      <Trans>Delete</Trans>
                    </span>
                  </Flex>
                </DropdownMenu.Item>
              </>
            )}

            {!isVideoOwner && (
              <>
                <DropdownMenu.Item onClick={() => saveToList()}>
                  <Flex align="center" gap="2">
                    <SaveToListOutline className="h-3.5 w-3.5 flex-none" />
                    <span className="truncate whitespace-nowrap">
                      {video.operations.hasBookmarked ? (
                        <Trans>Unsave</Trans>
                      ) : (
                        <Trans>Save</Trans>
                      )}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => notInterested()}>
                  <Flex align="center" gap="2">
                    <ForbiddenOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      {video.operations.isNotInterested ? (
                        <Trans>Interested</Trans>
                      ) : (
                        <Trans>Not Interested</Trans>
                      )}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <button
                      className="cursor-default rounded px-3 py-1.5 hover:bg-red-500/50"
                      onClick={() => onClickReport()}
                    >
                      <Flex align="center" gap="2">
                        <FlagOutline className="h-3.5 w-3.5" />
                        <Text size="2" className="whitespace-nowrap">
                          <Trans>Report</Trans>
                        </Text>
                      </Flex>
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Report</Dialog.Title>

                    <ReportPublication
                      publication={video}
                      onSuccess={() => setShowReport(false)}
                    />
                  </Dialog.Content>
                </Dialog.Root>
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

export default VideoOptions
