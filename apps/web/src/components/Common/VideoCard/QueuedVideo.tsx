import usePendingTxn from '@hooks/usePendingTxn'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import { tw, useAverageColor } from '@tape.xyz/browser'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import {
  PublicationDocument,
  usePublicationQuery,
  useTxIdToTxHashQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import type { QueuedVideoType } from '@tape.xyz/lens/custom-types'
import { Tooltip } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'

import Badge from '../Badge'

type Props = {
  queuedVideo: QueuedVideoType
}

const QueuedVideo: FC<Props> = ({ queuedVideo }) => {
  const { activeProfile } = useProfileStore()
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)

  const { cache } = useApolloClient()

  const thumbnailUrl = imageCdn(
    uploadedMedia.isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.webp`
      : sanitizeDStorageUrl(queuedVideo.thumbnailUrl),
    uploadedMedia.isByteVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(
    thumbnailUrl,
    uploadedMedia.isByteVideo
  )

  const removeFromQueue = () => {
    setUploadedMedia(UPLOADED_VIDEO_FORM_DEFAULTS)
    if (!queuedVideo.txnId) {
      return setQueuedVideos(
        queuedVideos.filter((q) => q.txnHash !== queuedVideo.txnHash)
      )
    }
    setQueuedVideos(queuedVideos.filter((q) => q.txnId !== queuedVideo.txnId))
  }

  const { indexed } = usePendingTxn({
    txId: queuedVideo.txnId
  })

  const { data: txHashData } = useTxIdToTxHashQuery({
    variables: {
      for: queuedVideo.txnId
    },
    skip: !indexed || !queuedVideo.txnId?.length
  })

  const { stopPolling } = usePublicationQuery({
    variables: {
      request: { forTxHash: txHashData?.txIdToTxHash || queuedVideo.txnHash }
    },
    skip: !txHashData?.txIdToTxHash?.length && !queuedVideo.txnHash?.length,
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (data?.publication?.txHash) {
        stopPolling()
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: { publication: data?.publication },
                query: PublicationDocument
              })
            }
          }
        })
        removeFromQueue()
      }
    }
  })

  if (!queuedVideo?.txnId && !queuedVideo?.txnHash) {
    return null
  }

  return (
    <div className="cursor-wait">
      <Tooltip content="Indexing, please wait..." placement="top">
        <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
          <img
            src={thumbnailUrl}
            className={tw(
              'h-full w-full bg-gray-100 object-center md:rounded-xl lg:h-full lg:w-full dark:bg-gray-900',
              uploadedMedia.isByteVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt="thumbnail"
            draggable={false}
          />
        </div>
      </Tooltip>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <img
            className="size-8 rounded-full"
            src={getProfilePicture(activeProfile, 'AVATAR')}
            alt={getProfile(activeProfile)?.slug}
            draggable={false}
          />
          <div className="grid flex-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
              <span
                className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words font-bold"
                title={queuedVideo.title}
              >
                {queuedVideo.title}
              </span>
              <div className="p-1">
                <Tooltip content="Indexing" placement="top">
                  <span className="relative flex size-2 items-center justify-center">
                    <span className="bg-brand-500 absolute inline-flex size-2 animate-ping rounded-full opacity-75" />
                    <span className="bg-brand-500 relative inline-flex size-1.5 rounded-full" />
                  </span>
                </Tooltip>
              </div>
            </div>
            <span className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70">
              <span>{getProfile(activeProfile)?.slug}</span>
              <Badge id={activeProfile?.id} size="xs" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueuedVideo
