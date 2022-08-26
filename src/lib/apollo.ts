import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { REFRESH_AUTHENTICATION_MUTATION } from '@gql/queries/auth'
import { API_URL } from '@utils/constants'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import result from 'src/types'

import logger from './logger'

const retryLink = new RetryLink({
  delay: {
    initial: 100
  },
  attempts: {
    max: 2,
    retryIf: (error) => !!error
  }
})

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch
})

export const clearStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('lenstube.store')
}

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken || accessToken === 'undefined') {
    clearStorage()
    return forward(operation)
  } else {
    const accessTokenDecrypted: any = jwtDecode(accessToken)
    const isExpireSoon = Date.now() >= accessTokenDecrypted.exp * 1000
    if (isExpireSoon) {
      axios(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.getItem('refreshToken') }
          }
        })
      })
        .then(({ data: res }) => {
          operation.setContext({
            headers: {
              'x-access-token': `Bearer ${res?.data?.refresh?.accessToken}`
            }
          })
          const access = res?.data?.refresh?.accessToken
          const refresh = res?.data?.refresh?.refreshToken
          if (!access || !refresh) {
            clearStorage()
            window.location.reload()
          }
          localStorage.setItem('accessToken', access)
          localStorage.setItem('refreshToken', refresh)
        })
        .catch((error) => {
          clearStorage()
          window.location.reload()
          logger.error('[Error Refreshing Token]', error)
        })
    }
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
      }
    })
    return forward(operation)
  }
})

const cache = new InMemoryCache({ possibleTypes: result.possibleTypes })

const apolloClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache
})

export const nodeClient = new ApolloClient({
  link: httpLink,
  cache
})

export default apolloClient
