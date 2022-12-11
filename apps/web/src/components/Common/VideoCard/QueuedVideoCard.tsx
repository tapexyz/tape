import { useApolloClient } from '@apollo/client'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore, {
  UPLOADED_VIDEO_FORM_DEFAULTS
} from '@lib/store/persist'
import clsx from 'clsx'
import type { Profile } from 'lens'
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery,
  useTxIdToTxHashLazyQuery
} from 'lens'
import React from 'react'
import { STATIC_ASSETS } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'

import IsVerified from '../IsVerified'

const QueuedVideoCard = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)
  const setUploadedVideo = usePersistStore((state) => state.setUploadedVideo)
  const thumbnailUrl = imageCdn(
    uploadedVideo.isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : sanitizeIpfsUrl(uploadedVideo.thumbnail),
    uploadedVideo.isByteVideo ? 'thumbnail_v' : 'thumbnail'
  )
  const { cache } = useApolloClient()
  const [getTxnHash] = useTxIdToTxHashLazyQuery()

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
        setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
      }
    }
  })

  const getIndexedPublication = async () => {
    const { data } = await getTxnHash({
      variables: {
        txId: uploadedVideo.txnId
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
      request: { txId: uploadedVideo.txnId }
    },
    skip: !uploadedVideo.txnId?.length,
    pollInterval: 1000,
    onCompleted: async (data) => {
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
        return setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
      }
      if (
        data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
        data?.hasTxHashBeenIndexed?.indexed
      ) {
        stopPolling()
        await getIndexedPublication()
      }
    }
  })

  if (!uploadedVideo.txnId) return null

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

export default QueuedVideoCard
