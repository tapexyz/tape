import { gql } from '@apollo/client'

export const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

export const MinimalProfileFields = gql`
  fragment MinimalProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    isFollowedByMe
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

export const MinimalCollectModuleFields = gql`
  fragment MinimalCollectModuleFields on CollectModule {
    ... on FreeCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
  }
`

export const MetadataFields = gql`
  fragment MetadataFields on MetadataOutput {
    name
    description
    content
    cover {
      original {
        url
      }
    }
    media {
      original {
        url
        mimeType
      }
    }
    attributes {
      value
      traitType
    }
  }
`

export const MirrorFieldsFragment = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      name
      handle
    }
    reaction(request: $reactionRequest)
    collectModule {
      ...MinimalCollectModuleFields
    }
    stats {
      totalUpvotes
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
    }
    metadata {
      ...MetadataFields
    }
    mirrorOf {
      ... on Post {
        id
        profile {
          ...MinimalProfileFields
        }
        metadata {
          ...MetadataFields
        }
        reaction(request: $reactionRequest)
        stats {
          totalUpvotes
          totalAmountOfMirrors
          totalAmountOfCollects
          totalAmountOfComments
        }
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        reaction(request: $reactionRequest)
        stats {
          totalUpvotes
          totalAmountOfMirrors
          totalAmountOfCollects
          totalAmountOfComments
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
`

export const CommentFieldsFragment = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...MinimalProfileFields
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
      ...MinimalCollectModuleFields
    }
    stats {
      totalAmountOfComments
      totalAmountOfCollects
      totalAmountOfMirrors
      totalDownvotes
      totalUpvotes
    }
    metadata {
      name
      description
      content
      description
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
        pubId: id
        createdAt
        profile {
          ...MinimalProfileFields
        }
        metadata {
          name
          content
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
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        reaction(request: $reactionRequest)
        metadata {
          name
          content
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
`

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...MinimalProfileFields
        isDefault
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${MinimalProfileFields}
`

export const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
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

export const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfile($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`

export const TX_STATUS_QUERY = gql`
  query HasTxHashBeenIndexed($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
      }
    }
  }
`

export const PUBLICATION_STATUS_QUERY = gql`
  query HasPublicationIndexed($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
    }
  }
`

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
        name
        isFollowedByMe
        attributes {
          key
          value
        }
        bio
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
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
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        followModule {
          __typename
        }
      }
    }
  }
`

export const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...MinimalProfileFields
    }
  }
  ${MinimalProfileFields}
`

export const CollectModuleFields = gql`
  fragment CollectModuleFields on CollectModule {
    ... on FreeCollectModuleSettings {
      type
      contractAddress
      followerOnly
    }
    ... on FeeCollectModuleSettings {
      type
      recipient
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      recipient
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      recipient
      endTimestamp
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      recipient
      endTimestamp
      referralFee
      contractAddress
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
  }
`

export const NOTIFICATION_COUNT_QUERY = gql`
  query NotificationCount($request: NotificationRequest!) {
    notifications(request: $request) {
      pageInfo {
        totalCount
      }
    }
  }
`

// currently showing only new follow
export const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          wallet {
            address
            defaultProfile {
              ...MinimalProfileFields
            }
          }
          createdAt
        }
        ... on NewMentionNotification {
          mentionPublication {
            ... on Post {
              id
              profile {
                ...MinimalProfileFields
              }
              metadata {
                content
              }
            }
            ... on Comment {
              id
              profile {
                ...MinimalProfileFields
              }
              metadata {
                content
              }
            }
          }
          createdAt
        }
        ... on NewCommentNotification {
          profile {
            ...MinimalProfileFields
          }
          comment {
            id
            metadata {
              content
            }
            commentOn {
              ... on Post {
                id
              }
              ... on Comment {
                id
              }
              ... on Mirror {
                id
              }
            }
          }
          createdAt
        }
        ... on NewMirrorNotification {
          profile {
            ...MinimalProfileFields
          }
          publication {
            ... on Post {
              id
              metadata {
                name
                content
                attributes {
                  value
                }
              }
            }
            ... on Comment {
              id
              metadata {
                name
                content
                attributes {
                  value
                }
              }
            }
          }
          createdAt
        }
        ... on NewCollectNotification {
          wallet {
            address
            defaultProfile {
              ...MinimalProfileFields
            }
          }
          collectedPublication {
            ... on Post {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectModuleFields
              }
            }
            ... on Comment {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectModuleFields
              }
            }
          }
          createdAt
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${MinimalProfileFields}
  ${CollectModuleFields}
  ${MetadataFields}
`

export const SEARCH_CHANNELS_QUERY = gql`
  query SearchChannels($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...MinimalProfileFields
        }
      }
    }
  }
  ${MinimalProfileFields}
`

export const PostFieldsFragment = gql`
  fragment PostFields on Post {
    id
    reaction(request: $reactionRequest)
    profile {
      ...MinimalProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...MinimalCollectModuleFields
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
      description
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
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
`

export const EXPLORE_QUERY = gql`
  query Explore(
    $request: ExplorePublicationRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    explorePublications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFieldsFragment}
  ${CommentFieldsFragment}
`

export const FEED_QUERY = gql`
  query HomeFeed(
    $request: TimelineRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    timeline(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostFieldsFragment}
  ${CommentFieldsFragment}
  ${MirrorFieldsFragment}
`

export const PROFILE_FEED_QUERY = gql`
  query ProfileFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFieldsFragment}
  ${CommentFieldsFragment}
  ${MirrorFieldsFragment}
`

export const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFieldsFragment}
`

export const CREATE_POST_TYPED_DATA = gql`
  mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`

export const CREATE_COMMENT_TYPED_DATA = gql`
  mutation CreateCommentTypedData($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

export const CREATE_COLLECT_TYPED_DATA = gql`
  mutation CreateCollectTypedData($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
          pubId
          data
        }
      }
    }
  }
`

export const VIDEO_DETAIL_QUERY = gql`
  query VideoDetails(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFieldsFragment}
`

export const VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY = gql`
  query VideoDetailsWithCollect($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
    }
  }
  ${CollectModuleFields}
`

export const CREATE_UNFOLLOW_TYPED_DATA = gql`
  mutation UnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`

export const CREATE_FOLLOW_TYPED_DATA = gql`
  mutation CreateFollowTypedData($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`

export const CHANNEL_FOLLOW_MODULE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        followModule {
          ... on FeeFollowModuleSettings {
            amount {
              asset {
                name
                symbol
                address
                decimals
              }
              value
            }
            recipient
          }
        }
      }
    }
  }
`

export const CREATE_REPORT_PUBLICATION_MUTATION = gql`
  mutation ReportPublication($request: ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`

export const SET_PROFILE_METADATA_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileMetadataTypedData(
    $request: CreatePublicSetProfileMetadataURIRequest!
  ) {
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
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
          metadata
        }
      }
    }
  }
`

export const MODULES_CURRENCY_QUERY = gql`
  query EnabledCurrencyModules($request: ProfileQueryRequest!) {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
    profiles(request: $request) {
      items {
        followModule {
          __typename
        }
      }
    }
  }
`

export const SET_FOLLOW_MODULE_TYPED_DATA_MUTATION = gql`
  mutation CreateSetFollowModuleTypedData(
    $request: CreateSetFollowModuleRequest!
  ) {
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
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
          followModule
          followModuleInitData
        }
      }
    }
  }
`

export const ALLOWANCE_SETTINGS_QUERY = gql`
  query ApprovedModuleAllowanceAmount(
    $request: ApprovedModuleAllowanceAmountRequest!
  ) {
    approvedModuleAllowanceAmount(request: $request) {
      currency
      module
      allowance
      contractAddress
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

export const GENERATE_ALLOWANCE_QUERY = gql`
  query GenerateModuleCurrencyApprovalData(
    $request: GenerateModuleCurrencyApprovalDataRequest!
  ) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`

export const SEARCH_VIDEOS_QUERY = gql`
  query SearchVideos(
    $request: SearchQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    search(request: $request) {
      ... on PublicationSearchResult {
        items {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
        pageInfo {
          next
          totalCount
        }
      }
    }
  }
  ${PostFieldsFragment}
  ${CommentFieldsFragment}
`

export const OG_VIDEO_DETAIL_QUERY = gql`
  query OGVideoDetails(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
      }
    }
  }
  ${PostFieldsFragment}
`

export const OG_PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
      name
      bio
      stats {
        totalFollowers
        totalPosts
        totalFollowing
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
    }
  }
`

export const ADD_REACTION_MUTATION = gql`
  mutation AddReaction($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`

export const REMOVE_REACTION_MUTATION = gql`
  mutation RemoveReaction($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`
export const SET_PFP_URI_TYPED_DATA = gql`
  mutation SetProfileImageUriTypedData(
    $options: TypedDataOptions
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`
export const BROADCAST_MUTATION = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`
export const HIDE_PUBLICATION = gql`
  mutation ($request: HidePublicationRequest!) {
    hidePublication(request: $request)
  }
`
export const GET_LENSTUBE_STATS = gql`
  query LenstubeStats($request: GlobalProtocolStatsRequest) {
    globalProtocolStats(request: $request) {
      totalProfiles
      totalBurntProfiles
      totalPosts
      totalMirrors
      totalComments
      totalCollects
      totalFollows
      totalRevenue {
        asset {
          name
          symbol
          decimals
          address
        }
        value
      }
    }
  }
`

export const CREATE_MIRROR_TYPED_DATA = gql`
  mutation CreateMirrorTypedData(
    $options: TypedDataOptions
    $request: CreateMirrorRequest!
  ) {
    createMirrorTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          profileIdPointed
          pubIdPointed
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

export const CREATE_BURN_PROFILE_TYPED_DATA = gql`
  mutation CreateBurnProfileTypedData($request: BurnProfileRequest!) {
    createBurnProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`
