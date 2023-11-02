import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import { getRelativeTime } from '@lib/formatTime'
import useProfileStore from '@lib/store/profile'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_BYTES_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  checkDispatcherPermissions,
  EVENTS,
  getIsSensitiveContent,
  getProfileCoverPicture,
  getProfilePicture,
  getPublication,
  getPublicationData,
  getPublicationMediaUrl,
  getSignature,
  getThumbnailUrl,
  imageCdn,
  isWatchable,
  logger,
  sanitizeDStorageUrl,
  Tower,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  AnyPublication,
  OnchainSetProfileMetadataRequest,
  Profile
} from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  usePublicationQuery,
  useSetProfileMetadataMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  id: string
}

const PinnedVideo: FC<Props> = ({ id }) => {
  const { activeProfile } = useProfileStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(activeProfile)

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    }
  })

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
    Tower.track(EVENTS.PUBLICATION.UNPIN)
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
        const { profileId, metadataURI } = typedData.value
        const args = [profileId, metadataURI]
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData))
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return write({ args })
            }
            return
          }
          return write({ args })
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

  const unpinVideo = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }

    try {
      toast.loading(`Unpinning video...`)
      const metadata = profile({
        appId: TAPE_APP_ID,
        ...(activeProfile?.metadata?.displayName && {
          name: activeProfile?.metadata?.displayName
        }),
        ...(activeProfile?.metadata?.bio && {
          bio: activeProfile?.metadata?.bio
        }),
        coverPicture: getProfileCoverPicture(activeProfile),
        id: uuidv4(),
        name: activeProfile?.metadata?.displayName ?? '',
        picture: getProfilePicture(activeProfile as Profile),
        attributes: [
          ...otherAttributes,
          {
            type: MetadataAttributeType.STRING,
            key: 'app',
            value: TAPE_APP_ID
          }
        ]
      })
      const metadataURI = await uploadToAr(metadata)
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI
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
      logger.error('[UnPin Video]', error)
    }
  }

  if (loading) {
    return <PinnedVideoShimmer />
  }

  const publication = data?.publication as AnyPublication
  const pinnedPublication = getPublication(publication)

  if (error || !publication || !isWatchable(pinnedPublication)) {
    return null
  }

  const isBytesVideo =
    pinnedPublication?.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const isVideoOwner = activeProfile?.id === pinnedPublication?.by.id

  const isSensitiveContent = getIsSensitiveContent(
    pinnedPublication?.metadata,
    pinnedPublication?.id
  )
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(pinnedPublication?.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  return (
    <div className="mb-4 mt-6">
      <h1 className="text-brand-400 pb-4 text-xl font-bold">Featured</h1>
      <div className="grid grid-cols-3 overflow-hidden md:space-x-5">
        <div className="overflow-hidden md:rounded-xl">
          <VideoPlayer
            address={activeProfile?.ownedBy.address}
            url={getPublicationMediaUrl(pinnedPublication.metadata)}
            posterUrl={thumbnailUrl}
            isSensitiveContent={isSensitiveContent}
            options={{
              autoPlay: true,
              loop: false,
              loadingSpinner: true,
              isCurrentlyShown: true
            }}
          />
        </div>
        <div className="group flex flex-col justify-between pl-2 lg:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link
                className="inline break-words text-lg font-medium"
                href={`/watch/${pinnedPublication.id}`}
                title={
                  getPublicationData(pinnedPublication.metadata)?.title ?? ''
                }
              >
                {getPublicationData(pinnedPublication.metadata)?.title}
              </Link>
              {isVideoOwner && (
                <Button
                  variant="soft"
                  size="2"
                  color="red"
                  highContrast
                  className="invisible hover:!bg-red-200 group-hover:visible dark:hover:!bg-red-800"
                  onClick={() => unpinVideo()}
                >
                  Unpin
                </Button>
              )}
            </div>
            <div className="flex items-center overflow-hidden opacity-70">
              <span className="whitespace-nowrap">
                {pinnedPublication.stats?.reactions} likes
              </span>
              <span className="middot" />
              {pinnedPublication.createdAt && (
                <span className="whitespace-nowrap">
                  {getRelativeTime(pinnedPublication.createdAt)}
                </span>
              )}
            </div>
            <p className="line-clamp-6 text-sm">
              {getPublicationData(pinnedPublication.metadata)?.content}
            </p>
          </div>
          <Link
            className="text-brand-500 text-xs font-bold"
            href={`/watch/${pinnedPublication.id}`}
          >
            View more
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PinnedVideo
