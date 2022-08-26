import { gql } from '@apollo/client'

import { CollectFields } from './CollectFields'
import { ProfileFields } from './ProfileFields'

export const PostFields = gql`
  fragment PostFields on Post {
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
    createdAt
    appId
  }
  ${ProfileFields}
  ${CollectFields}
`
