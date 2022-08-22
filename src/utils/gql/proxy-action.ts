import { gql } from '@apollo/client'

const ProxyActionStatusResponse = gql`
  fragment ProxyActionStatusResponse on ProxyActionStatusResultUnion {
    ... on ProxyActionStatusResult {
      txId
      status
    }
    ... on ProxyActionError {
      reason
    }
  }
`

export const PROXY_ACTION_STATUS_QUERY = gql`
  query proxyActionStatus($proxyActionId: ProxyActionId!) {
    proxyActionStatus(proxyActionId: $proxyActionId) {
      ...ProxyActionStatusResponse
    }
  }
  ${ProxyActionStatusResponse}
`

export const PROXY_ACTION_MUTATION = gql`
  mutation proxyAction($request: ProxyActionRequest!) {
    proxyAction(request: $request)
  }
`
