import ReportPublication from '@components/Report/Publication'
import Confirm from '@components/UIElements/Confirm'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { ProfileOptions } from '@lens-protocol/metadata'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
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
import type {
  OnchainSetProfileMetadataRequest,
  PrimaryPublication,
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
import {
  BookmarkOutline,
  DropdownMenu,
  DropdownMenuItem,
  ExternalOutline,
  FlagOutline,
  ForbiddenOutline,
  Modal,
  PinOutline,
  ShareOutline,
  ThreeDotsOutline,
  TrashOutline
} from '@tape.xyz/ui'
import type { FC, ReactNode } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData, useWriteContract } from 'wagmi'

import ArweaveExplorerLink from '../Links/ArweaveExplorerLink'
import IPFSLink from '../Links/IPFSLink'
import Share from '../VideoCard/Share'

type Props = {
  publication: PrimaryPublication
  children?: ReactNode
}

const PublicationOptions: FC<Props> = ({ publication, children }) => {
  const handleWrongNetwork = useHandleWrongNetwork()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const { cache } = useApolloClient()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const isVideoOwner = activeProfile?.id === publication?.by?.id
  const pinnedVideoId = getValueFromKeyInAttributes(
    activeProfile?.metadata?.attributes,
    'pinnedPublicationId'
  )

  const [hideVideo, { loading: hiding }] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({
        id: publication?.id,
        __typename: 'Post'
      })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success(`Video deleted`)
      Tower.track(EVENTS.PUBLICATION.DELETE, {
        publication_type: publication.__typename?.toLowerCase()
      })
    }
  })

  const onHideVideo = async () => {
    await hideVideo({ variables: { request: { for: publication?.id } } })
    setShowConfirm(false)
  }

  const onClickReport = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setShowReportModal(true)
  }

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
    toast.success(`Transaction submitted`)
    Tower.track(EVENTS.PUBLICATION.PIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: () => onCompleted()
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'setProfileMetadataURI',
      args
    })
  }

  const [broadcast] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createOnchainSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { typedData, id } = createOnchainSetProfileMetadataTypedData
        const { profileId, metadataURI } = typedData.value
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)

          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData))
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return await write({ args: [profileId, metadataURI] })
            }
            return
          }
          return await write({ args: [profileId, metadataURI] })
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
      ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
      .map(({ key, value, type }) => ({
        key,
        value,
        type: MetadataAttributeType[type] as any
      })) ?? []

  const onPinVideo = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    try {
      toast.loading(`Pinning video...`)
      const pfp = getProfilePictureUri(activeProfile as Profile)
      const coverPicture = getProfileCoverPicture(activeProfile as Profile)
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
        ...(coverPicture && {
          coverPicture
        }),
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes: [
          ...otherAttributes,
          {
            type: MetadataAttributeType.STRING,
            key: 'pinnedPublicationId',
            value: publication.id
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'app',
            value: TAPE_APP_ID
          }
        ]
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
      id: `Post:${publication?.id}`,
      fields: { notInterested: () => notInterested }
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
      id: `Post:${publication?.id}`,
      fields: {
        operations: () => {
          return {
            ...publication.operations,
            hasBookmarked: saved
          }
        }
      }
    })
    toast.success(
      saved ? `Video added to your list` : `Video removed from your list`
    )
    Tower.track(EVENTS.PUBLICATION.TOGGLE_INTEREST)
  }

  const [addToNotInterested] = useAddPublicationNotInterestedMutation({
    onError,
    onCompleted: () => modifyInterestCache(true)
  })

  const [removeFromNotInterested] = useUndoPublicationNotInterestedMutation({
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

  const notInterested = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (publication.operations.isNotInterested) {
      await removeFromNotInterested({
        variables: {
          request: {
            on: publication.id
          }
        }
      })
    } else {
      await addToNotInterested({
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
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        action={onHideVideo}
        loading={hiding}
      />
      <DropdownMenu
        trigger={
          children ?? (
            <button>
              <ThreeDotsOutline className="size-3.5" />
              <span className="sr-only">Video Options</span>
            </button>
          )
        }
      >
        <div className="flex w-40 flex-col transition duration-150 ease-in-out">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault()
              setShowShareModal(true)
            }}
          >
            <div className="flex items-center gap-2">
              <ShareOutline className="size-3.5" />
              <p className="whitespace-nowrap">Share</p>
            </div>
          </DropdownMenuItem>
          <Modal
            size="sm"
            title="Share"
            show={showShareModal}
            setShow={setShowShareModal}
          >
            <Share publication={publication} />
          </Modal>
          {isVideoOwner && (
            <>
              {pinnedVideoId !== publication.id && (
                <DropdownMenuItem
                  disabled={!activeProfile?.id}
                  onClick={() => onPinVideo()}
                >
                  <p className="flex items-center gap-2">
                    <PinOutline className="size-3.5" />
                    <span className="whitespace-nowrap">Pin Video</span>
                  </p>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowConfirm(true)}>
                <p className="flex items-center gap-2 hover:text-red-500">
                  <TrashOutline className="size-3.5" />
                  <span className="whitespace-nowrap">Delete</span>
                </p>
              </DropdownMenuItem>
            </>
          )}

          {!isVideoOwner && (
            <>
              <DropdownMenuItem
                disabled={!activeProfile?.id}
                onClick={() => saveToList()}
              >
                <p className="flex items-center gap-2">
                  <BookmarkOutline className="size-3.5 flex-none" />
                  <span className="truncate whitespace-nowrap">
                    {publication.operations.hasBookmarked ? 'Unsave' : 'Save'}
                  </span>
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!activeProfile?.id}
                onClick={() => notInterested()}
              >
                <p className="flex items-center gap-2">
                  <ForbiddenOutline className="size-3.5" />
                  <span className="whitespace-nowrap">
                    {publication.operations.isNotInterested
                      ? 'Interested'
                      : 'Not Interested'}
                  </span>
                </p>
              </DropdownMenuItem>
              <Modal
                title="Report"
                show={showReportModal}
                setShow={setShowReportModal}
              >
                <ReportPublication
                  publication={publication}
                  close={() => setShowReportModal(false)}
                />
              </Modal>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  onClickReport()
                }}
              >
                <div className="flex items-center gap-2">
                  <FlagOutline className="size-3.5" />
                  <p className="whitespace-nowrap">Report</p>
                </div>
              </DropdownMenuItem>

              {getIsIPFSUrl(publication.metadata.rawURI) ? (
                <IPFSLink hash={getMetadataCid(publication)}>
                  <DropdownMenuItem
                    onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
                  >
                    <p className="flex items-center gap-2">
                      <ExternalOutline className="size-3.5" />
                      <span className="whitespace-nowrap">View metadata</span>
                    </p>
                  </DropdownMenuItem>
                </IPFSLink>
              ) : (
                <ArweaveExplorerLink txId={getMetadataCid(publication)}>
                  <DropdownMenuItem
                    onClick={() => Tower.track(EVENTS.CLICK_VIEW_METADATA)}
                  >
                    <p className="flex items-center gap-2">
                      <ExternalOutline className="size-3.5" />
                      <span className="whitespace-nowrap">View metadata</span>
                    </p>
                  </DropdownMenuItem>
                </ArweaveExplorerLink>
              )}
              {publication.momoka?.proof && (
                <ArweaveExplorerLink
                  txId={publication.momoka?.proof?.replace('ar://', '')}
                >
                  <DropdownMenuItem
                    onClick={() => Tower.track(EVENTS.CLICK_VIEW_PROOF)}
                  >
                    <p className="flex items-center gap-2">
                      <ExternalOutline className="size-3.5" />
                      <span className="whitespace-nowrap">View proof</span>
                    </p>
                  </DropdownMenuItem>
                </ArweaveExplorerLink>
              )}
            </>
          )}
        </div>
      </DropdownMenu>
    </>
  )
}

export default PublicationOptions
