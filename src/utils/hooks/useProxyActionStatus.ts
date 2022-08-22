import { useQuery } from '@apollo/client'
import { PROXY_ACTION_STATUS_QUERY } from '@utils/gql/proxy-action'
import { useEffect } from 'react'

const useProxyActionStatus = (proxyActionId: string) => {
  const { data, loading, stopPolling } = useQuery(PROXY_ACTION_STATUS_QUERY, {
    variables: {
      proxyActionId
    },
    skip: !proxyActionId?.length,
    pollInterval: 1000
  })

  useEffect(() => {
    const checkIsMinted = () => {
      if (data?.proxyActionStatus?.txId) {
        stopPolling()
      }
    }
    checkIsMinted()
  }, [data, stopPolling])

  return {
    txId: data?.proxyActionStatus?.txId,
    loading
  }
}

export default useProxyActionStatus
