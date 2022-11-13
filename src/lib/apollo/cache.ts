import { InMemoryCache } from '@apollo/client'
import result from 'src/types/lens'

import cursorBasedPagination from './cursorBasedPagination'

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        feed: cursorBasedPagination(['request', ['profileId']]),
        explorePublications: cursorBasedPagination([
          'request',
          ['sortCriteria', 'noRandomize', 'profileId', 'sources']
        ]),
        publications: cursorBasedPagination([
          'request',
          ['profileId', 'commentsOf', 'publicationTypes', 'sources']
        ]),
        nfts: cursorBasedPagination(['request', ['ownerAddress']]),
        notifications: cursorBasedPagination([
          'request',
          ['profileId', 'notificationTypes']
        ]),
        followers: cursorBasedPagination(['request', ['profileId']]),
        following: cursorBasedPagination(['request', ['address']]),
        search: cursorBasedPagination(['request', ['query', 'type']]),
        profiles: cursorBasedPagination([
          'request',
          ['profileIds', 'ownedBy', 'handles', 'whoMirroredPublicationId']
        ]),
        whoCollectedPublication: cursorBasedPagination([
          'request',
          ['publicationId']
        ]),
        whoReactedPublication: cursorBasedPagination([
          'request',
          ['publicationId']
        ]),
        mutualFollowersProfiles: cursorBasedPagination([
          'request',
          ['viewingProfileId', 'yourProfileId', 'limit']
        ])
      }
    }
  }
})

export default cache
