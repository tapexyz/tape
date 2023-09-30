import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery,
  useTxIdToTxHashLazyQuery
} from '@lenstube/lens'
import { useApolloClient } from '@lenstube/lens/apollo'
import type { QueuedCommentType } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  queuedComment: QueuedCommentType
}

const QueuedComment: FC<Props> = ({ queuedComment }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
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
                data: { publication: data?.publication },
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
    notifyOnNetworkStatusChange: true,
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

  if (
    (!queuedComment?.txnId && !queuedComment?.txnHash) ||
    !selectedSimpleProfile
  ) {
    return null
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link
          href={`/channel/${trimLensHandle(selectedSimpleProfile?.handle)}`}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(selectedSimpleProfile as Profile, 'AVATAR')}
            className="h-7 w-7 rounded-full"
            draggable={false}
            alt={selectedSimpleProfile?.handle}
          />
        </Link>
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-1 flex items-center space-x-1">
            <Link
              href={`/channel/${trimLensHandle(selectedSimpleProfile.handle)}`}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{trimLensHandle(selectedSimpleProfile?.handle)}</span>
              <Badge id={selectedSimpleProfile.id} />
            </Link>
          </span>
          <InterweaveContent content={queuedComment.comment} />
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
