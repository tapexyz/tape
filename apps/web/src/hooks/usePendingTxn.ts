import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@lenstube/lens'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
  txHash?: string
  txId?: string
}

const usePendingTxn = ({ txHash, txId }: Props) => {
  const { data, loading, stopPolling } = useLensTransactionStatusQuery({
    variables: {
      request: { forTxHash: txHash, forTxId: txId }
    },
    skip: !txHash && !txHash?.length && !txId && !txId?.length,
    pollInterval: 1000
  })

  const checkIsIndexed = useCallback(() => {
    if (
      data?.lensTransactionStatus?.__typename === 'LensTransactionResult' &&
      data?.lensTransactionStatus?.txHash &&
      data.lensTransactionStatus.status === LensTransactionStatusType.Complete
    ) {
      stopPolling()
    }
    if (data?.lensTransactionStatus?.reason) {
      stopPolling()
      return toast.error(`Relay Error - ${data?.lensTransactionStatus?.reason}`)
    }
  }, [stopPolling, data?.lensTransactionStatus])

  useEffect(() => {
    checkIsIndexed()
  }, [data, checkIsIndexed])

  return {
    data,
    indexed:
      data?.lensTransactionStatus?.__typename === 'LensTransactionResult' &&
      data?.lensTransactionStatus?.txHash,
    loading
  }
}

export default usePendingTxn
