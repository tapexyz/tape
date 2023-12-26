import type { ProfileOptions } from '@lens-protocol/metadata'
import type {
  OnchainSetProfileMetadataRequest,
  PrimaryPublication,
  Profile
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC, ReactNode } from 'react'

import ReportPublication from '@components/Report/Publication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import { Dialog, DropdownMenu, Flex, IconButton, Text } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getIsIPFSUrl,
  getMetadataCid,
  getProfileCoverPicture,
  getProfilePictureUri,
  getSignature,
  getValueFromKeyInAttributes,
  logger,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
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
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import BookmarkOutline from '../Icons/BookmarkOutline'
import ExternalOutline from '../Icons/ExternalOutline'
import FlagOutline from '../Icons/FlagOutline'
import ForbiddenOutline from '../Icons/ForbiddenOutline'
import PinOutline from '../Icons/PinOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TimesOutline from '../Icons/TimesOutline'
import TrashOutline from '../Icons/TrashOutline'
import ArweaveExplorerLink from '../Links/ArweaveExplorerLink'
import IPFSLink from '../Links/IPFSLink'
import Share from '../VideoCard/Share'

type Props = {
  children?: ReactNode
  publication: PrimaryPublication
  variant?: 'classic' | 'ghost' | 'outline' | 'soft' | 'solid' | 'surface'
}

const PublicationOptions: FC<Props> = ({
  children,
  publication,
  variant = 'ghost'
}) => {
  const handleWrongNetwork = useHandleWrongNetwork()
  const [showConfirm, setShowConfirm] = useState(false)

  const { cache } = useApolloClient()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)

  const isVideoOwner = activeProfile?.id === publication?.by?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    activeProfile?.metadata?.attributes,
    'pinnedPublicationId'
  )

  const [hideVideo] = useHidePublicationMutation({
    onCompleted: () => {
      toast.success(`Video deleted`)
      Tower.track(EVENTS.PUBLICATION.DELETE, {
        publication_type: publication.__typename?.toLowerCase()
      })
    },
    update(cache) {
      const normalizedId = cache.identify({
        __typename: 'Post',
        id: publication?.id
      })
      cache.evict({ id: normalizedId })
      cache.gc()
    }
  })

  const onHideVideo = async () => {
    await hideVideo({ variables: { request: { for: publication?.id } } })
    setShowConfirm(false)
  }

  const onClickReport = () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    toast.success(`Transaction submitted`)
    Tower.track(EVENTS.PUBLICATION.PIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const [createOnchainSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { id, typedData } = createOnchainSetProfileMetadataTypedData
        const { metadataURI, profileId } = typedData.value
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData))
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return write({ args: [profileId, metadataURI] })
            }
            return
          }
          return write({ args: [profileId, metadataURI] })
        } catch {}
      },
      onError
    })

  const [setProfileMetadata] = useSetProfileMetadataMutation({
    onCompleted: ({ setProfileMetadata }) =>
      onCompleted(setProfileMetadata.__typename),
    onError
  })

  const otherAttributes =
    activeProfile?.metadata?.attributes
      ?.filter((attr) => !['app', 'pinnedPublicationId'].includes(attr.key))
      .map(({ key, type, value }) => ({
        key,
        type: MetadataAttributeType[type] as any,
        value
      })) ?? []

  const onPinVideo = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }

    try {
      toast.loading(`Pinning video...`)
      const pfp = getProfilePictureUri(activeProfile as Profile)
      const metadata: ProfileOptions = {
        ...(activeProfile?.metadata?.displayName && {
          name: activeProfile?.metadata.displayName
        }),
        ...(activeProfile?.metadata?.bio && {
          bio: activeProfile?.metadata.bio
        }),
        ...(pfp && {
          picture: pfp
        }),
        appId: TAPE_APP_ID,
        attributes: [
          ...otherAttributes,
          {
            key: 'pinnedPublicationId',
            type: MetadataAttributeType.STRING,
            value: publication.id
          },
          {
            key: 'app',
            type: MetadataAttributeType.STRING,
            value: TAPE_APP_ID
          }
        ],
        coverPicture: getProfileCoverPicture(activeProfile),
        id: uuidv4()
      }
      metadata.attributes = metadata.attributes?.filter(
        (m) => Boolean(trimify(m.key)) && Boolean(trimify(m.value))
      )
      const metadataUri = await uploadToAr(profile(metadata))
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: metadataUri
      }

      if (canUseLensManager) {
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
    } catch (error) {
      logger.error('[On Pin Video]', error)
    }
  }

  const modifyInterestCache = (notInterested: boolean) => {
    cache.modify({
      fields: { notInterested: () => notInterested },
      id: `Post:${publication?.id}`
    })
    toast.success(
      notInterested
        ? `Publication marked as not interested`
        : `Publication removed from not interested`
    )
    Tower.track(EVENTS.PUBLICATION.TOGGLE_INTEREST)
  }

  const modifyListCache = (saved: boolean) => {
    cache.modify({
      fields: {
        operations: () => {
          return {
            ...publication.operations,
            hasBookmarked: saved
          }
        }
      },
      id: `Post:${publication?.id}`
    })
    toast.success(
      saved ? `Video added to your list` : `Video removed from your list`
    )
    Tower.track(EVENTS.PUBLICATION.TOGGLE_INTEREST)
  }

  const [addNotInterested] = useAddPublicationNotInterestedMutation({
    onCompleted: () => modifyInterestCache(true),
    onError
  })

  const [removeNotInterested] = useUndoPublicationNotInterestedMutation({
    onCompleted: () => modifyInterestCache(false),
    onError
  })

  const [saveVideoToList] = useAddPublicationBookmarkMutation({
    onCompleted: () => modifyListCache(true),
    onError
  })

  const [removeVideoFromList] = useRemovePublicationBookmarkMutation({
    onCompleted: () => modifyListCache(false),
    onError
  })

  const notInterested = () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (publication.operations.isNotInterested) {
      addNotInterested({
        variables: {
          request: {
            on: publication.id
          }
        }
      })
    } else {
      removeNotInterested({
        variables: {
          request: {
            on: publication.id
          }
        }
      })
    }
  }

  const saveToList = () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (publication.operations.hasBookmarked) {
      removeVideoFromList({
        variables: {
          request: {
            on: publication.id
          }
        }
      })
    } else {
      saveVideoToList({
        variables: {
          request: {
            on: publication.id
          }
        }
      })
    }
  }

  return (
    <>
      <Confirm
        action={onHideVideo}
        setShowConfirm={setShowConfirm}
        showConfirm={showConfirm}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {children ?? (
            <IconButton highContrast radius="full" size="2" variant={variant}>
              <ThreeDotsOutline className="size-3.5" />
              <span className="sr-only">Video Options</span>
            </IconButton>
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={10} variant="soft">
          <div className="flex w-40 flex-col transition duration-150 ease-in-out">
            <Dialog.Root>
              <Dialog.Trigger>
                <button className="!cursor-default rounded-md px-3 py-1.5 hover:bg-gray-500/20">
                  <Flex align="center" gap="2">
                    <ShareOutline className="size-3.5" />
                    <Text className="whitespace-nowrap" size="2">
                      Share
                    </Text>
                  </Flex>
                </button>
              </Dialog.Trigger>

              <Dialog.Content style={{ maxWidth: 450 }}>
                <Flex align="center" justify="between" pb="5">
                  <Dialog.Title mb="0">Share</Dialog.Title>
                  <Dialog.Close>
                    <IconButton color="gray" variant="ghost">
                      <TimesOutline className="size-3" outlined={false} />
                    </IconButton>
                  </Dialog.Close>
                </Flex>

                <Share publication={publication} />
              </Dialog.Content>
            </Dialog.Root>
            {isVideoOwner && (
              <>
                {pinnedVideoId !== publication.id && (
                  <DropdownMenu.Item
                    disabled={!activeProfile?.id}
                    onClick={() => onPinVideo()}
                  >
                    <Flex align="center" gap="2">
                      <PinOutline className="size-3.5" />
                      <span className="whitespace-nowrap">Pin Video</span>
                    </Flex>
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  color="red"
                  onClick={() => setShowConfirm(true)}
                >
                  <Flex align="center" gap="2">
                    <TrashOutline className="size-3.5" />
                    <span className="whitespace-nowrap">Delete</span>
                  </Flex>
                </DropdownMenu.Item>
              </>
            )}

            {!isVideoOwner && (
              <>
                <DropdownMenu.Item
                  disabled={!activeProfile?.id}
                  onClick={() => saveToList()}
                >
                  <Flex align="center" gap="2">
                    <BookmarkOutline className="size-3.5 flex-none" />
                    <span className="truncate whitespace-nowrap">
                      {publication.operations.hasBookmarked ? 'Unsave' : 'Save'}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  disabled={!activeProfile?.id}
                  onClick={() => notInterested()}
                >
                  <Flex align="center" gap="2">
                    <ForbiddenOutline className="size-3.5" />
                    <span className="whitespace-nowrap">
                      {publication.operations.isNotInterested
                        ? 'Interested'
                        : 'Not Interested'}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
                <Dialog.Root>
                  <Dialog.Trigger disabled={!activeProfile?.id}>
                    <button
                      className="!cursor-default disabled:opacity-40 disabled:hover:bg-inherit rounded-md px-3 py-1.5 hover:bg-gray-500/20"
                      onClick={() => onClickReport()}
                    >
                      <Flex align="center" gap="2">
                        <FlagOutline className="size-3.5" />
                        <Text className="whitespace-nowrap" size="2">
                          Report
                        </Text>
                      </Flex>
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Report</Dialog.Title>
                    <ReportPublication publication={publication} />
                  </Dialog.Content>
                </Dialog.Root>

                {getIsIPFSUrl(publication.metadata.rawURI) ? (
                  <IPFSLink hash={getMetadataCid(publication)}>
                    <DropdownMenu.Item
                      onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
                    >
                      <Flex align="center" gap="2">
                        <ExternalOutline className="size-3.5" />
                        <span className="whitespace-nowrap">View metadata</span>
                      </Flex>
                    </DropdownMenu.Item>
                  </IPFSLink>
                ) : (
                  <ArweaveExplorerLink txId={getMetadataCid(publication)}>
                    <DropdownMenu.Item
                      onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
                    >
                      <Flex align="center" gap="2">
                        <ExternalOutline className="size-3.5" />
                        <span className="whitespace-nowrap">View metadata</span>
                      </Flex>
                    </DropdownMenu.Item>
                  </ArweaveExplorerLink>
                )}
                {publication.momoka?.proof && (
                  <ArweaveExplorerLink
                    txId={publication.momoka?.proof?.replace('ar://', '')}
                  >
                    <DropdownMenu.Item
                      onClick={() => Tower.track(EVENTS.CLICK_VIEW_PROOF)}
                    >
                      <Flex align="center" gap="2">
                        <ExternalOutline className="size-3.5" />
                        <span className="whitespace-nowrap">View proof</span>
                      </Flex>
                    </DropdownMenu.Item>
                  </ArweaveExplorerLink>
                )}
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

export default PublicationOptions
