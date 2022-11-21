import useAppStore from '@lib/store'
import { useHasTxHashBeenIndexedQuery } from 'lens'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
  txHash?: string
  txId?: string
  isPublication?: boolean
}

const usePendingTxn = ({ txHash, txId, isPublication }: Props) => {
  const router = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { data, loading, stopPolling } = useHasTxHashBeenIndexedQuery({
    variables: {
      request: { txHash, txId }
    },
    skip: !txHash && !txHash?.length && !txId && !txId?.length,
    pollInterval: 1000
  })

  const checkIsIndexed = useCallback(() => {
    if (data?.hasTxHashBeenIndexed?.__typename) {
      if (
        data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
        data?.hasTxHashBeenIndexed?.indexed
      ) {
        stopPolling()
      }

      if (data?.hasTxHashBeenIndexed?.__typename === 'TransactionError') {
        stopPolling()
        return toast.error(
          `Relay Error - ${data?.hasTxHashBeenIndexed?.reason}`
        )
      }
      if (isPublication) router.push(`/channel/${selectedChannel?.handle}`)
    }
  }, [
    router,
    stopPolling,
    data?.hasTxHashBeenIndexed,
    selectedChannel?.handle,
    isPublication
  ])

  useEffect(() => {
    checkIsIndexed()
  }, [data, checkIsIndexed])

  return {
    data,
    indexed:
      data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
      data.hasTxHashBeenIndexed.indexed,
    loading
  }
}

export default usePendingTxn
