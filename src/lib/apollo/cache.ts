import { InMemoryCache } from '@apollo/client'
import result from 'src/types/lens'

import cursorBasedPagination from './cursorBasedPagination'

const publicationKeyFields = () => {
  return {
    fields: {}
  }
}

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Post: publicationKeyFields(),
    Comment: publicationKeyFields(),
    Mirror: publicationKeyFields(),
    Query: {
      fields: {
        feed: cursorBasedPagination(['request', ['profileId']]),
        explorePublications: cursorBasedPagination([
          'request',
          ['sortCriteria', 'noRandomize', 'profileId']
        ]),
        publications: cursorBasedPagination([
          'request',
          ['profileId', 'commentsOf', 'publicationTypes']
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
