import type { ProfileOptions } from '@lens-protocol/metadata'
import type {
  AnyPublication,
  OnchainSetProfileMetadataRequest,
  Profile
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import { getRelativeTime } from '@lib/formatTime'
import useProfileStore from '@lib/store/idb/profile'
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
  checkLensManagerPermissions,
  EVENTS,
  getIsSensitiveContent,
  getProfileCoverPicture,
  getProfilePictureUri,
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
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  usePublicationQuery,
  useSetProfileMetadataMutation
} from '@tape.xyz/lens'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import Link from 'next/link'
import React, { memo } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  id: string
}

const PinnedVideo: FC<Props> = ({ id }) => {
  const { activeProfile } = useProfileStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    }
  })

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
    Tower.track(EVENTS.PUBLICATION.UNPIN)
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
      ?.filter((attr) => !['app', 'pinnedPublicationId'].includes(attr.key))
      .map(({ key, type, value }) => ({
        key,
        type: MetadataAttributeType[type] as any,
        value
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
      const pfp = getProfilePictureUri(activeProfile as Profile)
      const metadata: ProfileOptions = {
        ...(activeProfile?.metadata?.displayName && {
          name: activeProfile?.metadata?.displayName
        }),
        ...(activeProfile?.metadata?.bio && {
          bio: activeProfile?.metadata?.bio
        }),
        ...(pfp && {
          picture: pfp
        }),
        appId: TAPE_APP_ID,
        attributes: [
          ...otherAttributes,
          {
            key: 'app',
            type: MetadataAttributeType.STRING,
            value: TAPE_APP_ID
          }
        ],
        coverPicture: getProfileCoverPicture(activeProfile),
        id: uuidv4(),
        name: activeProfile?.metadata?.displayName ?? ''
      }
      metadata.attributes = metadata.attributes?.filter(
        (m) => Boolean(trimify(m.key)) && Boolean(trimify(m.value))
      )
      const metadataURI = await uploadToAr(profile(metadata))
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-hidden gap-5">
        <div className="overflow-hidden rounded-xl">
          <VideoPlayer
            address={activeProfile?.ownedBy.address}
            isSensitiveContent={isSensitiveContent}
            options={{
              autoPlay: true,
              isCurrentlyShown: true,
              loadingSpinner: true,
              loop: false
            }}
            posterUrl={thumbnailUrl}
            url={getPublicationMediaUrl(pinnedPublication.metadata)}
          />
        </div>
        <div className="group flex flex-col justify-between pl-2 gap-3 lg:col-span-2">
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
                  className="invisible hover:!bg-red-200 group-hover:visible dark:hover:!bg-red-800"
                  color="red"
                  highContrast
                  onClick={() => unpinVideo()}
                  size="2"
                  variant="soft"
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
            className="text-brand-500 font-medium"
            href={`/watch/${pinnedPublication.id}`}
          >
            Watch video
          </Link>
        </div>
      </div>
    </div>
  )
}

export default memo(PinnedVideo)
