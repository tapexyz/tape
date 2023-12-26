import type { QueuedCommentType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import {
  LensTransactionStatusType,
  PublicationDocument,
  useLensTransactionStatusQuery,
  usePublicationLazyQuery,
  useTxIdToTxHashLazyQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import Link from 'next/link'
import React from 'react'

type Props = {
  queuedComment: QueuedCommentType
}

const QueuedComment: FC<Props> = ({ queuedComment }) => {
  const { activeProfile } = useProfileStore()
  const { queuedComments, setQueuedComments } = usePersistStore()

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

  const [getPublication] = usePublicationLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
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

  const getCommentByTxnId = async () => {
    const { data } = await getTxnHash({
      variables: {
        for: queuedComment?.txnId
      }
    })
    if (data?.txIdToTxHash) {
      getPublication({
        variables: { request: { forTxHash: data?.txIdToTxHash } }
      })
    }
  }

  const { stopPolling } = useLensTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (
        data?.lensTransactionStatus?.__typename === 'LensTransactionResult' &&
        data?.lensTransactionStatus?.reason
      ) {
        return removeFromQueue()
      }
      if (
        data?.lensTransactionStatus?.__typename === 'LensTransactionResult' &&
        data?.lensTransactionStatus?.status ===
          LensTransactionStatusType.Complete
      ) {
        stopPolling()
        if (queuedComment.txnHash) {
          return getPublication({
            variables: {
              request: { forTxHash: queuedComment.txnHash }
            }
          })
        }
        await getCommentByTxnId()
      }
    },
    pollInterval: 1000,
    skip: !queuedComment?.txnId?.length && !queuedComment?.txnHash?.length,
    variables: {
      request: {
        forTxHash: queuedComment?.txnHash,
        forTxId: queuedComment?.txnId
      }
    }
  })

  if ((!queuedComment?.txnId && !queuedComment?.txnHash) || !activeProfile) {
    return null
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link
          className="mr-3 mt-0.5 flex-none"
          href={`/u/${getProfile(activeProfile)?.slug}`}
        >
          <img
            alt={getProfile(activeProfile)?.slug}
            className="size-7 rounded-full"
            draggable={false}
            src={getProfilePicture(activeProfile, 'AVATAR')}
          />
        </Link>
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-1 flex items-center space-x-1">
            <Link
              className="flex items-center space-x-1 text-sm font-medium"
              href={`/u/${getProfile(activeProfile)?.slug}`}
            >
              <span>{getProfile(activeProfile)?.slug}</span>
              <Badge id={activeProfile.id} />
            </Link>
          </span>
          <InterweaveContent content={queuedComment.comment} />
        </div>
      </div>
      <div>
        <div className="p-2">
          <Tooltip content="Indexing" placement="top">
            <span className="relative flex size-2 items-center justify-center">
              <span className="bg-brand-400 absolute inline-flex size-2 animate-ping rounded-full opacity-75" />
              <span className="bg-brand-500 relative inline-flex size-1.5 rounded-full" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default QueuedComment
