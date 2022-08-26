import { useQuery } from '@apollo/client'
import { PROXY_ACTION_STATUS_QUERY } from '@gql/queries/proxy-action'
import { useCallback, useEffect } from 'react'

const useProxyActionStatus = (proxyActionId: string) => {
  const { data, loading, stopPolling } = useQuery(PROXY_ACTION_STATUS_QUERY, {
    variables: {
      proxyActionId
    },
    skip: !proxyActionId?.length,
    pollInterval: 1000
  })

  const checkIsTxnSubmitted = useCallback(() => {
    if (data?.proxyActionStatus?.txId) {
      stopPolling()
    }
  }, [data?.proxyActionStatus?.txId, stopPolling])

  useEffect(() => {
    checkIsTxnSubmitted()
  }, [data, stopPolling, checkIsTxnSubmitted])

  return {
    txId: data?.proxyActionStatus?.txId,
    loading
  }
}

export default useProxyActionStatus
