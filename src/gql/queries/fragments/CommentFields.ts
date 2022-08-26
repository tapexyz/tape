import { gql } from '@apollo/client'

import { CollectFields } from './CollectFields'
import { ProfileFields } from './ProfileFields'

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    hidden
    collectModule {
      ...CollectFields
    }
    stats {
      totalDownvotes
      totalUpvotes
    }
    metadata {
      name
      description
      content
      media {
        original {
          url
          mimeType
        }
      }
      attributes {
        traitType
        value
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
