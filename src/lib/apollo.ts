import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { API_URL } from '@utils/constants'
import { REFRESH_AUTHENTICATION_MUTATION } from '@utils/gql/queries'
import jwtDecode from 'jwt-decode'
import result from 'src/types'

const httpLink = new HttpLink({
  uri: API_URL,
  fetch
})

const clearStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('app-storage')
}

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    clearStorage()
    return forward(operation)
  } else {
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
      }
    })
    const accessTokenDecrypted: any = jwtDecode(accessToken)
    const isExpireSoon = Date.now() >= accessTokenDecrypted.exp * 1000
    if (isExpireSoon) {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.getItem('refreshToken') }
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          operation.setContext({
            headers: {
              'x-access-token': `Bearer ${res?.data?.refresh?.accessToken}`
            }
          })
          localStorage.setItem('accessToken', res?.data?.refresh?.accessToken)
          localStorage.setItem('refreshToken', res?.data?.refresh?.refreshToken)
        })
        .catch((err) => console.error('Error refreshing token ' + err))
    }
    return forward(operation)
  }
})

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({ possibleTypes: result.possibleTypes })
})

export default apolloClient
