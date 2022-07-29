import { useQuery } from '@apollo/client'
import { PUBLICATION_STATUS_QUERY, TX_STATUS_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type Props = {
  txHash?: string
  txId?: string
  isPublication?: boolean
}

const usePendingTxn = ({ txHash, txId, isPublication = false }: Props) => {
  const router = useRouter()

  const { data, loading, stopPolling } = useQuery(
    isPublication ? PUBLICATION_STATUS_QUERY : TX_STATUS_QUERY,
    {
      variables: {
        request: { txHash, txId }
      },
      skip: !txHash && !txHash?.length && !txId && !txId?.length,
      pollInterval: 1000
    }
  )

  useEffect(() => {
    const checkIsIndexed = () => {
      if (data?.hasTxHashBeenIndexed?.indexed || data?.publication?.id) {
        stopPolling()
        if (isPublication && data?.publication?.id)
          router.push(`/watch/${data?.publication?.id}`)
      }
    }
    checkIsIndexed()
  }, [data, stopPolling, isPublication, router])

  return {
    data,
    indexed: data?.hasTxHashBeenIndexed?.indexed || !!data?.publication?.id,
    loading
  }
}

export default usePendingTxn
