import ReportPublication from '@components/ReportPublication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import {
  type MetadataAttribute,
  MetadataAttributeType,
  profile
} from '@lens-protocol/metadata'
import useAuthPersistStore from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { Dialog, DropdownMenu, Flex, IconButton, Text } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  getProfileCoverPicture,
  getProfilePicture,
  getSignature,
  getValueFromKeyInAttributes,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  MirrorablePublication,
  OnchainSetProfileMetadataRequest,
  Profile
} from '@tape.xyz/lens'
import {
  useAddPublicationBookmarkMutation,
  useAddPublicationNotInterestedMutation,
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useHidePublicationMutation,
  useRemovePublicationBookmarkMutation,
  useSetProfileMetadataMutation,
  useUndoPublicationNotInterestedMutation
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC, ReactNode } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import BookmarkOutline from '../Icons/BookmarkOutline'
import FlagOutline from '../Icons/FlagOutline'
import ForbiddenOutline from '../Icons/ForbiddenOutline'
import PinOutline from '../Icons/PinOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TimesOutline from '../Icons/TimesOutline'
import TrashOutline from '../Icons/TrashOutline'
import Share from './Share'

type Props = {
  video: MirrorablePublication
  children?: ReactNode
  variant?: 'soft' | 'solid' | 'classic' | 'surface' | 'outline' | 'ghost'
}

const VideoOptions: FC<Props> = ({ video, variant = 'ghost', children }) => {
  const handleWrongNetwork = useHandleWrongNetwork()
  const [showConfirm, setShowConfirm] = useState(false)

  const { cache } = useApolloClient()

  const activeProfile = useProfileStore((state) => state.activeProfile)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const isVideoOwner = activeProfile?.id === video?.by?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    activeProfile?.metadata?.attributes,
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

  const onHideVideo = async () => {
    await hideVideo({ variables: { request: { for: video?.id } } })
    setShowConfirm(false)
  }

  const onClickReport = () => {
    if (!selectedSimpleProfile?.id) {
      return toast.error('Sign in to proceed')
    }
    if (handleWrongNetwork()) {
      return
    }
  }

  const otherAttributes = activeProfile?.metadata?.attributes
    ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
    .map(({ key, value }) => ({
      key,
      value
    })) as MetadataAttribute[]

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
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

  const [createOnchainSetProfileMetadataTypedData] =
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

  const [setProfileMetadata] = useSetProfileMetadataMutation({
    onCompleted: ({ setProfileMetadata }) =>
      onCompleted(setProfileMetadata.__typename),
    onError
  })

  const onPinVideo = async () => {
    if (!activeProfile) {
      return toast.error('Sign in to proceed')
    }
    if (handleWrongNetwork()) {
      return
    }

    try {
      toast.loading(t`Pinning video...`)
      const metadata = profile({
        appId: TAPE_APP_ID,
        bio: activeProfile?.metadata?.bio,
        coverPicture: getProfileCoverPicture(activeProfile),
        id: uuidv4(),
        name: activeProfile?.metadata?.displayName ?? '',
        picture: getProfilePicture(activeProfile as Profile),
        attributes: [
          ...otherAttributes,
          {
            type: MetadataAttributeType.STRING,
            key: 'pinnedPublicationId',
            value: video.id
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'app',
            value: TAPE_APP_ID
          }
        ]
      })
      const metadataUri = await uploadToAr(metadata)
      const canUseRelay = activeProfile?.lensManager && activeProfile.sponsor
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: metadataUri
      }

      if (canUseRelay) {
        const { data } = await setProfileMetadata({
          variables: { request }
        })
        if (
          data?.setProfileMetadata?.__typename ===
          'LensProfileManagerRelayError'
        ) {
          return await createOnchainSetProfileMetadataTypedData({
            variables: { request }
          })
        }
        return
      }

      return createOnchainSetProfileMetadataTypedData({
        variables: { request }
      })
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
    onCompleted: () => modifyListCache(false),
    update: (cache) => {
      cache.evict({})
    }
  })

  const notInterested = () => {
    if (!selectedSimpleProfile?.id) {
      return toast.error('Sign in to proceed')
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
      return toast.error('Sign in to proceed')
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
          {children ?? (
            <IconButton radius="full" variant={variant} highContrast size="2">
              <ThreeDotsOutline className="h-3.5 w-3.5" />
            </IconButton>
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
          <div className="flex w-40 flex-col transition duration-150 ease-in-out">
            <Dialog.Root>
              <Dialog.Trigger>
                <button className="!cursor-default rounded-md px-3 py-1.5 hover:bg-gray-500/20">
                  <Flex align="center" gap="2">
                    <ShareOutline className="h-3.5 w-3.5" />
                    <Text size="2" className="whitespace-nowrap">
                      <Trans>Share</Trans>
                    </Text>
                  </Flex>
                </button>
              </Dialog.Trigger>

              <Dialog.Content style={{ maxWidth: 450 }}>
                <Flex justify="between" pb="5" align="center">
                  <Dialog.Title mb="0">Share</Dialog.Title>
                  <Dialog.Close>
                    <IconButton variant="ghost" color="gray">
                      <TimesOutline outlined={false} className="h-4 w-4" />
                    </IconButton>
                  </Dialog.Close>
                </Flex>

                <Share video={video} />
              </Dialog.Content>
            </Dialog.Root>
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
                    <BookmarkOutline className="h-3.5 w-3.5 flex-none" />
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
                      className="!cursor-default rounded-md px-3 py-1.5 hover:bg-gray-500/20"
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

                    <ReportPublication publication={video} />
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
