import { gql } from '@apollo/client'

export const ProfileFields = gql`
  fragment ProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
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
  }
`

export const PostFields = gql`
  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    hidden
    metadata {
      name
      description
      content
      contentWarning
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
    }
  }
  ${ProfileFields}
`

export const VIDEO_DETAIL_QUERY = gql`
  query VideoDetails($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
      }
    }
  }
  ${PostFields}
`
