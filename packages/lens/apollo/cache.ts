import { InMemoryCache } from '@apollo/client'
import result from '@tape.xyz/lens'

import cursorBasedPagination from './cursorBasedPagination'

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        feed: cursorBasedPagination(['request', ['where']]),
        explorePublications: cursorBasedPagination([
          'request',
          ['orderBy', 'limit', 'where']
        ]),
        publicationsProfileBookmarks: cursorBasedPagination([
          'request',
          ['orderBy', 'limit', 'where']
        ]),
        publications: cursorBasedPagination([
          'request',
          ['orderBy', 'limit', 'where']
        ]),
        nfts: cursorBasedPagination(['request', ['limit', 'where']]),
        notifications: cursorBasedPagination(['request', ['where']]),
        followers: cursorBasedPagination(['request', ['limit', 'of']]),
        following: cursorBasedPagination(['request', ['limit', 'for']]),
        searchProfiles: cursorBasedPagination([
          'request',
          ['limit', 'query', 'where']
        ]),
        searchPublications: cursorBasedPagination([
          'request',
          ['limit', 'query', 'where']
        ]),
        profiles: cursorBasedPagination(['request', ['limit', 'where']]),
        whoCollectedPublication: cursorBasedPagination([
          'request',
          ['limit', 'where', 'on']
        ]),
        mutualFollowersProfiles: cursorBasedPagination([
          'request',
          ['limit', 'viewing', 'observer']
        ]),
        whoActedOnPublication: cursorBasedPagination([
          'request',
          ['where', 'on']
        ]),
        whoHaveBlocked: cursorBasedPagination(['request', ['limit']]),
        approvedAuthentication: cursorBasedPagination(['request', ['limit']]),
        profileManagers: cursorBasedPagination(['request', ['cursor', 'for']]),
        profilesManaged: cursorBasedPagination(['request', ['cursor', 'for']])
      }
    }
  }
})

export default cache
