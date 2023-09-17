import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getIsSensitiveContent,
  getPublicationHlsUrl,
  getPublicationRawMediaUrl,
  getRelativeTime,
  getSignature,
  getThumbnailUrl,
  imageCdn,
  isWatchable,
  sanitizeDStorageUrl,
  uploadToAr
} from '@lenstube/generic'
import type {
  Attribute,
  CreatePublicSetProfileMetadataUriRequest,
  Publication
} from '@lenstube/lens'
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation,
  usePublicationDetailsQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
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
  const { openConnectModal } = useConnectModal()
  const activeChannel = useChannelStore((state) => state.activeChannel)

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id }
    },
    skip: !id
  })
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const publication = data?.publication as Publication
  const pinnedPublication =
    publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

  const isBytesVideo = pinnedPublication?.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(
    pinnedPublication?.metadata,
    pinnedPublication?.id
  )
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(pinnedPublication, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  const otherAttributes =
    (activeChannel?.attributes as Attribute[])
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

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    toast.success(t`Transaction submitted`)
    Analytics.track(TRACK.PUBLICATION.UNPIN)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted: ({ createSetProfileMetadataViaDispatcher }) =>
        onCompleted(createSetProfileMetadataViaDispatcher.__typename)
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            const { profileId, metadata } = typedData.value
            return write?.({ args: [profileId, metadata] })
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

  const unpinVideo = async () => {
    if (!activeChannel) {
      return openConnectModal?.()
    }
    try {
      toast.loading(t`Unpinning video...`)
      const metadataUri = await uploadToAr({
        version: '1.0.0',
        metadata_id: uuidv4(),
        name: activeChannel?.name ?? '',
        bio: activeChannel?.bio ?? '',
        cover_picture: getChannelCoverPicture(activeChannel),
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      })
      const request = {
        profileId: activeChannel?.id,
        metadata: metadataUri
      }
      const canUseDispatcher =
        activeChannel?.dispatcher?.canUseRelay &&
        activeChannel.dispatcher.sponsor
      if (!canUseDispatcher) {
        return createTypedData(request)
      }
      createViaDispatcher(request)
    } catch {}
  }

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (error || !pinnedPublication || !isWatchable(pinnedPublication)) {
    return null
  }

  return (
    <div className="mb-6 mt-2 grid grid-cols-3 overflow-hidden border-b border-gray-300 pb-6 dark:border-gray-700 md:space-x-5">
      <div className="overflow-hidden md:rounded-xl">
        <VideoPlayer
          address={selectedSimpleProfile?.ownedBy}
          permanentUrl={getPublicationRawMediaUrl(pinnedPublication)}
          hlsUrl={getPublicationHlsUrl(pinnedPublication)}
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
      <div className="group flex flex-col justify-between px-2 lg:col-span-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Link
              className="inline break-words text-lg font-medium"
              href={`/watch/${pinnedPublication.id}`}
              title={pinnedPublication.metadata?.name ?? ''}
            >
              {pinnedPublication.metadata?.name}
            </Link>
            <Button
              variant="hover"
              size="sm"
              className="invisible hover:!bg-red-200 group-hover:visible dark:hover:!bg-red-800"
              onClick={() => unpinVideo()}
            >
              Unpin
            </Button>
          </div>
          <div className="flex items-center overflow-hidden opacity-70">
            <span className="whitespace-nowrap">
              {pinnedPublication.stats?.totalUpvotes} <Trans>likes</Trans>
            </span>
            <span className="middot" />
            {pinnedPublication.createdAt && (
              <span className="whitespace-nowrap">
                {getRelativeTime(pinnedPublication.createdAt)}
              </span>
            )}
          </div>
          <p className="line-clamp-6 text-sm">
            {pinnedPublication.metadata?.description}
          </p>
        </div>
        <Link
          className="text-xs font-semibold text-indigo-500"
          href={`/watch/${pinnedPublication.id}`}
        >
          <Trans>View more</Trans>
        </Link>
      </div>
    </div>
  )
}

export default PinnedVideo
