import { gql } from '@apollo/client'

export const CURRENT_USER_QUERY = gql`
  query currentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        id
        dispatcher {
          canUseRelay
        }
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
      }
    }
  }
`

// We are using this via axios, so it should be string mutation
export const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`

export const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`
