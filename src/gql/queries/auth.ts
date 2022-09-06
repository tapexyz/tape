import { gql } from '@apollo/client'

import { ProfileFields } from './fragments/ProfileFields'

// We are using this via axios, so it should be string mutation
export const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

export const CURRENT_USER_PROFILES_QUERY = gql`
  query userChannels($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${ProfileFields}
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
