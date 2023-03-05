import { useApolloClient } from '@apollo/client'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import Tooltip from '@components/UIElements/Tooltip'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery,
  useTxIdToTxHashLazyQuery
} from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { QueuedCommentType } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  queuedComment: QueuedCommentType
}

const QueuedComment: FC<Props> = ({ queuedComment }) => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const setQueuedComments = usePersistStore((state) => state.setQueuedComments)

  const { cache } = useApolloClient()
  const [getTxnHash] = useTxIdToTxHashLazyQuery()

  const removeFromQueue = () => {
    if (!queuedComment.txnId) {
      return setQueuedComments(
        queuedComments.filter((q) => q.txnHash !== queuedComment.txnHash)
      )
    }
    setQueuedComments(
      queuedComments.filter((q) => q.txnId !== queuedComment.txnId)
    )
  }

  const [getPublication] = usePublicationDetailsLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: data?.publication as Publication,
                query: PublicationDetailsDocument
              })
            }
          }
        })
        removeFromQueue()
      }
    }
  })

  const getCommentByTxnId = async () => {
    const { data } = await getTxnHash({
      variables: {
        txId: queuedComment?.txnId
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
      request: { txId: queuedComment?.txnId, txHash: queuedComment?.txnHash }
    },
    skip: !queuedComment?.txnId?.length && !queuedComment?.txnHash?.length,
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
        if (queuedComment.txnHash) {
          return getPublication({
            variables: { request: { txHash: queuedComment?.txnHash } }
          })
        }
        await getCommentByTxnId()
      }
    }
  })

  if ((!queuedComment?.txnId && !queuedComment?.txnHash) || !selectedChannel) {
    return null
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link
          href={`/channel/${selectedChannel?.handle}`}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(selectedChannel, 'avatar')}
            className="h-7 w-7 rounded-full"
            draggable={false}
            alt={selectedChannel?.handle}
          />
        </Link>
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-1 flex items-center space-x-1">
            <Link
              href={`/channel/${selectedChannel.handle}`}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{selectedChannel?.handle}</span>
              <IsVerified id={selectedChannel.id} />
            </Link>
          </span>
          <div className="text-sm opacity-80">
            <InterweaveContent content={queuedComment.comment} />
          </div>
        </div>
      </div>
      <div>
        <div className="p-2">
          <Tooltip content="Indexing" placement="top">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default QueuedComment
