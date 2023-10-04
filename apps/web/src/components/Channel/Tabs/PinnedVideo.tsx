import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import { LENSHUB_PROXY_ABI } from '@lenstube/abis'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getIsSensitiveContent,
  getProfilePicture,
  getPublicationMediaUrl,
  getSignature,
  getThumbnailUrl,
  imageCdn,
  isWatchable,
  sanitizeDStorageUrl,
  uploadToAr
} from '@lenstube/generic'
import type {
  AnyPublication,
  MirrorablePublication,
  OnchainSetProfileMetadataRequest,
  Profile
} from '@lenstube/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  usePublicationQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import { getRelativeTime } from '@lib/formatTime'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
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
  const handleWrongNetwork = useHandleWrongNetwork()

  const activeChannel = useChannelStore((state) => state.activeChannel)

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  })
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const publication = data?.publication as AnyPublication
  const pinnedPublication =
    publication?.__typename === 'Mirror'
      ? (publication.mirrorOn as MirrorablePublication)
      : (publication as MirrorablePublication)

  const isBytesVideo =
    pinnedPublication?.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const isVideoOwner = activeChannel?.id === pinnedPublication?.by.id

  const isSensitiveContent = getIsSensitiveContent(
    pinnedPublication?.metadata,
    pinnedPublication?.id
  )
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(pinnedPublication, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  const otherAttributes =
    (activeChannel?.metadata?.attributes as MetadataAttribute[])
      ?.filter((attr) => !['pinnedPublicationId', 'app'].includes(attr.key))
      .map(({ key, value, type }) => ({
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
    Analytics.track(TRACK.PUBLICATION.UNPIN)
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

  const unpinVideo = async () => {
    if (!activeChannel) {
      return openConnectModal?.()
    }
    if (handleWrongNetwork()) {
      return
    }

    try {
      toast.loading(t`Unpinning video...`)
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
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      })
      const metadataURI = await uploadToAr(metadata)
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI
      }

      const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor
      if (!canUseRelay) {
        return createSetProfileMetadataTypedData({
          variables: { request }
        })
      }
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
          address={selectedSimpleProfile?.ownedBy.address}
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
      <div className="group flex flex-col justify-between px-2 lg:col-span-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Link
              className="inline break-words text-lg font-medium"
              href={`/watch/${pinnedPublication.id}`}
              title={pinnedPublication.metadata?.marketplace?.name ?? ''}
            >
              {pinnedPublication.metadata?.marketplace?.name}
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
              {pinnedPublication.stats?.reactions} <Trans>likes</Trans>
            </span>
            <span className="middot" />
            {pinnedPublication.createdAt && (
              <span className="whitespace-nowrap">
                {getRelativeTime(pinnedPublication.createdAt)}
              </span>
            )}
          </div>
          <p className="line-clamp-6 text-sm">
            {pinnedPublication.metadata?.marketplace?.description}
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
