import {
  LensTransactionStatusType,
  useLensTransactionStatusQuery
} from '@tape.xyz/lens'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  txHash?: string
  txId?: string
}

const usePendingTxn = ({ txHash, txId }: Props) => {
  const [indexed, setIndexed] = useState(false)

  const { data, loading, stopPolling } = useLensTransactionStatusQuery({
    variables: {
      request: { forTxHash: txHash, forTxId: txId }
    },
    skip: !txHash && !txHash?.length && !txId && !txId?.length,
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.lensTransactionStatus?.reason) {
        stopPolling()
        setIndexed(false)
        return toast.error(data?.lensTransactionStatus?.reason)
      }
      if (
        data?.lensTransactionStatus?.__typename === 'LensTransactionResult' &&
        data?.lensTransactionStatus?.txHash &&
        data.lensTransactionStatus.status === LensTransactionStatusType.Complete
      ) {
        stopPolling()
        setIndexed(true)
      }
    }
  })

  useEffect(() => {
    setIndexed(false)
  }, [txHash, txId])

  return {
    data,
    indexed,
    loading,
    error: data?.lensTransactionStatus?.reason
  }
}

export default usePendingTxn
