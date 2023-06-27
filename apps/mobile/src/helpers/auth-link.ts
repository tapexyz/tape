import { ApolloLink, fromPromise, toPromise } from '@apollo/client'
import { LENS_API_URL, LENSTUBE_WEBSITE_URL } from '@lenstube/constants'
import { logger, parseJwt } from '@lenstube/generic'
import axios from 'axios'

import { hydrateAuthTokens, signIn, signOut } from '../hooks/useAuth'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const mobileAuthLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Origin: LENSTUBE_WEBSITE_URL
    }
  })
  const { accessToken, refreshToken } = hydrateAuthTokens()
  if (!accessToken || !refreshToken) {
    signOut()
    return forward(operation)
  }

  const willExpireSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000
  if (!willExpireSoon) {
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
      }
    })
    return forward(operation)
  }
  return fromPromise(
    axios
      .post(
        LENS_API_URL,
        JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken }
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(({ data: result }) => {
        operation.setContext({
          headers: {
            'x-access-token': `Bearer ${result?.data?.refresh?.accessToken}`
          }
        })
        signIn({
          accessToken: result?.data?.refresh?.accessToken,
          refreshToken: result?.data?.refresh?.refreshToken
        })
        return toPromise(forward(operation))
      })
      .catch((error) => {
        signOut()
        logger.error('[Error Refreshing Token]', error)
        location.reload()
        return toPromise(forward(operation))
      })
  )
})

export default mobileAuthLink
