import { useHasTxHashBeenIndexedQuery } from 'lens'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
  txHash?: string
  txId?: string
}

const usePendingTxn = ({ txHash, txId }: Props) => {
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
    }
  }, [stopPolling, data?.hasTxHashBeenIndexed])

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
