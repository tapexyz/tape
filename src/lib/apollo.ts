import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { API_URL } from '@utils/constants'
import { REFRESH_AUTHENTICATION_MUTATION } from '@utils/gql/queries'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode from 'jwt-decode'
import result, { AuthenticationResult } from 'src/types'

const httpLink = new HttpLink({
  uri: API_URL,
  fetch
})

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('accessToken')
  return {
    headers: {
      ...headers,
      'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
    }
  }
})

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      const accessTokenDecrypted: any = jwtDecode(accessToken)
      if (Date.now() >= accessTokenDecrypted.exp * 1000) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  },
  fetchAccessToken: () => {
    const refreshToken = localStorage.getItem('refreshToken')
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'Refresh',
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken }
        }
      })
    })
  },
  handleFetch: async (response: any) => {
    const result = await response.json()
    const { refresh }: { refresh: AuthenticationResult } = result?.data
    const accessToken = refresh?.accessToken
    const refreshToken = refresh?.refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },
  handleResponse: () => async (response: any) => {
    const result = await response.json()
    const { refresh }: { refresh: AuthenticationResult } = result?.data
    const accessToken = refresh?.accessToken
    const refreshToken = refresh?.refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },
  handleError: (err: Error) => {
    console.log('🚀 ~ file: apollo.ts ~ err', err)
  }
})

const apolloClient = new ApolloClient({
  link: from([authLink, refreshLink, httpLink]),
  cache: new InMemoryCache({ possibleTypes: result.possibleTypes })
})

export default apolloClient
