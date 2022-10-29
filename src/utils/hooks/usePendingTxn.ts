import { useQuery } from '@apollo/client'
import { TX_STATUS_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
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

  const { data, loading, stopPolling } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash, txId }
    },
    skip: !txHash && !txHash?.length && !txId && !txId?.length,
    pollInterval: 1000
  })

  const checkIsIndexed = useCallback(() => {
    if (
      data?.hasTxHashBeenIndexed?.indexed ||
      data?.hasTxHashBeenIndexed?.reason
    ) {
      stopPolling()
      if (data?.hasTxHashBeenIndexed?.reason) {
        return toast.error(
          `Relay Error - ${data?.hasTxHashBeenIndexed?.reason}`
        )
      }
      if (isPublication) router.push(`/${selectedChannel?.handle}`)
    }
  }, [
    router,
    stopPolling,
    data?.hasTxHashBeenIndexed?.indexed,
    data?.hasTxHashBeenIndexed?.reason,
    selectedChannel?.handle,
    isPublication
  ])

  useEffect(() => {
    checkIsIndexed()
  }, [data, checkIsIndexed])

  return {
    data,
    indexed: data?.hasTxHashBeenIndexed?.indexed,
    loading
  }
}

export default usePendingTxn
