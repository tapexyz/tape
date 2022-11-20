import { ApolloClient, InMemoryCache } from '@apollo/client'
import { API_URL } from 'utils'

const apolloNodeClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export default apolloNodeClient
