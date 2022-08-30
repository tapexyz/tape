import { ApolloClient, from, HttpLink } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { API_URL } from '@utils/constants'

import authLink from './authLink'
import cache from './cache'

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

const apolloClient = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache
})

export const nodeClient = new ApolloClient({
  link: httpLink,
  cache
})

export default apolloClient
