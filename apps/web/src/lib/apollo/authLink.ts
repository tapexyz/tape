import { ApolloLink, fromPromise, toPromise } from '@apollo/client'
import logger from '@lib/logger'
import { API_URL } from '@utils/constants'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import { parseJwt } from '@utils/functions/parseJwt'
import axios from 'axios'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken || accessToken === 'undefined') {
    clearLocalStorage()
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
        API_URL,
        JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.getItem('refreshToken') }
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
        const accessToken = result?.data?.refresh?.accessToken
        const refreshToken = result?.data?.refresh?.refreshToken

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        return toPromise(forward(operation))
      })
      .catch((error) => {
        clearLocalStorage()
        window.location.reload()
        logger.error('[Error Refreshing Token]', error)
        return toPromise(forward(operation))
      })
  )
})

export default authLink
