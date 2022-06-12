import { useQuery } from '@apollo/client'
import { PUBLICATION_STATUS_QUERY, TX_STATUS_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const usePendingTxn = (txHash: string, navigate?: boolean) => {
  const router = useRouter()

  const { data, loading, stopPolling } = useQuery(
    navigate ? PUBLICATION_STATUS_QUERY : TX_STATUS_QUERY,
    {
      variables: {
        request: { txHash }
      },
      skip: txHash.length === 0,
      pollInterval: 10000
    }
  )

  useEffect(() => {
    const checkIsIndexed = async () => {
      if (data?.hasTxHashBeenIndexed?.indexed || data?.publication?.id) {
        stopPolling()
        if (navigate && data?.publication?.id)
          router.push(`/watch/${data?.publication?.id}`)
      }
    }
    checkIsIndexed()
  }, [data, stopPolling, navigate, router])

  return {
    indexed: data?.hasTxHashBeenIndexed?.indexed || !!data?.publication?.id,
    loading
  }
}

export default usePendingTxn
