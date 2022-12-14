import { useApolloClient } from '@apollo/client'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Profile } from 'lens'
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery,
  useTxIdToTxHashLazyQuery
} from 'lens'
import type { FC } from 'react'
import React from 'react'
import type { QueuedVideoType } from 'utils'
import { STATIC_ASSETS } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'

import IsVerified from '../IsVerified'

type Props = {
  queuedVideo: QueuedVideoType
}

const QueuedVideo: FC<Props> = ({ queuedVideo }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)

  const { cache } = useApolloClient()
  const [getTxnHash] = useTxIdToTxHashLazyQuery()

  const thumbnailUrl = imageCdn(
    uploadedVideo.isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : sanitizeIpfsUrl(uploadedVideo.thumbnail),
    uploadedVideo.isByteVideo ? 'thumbnail_v' : 'thumbnail'
  )

  const removeFromQueue = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
    if (!queuedVideo.txnId) {
      return setQueuedVideos(
        queuedVideos.filter((q) => q.txnHash !== queuedVideo.txnHash)
      )
    }
    setQueuedVideos(queuedVideos.filter((q) => q.txnId !== queuedVideo.txnId))
  }

  const [getPublication] = usePublicationDetailsLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: data?.publication as any,
                query: PublicationDetailsDocument
              })
            }
          }
        })
        removeFromQueue()
      }
    }
  })

  const getVideoByTxnId = async () => {
    const { data } = await getTxnHash({
      variables: {
        txId: queuedVideo.txnId
      }
    })
    if (data?.txIdToTxHash) {
      getPublication({
        variables: { request: { txHash: data?.txIdToTxHash } }
      })
    }
  }

  const { stopPolling } = useHasTxHashBeenIndexedQuery({
    variables: {
      request: { txId: queuedVideo?.txnId, txHash: queuedVideo?.txnHash }
    },
    skip: !queuedVideo?.txnId?.length && !queuedVideo?.txnHash?.length,
    pollInterval: 1000,
    onCompleted: async (data) => {
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
        return removeFromQueue()
      }
      if (
        data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
        data?.hasTxHashBeenIndexed?.indexed
      ) {
        stopPolling()
        if (queuedVideo.txnHash) {
          return getPublication({
            variables: { request: { txHash: queuedVideo?.txnHash } }
          })
        }
        await getVideoByTxnId()
      }
    }
  })

  if (!queuedVideo?.txnId && !queuedVideo?.txnHash) return null

  return (
    <div className="cursor-wait">
      <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
        <img
          src={thumbnailUrl}
          draggable={false}
          className={clsx(
            'object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full',
            uploadedVideo.isByteVideo ? 'object-contain' : 'object-cover'
          )}
          alt="thumbnail"
        />
      </div>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <img
            className="w-8 h-8 rounded-full"
            src={getProfilePicture(selectedChannel as Profile)}
            alt={selectedChannel?.handle}
            draggable={false}
          />
          <div className="grid flex-1">
            <div className="flex pb-1 w-full items-start justify-between space-x-1.5 min-w-0">
              <span className="text-sm font-semibold line-clamp-2 break-words">
                {uploadedVideo.title}
              </span>
              <div className="p-1">
                <Tooltip content="Indexing" placement="top">
                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
                  </span>
                </Tooltip>
              </div>
            </div>
            <span className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70">
              <span>{selectedChannel?.handle}</span>
              <IsVerified id={selectedChannel?.id} size="xs" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueuedVideo
