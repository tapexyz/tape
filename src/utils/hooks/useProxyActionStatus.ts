import { useQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'
import { ProxyActionStatusDocument } from 'src/types/lens'

const useProxyActionStatus = (proxyActionId: string) => {
  const { data, loading, stopPolling } = useQuery(ProxyActionStatusDocument, {
    variables: {
      proxyActionId
    },
    skip: !proxyActionId?.length,
    pollInterval: 1000
  })

  const checkIsTxnSubmitted = useCallback(() => {
    if (data?.proxyActionStatus?.__typename === 'ProxyActionStatusResult') {
      stopPolling()
    }
  }, [data?.proxyActionStatus, stopPolling])

  useEffect(() => {
    checkIsTxnSubmitted()
  }, [data, stopPolling, checkIsTxnSubmitted])

  return {
    txId: data?.proxyActionStatus?.__typename === 'ProxyActionStatusResult',
    loading
  }
}

export default useProxyActionStatus
