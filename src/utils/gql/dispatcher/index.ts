import { gql } from '@apollo/client'

export const CREATE_SET_DISPATCHER_TYPED_DATA = gql`
  mutation CreateSetDispatcherTypedData($request: SetDispatcherRequest!) {
    createSetDispatcherTypedData(request: $request) {
      id
      typedData {
        types {
          SetDispatcherWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          dispatcher
        }
      }
    }
  }
`

const RelayerResult = gql`
  fragment RelayerResult on RelayResult {
    ... on RelayerResult {
      txId
      txHash
    }
    ... on RelayError {
      reason
    }
  }
`

export const CREATE_COMMENT_VIA_DISPATHCER = gql`
  mutation CreateCommentViaDispatcher($request: CreatePublicCommentRequest!) {
    createCommentViaDispatcher(request: $request) {
      ...RelayerResult
    }
  }
  ${RelayerResult}
`

export const CREATE_MIRROR_VIA_DISPATHCER = gql`
  mutation CreateMirrorViaDispatcher($request: CreateMirrorRequest!) {
    createMirrorViaDispatcher(request: $request) {
      ...RelayerResult
    }
  }
  ${RelayerResult}
`

export const CREATE_POST_VIA_DISPATHCER = gql`
  mutation CreatePostViaDispatcher($request: CreatePublicPostRequest!) {
    createPostViaDispatcher(request: $request) {
      ...RelayerResult
    }
  }
  ${RelayerResult}
`

export const CREATE_SET_PROFILE_METADATA_VIA_DISPATHCER = gql`
  mutation CreateSetProfileMetadataViaDispatcher(
    $request: CreatePublicSetProfileMetadataURIRequest!
  ) {
    createSetProfileMetadataViaDispatcher(request: $request) {
      ...RelayerResult
    }
  }
  ${RelayerResult}
`

export const CREATE_SET_PROFILE_IMAGE_URI_VIA_DISPATHCER = gql`
  mutation CreateSetProfileImageURIViaDispatcher(
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURIViaDispatcher(request: $request) {
      ...RelayerResult
    }
  }
  ${RelayerResult}
`
