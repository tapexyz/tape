import { useQuery } from '@apollo/client'
import { PUBLICATION_STATUS_QUERY, TX_STATUS_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const usePendingTxn = (txHash: string, isPublication?: boolean) => {
  const router = useRouter()

  const { data, loading, stopPolling } = useQuery(
    isPublication ? PUBLICATION_STATUS_QUERY : TX_STATUS_QUERY,
    {
      variables: {
        request: { txHash }
      },
      skip: !txHash || !txHash?.length,
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
