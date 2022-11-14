import { useCallback, useEffect } from 'react'
import { useProxyActionStatusQuery } from 'src/types/lens'

const useProxyActionStatus = (proxyActionId: string) => {
  const { data, loading, stopPolling } = useProxyActionStatusQuery({
    variables: {
      proxyActionId
    },
    skip: !proxyActionId?.length,
    pollInterval: 1000
  })

  const checkIsTxnSubmitted = useCallback(() => {
    if (
      data?.proxyActionStatus?.__typename === 'ProxyActionStatusResult' &&
      data?.proxyActionStatus?.txId
    ) {
      stopPolling()
    }
  }, [data?.proxyActionStatus, stopPolling])

  useEffect(() => {
    checkIsTxnSubmitted()
  }, [data, stopPolling, checkIsTxnSubmitted])

  return {
    txId:
      data?.proxyActionStatus?.__typename === 'ProxyActionStatusResult'
        ? data?.proxyActionStatus?.txId
        : null,
    loading
  }
}

export default useProxyActionStatus
