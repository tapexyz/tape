import { gql } from '@apollo/client'

export const ProfileFields = gql`
  fragment ProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    isDefault
    isFollowedByMe
    dispatcher {
      canUseRelay
    }
    attributes {
      key
      value
    }
    stats {
      totalFollowers
      totalPosts
    }
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
      ... on NftImage {
        uri
      }
    }
    followModule {
      __typename
    }
  }
`
