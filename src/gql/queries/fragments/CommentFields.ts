import { gql } from '@apollo/client'

import { CollectFields } from './CollectFields'
import { ProfileFields } from './ProfileFields'

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    reaction(request: $reactionRequest)
    profile {
      ...ProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...CollectFields
    }
    referenceModule {
      __typename
    }
    canComment(profileId: $channelId) {
      result
    }
    canMirror(profileId: $channelId) {
      result
    }
    collectNftAddress
    onChainContentURI
    hidden
    hasCollectedByMe
    stats {
      totalAmountOfComments
      totalAmountOfCollects
      totalAmountOfMirrors
      totalUpvotes
      totalDownvotes
    }
    metadata {
      name
      description
      content
      contentWarning
      mainContentFocus
      tags
      media {
        original {
          url
          mimeType
        }
      }
      cover {
        original {
          url
        }
      }
      attributes {
        value
        traitType
      }
    }
    commentOn {
      ... on Post {
        id
        createdAt
        profile {
          ...ProfileFields
        }
        metadata {
          name
          cover {
            original {
              url
            }
          }
          attributes {
            value
            traitType
          }
        }
      }
    }
    createdAt
    appId
  }
  ${ProfileFields}
  ${CollectFields}
`
