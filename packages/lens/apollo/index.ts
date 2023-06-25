import type { ApolloLink } from '@apollo/client'
import { ApolloClient, from, HttpLink } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { LENS_API_URL } from '@lenstube/constants'

import cache from './cache'

const retryLink = new RetryLink({
  delay: {
    initial: 100
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error)
  }
})

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetchOptions: 'no-cors',
  fetch
})

const apolloClient = (authLink?: ApolloLink) =>
  new ApolloClient({
    link: authLink
      ? from([authLink, retryLink, httpLink])
      : from([retryLink, httpLink]),
    cache
  })

export default apolloClient
