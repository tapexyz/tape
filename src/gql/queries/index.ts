import { gql } from '@apollo/client'

import { CollectFields } from './fragments/CollectFields'
import { CommentFields } from './fragments/CommentFields'
import { MetadataFields } from './fragments/MetadataFields'
import { MirrorFields } from './fragments/MirrorFields'
import { PostFields } from './fragments/PostFields'
import { ProfileFields } from './fragments/ProfileFields'

export const PING_QUERY = gql`
  query Ping {
    ping
  }
`

export const PROFILES_QUERY = gql`
  query allProfiles($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
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
        txReceipt {
          transactionHash
        }
      }
      ... on TransactionError {
        reason
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
        dispatcher {
          canUseRelay
        }
        isFollowedByMe
        onChainIdentity {
          proofOfHumanity
          worldcoin {
            isHuman
          }
          sybilDotOrg {
            verified
            source {
              twitter {
                handle
              }
            }
          }
          ens {
            name
          }
        }
        attributes {
          key
          value
        }
        bio
        stats {
          totalFollowers
          totalPosts
          totalComments
          totalMirrors
          totalCollects
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
      pageInfo {
        totalCount
        next
      }
    }
  }
`

export const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...ProfileFields
    }
  }
  ${ProfileFields}
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

export const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          notificationId
          wallet {
            address
            defaultProfile {
              ...ProfileFields
            }
          }
          createdAt
        }
        ... on NewMentionNotification {
          notificationId
          mentionPublication {
            ... on Post {
              id
              profile {
                ...ProfileFields
              }
              metadata {
                content
              }
            }
            ... on Comment {
              id
              profile {
                ...ProfileFields
              }
              metadata {
                content
              }
            }
          }
          createdAt
        }
        ... on NewCommentNotification {
          notificationId
          profile {
            ...ProfileFields
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
          notificationId
          profile {
            ...ProfileFields
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
          notificationId
          wallet {
            address
            defaultProfile {
              ...ProfileFields
            }
          }
          collectedPublication {
            ... on Post {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectFields
              }
            }
            ... on Comment {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectFields
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
  ${ProfileFields}
  ${CollectFields}
  ${MetadataFields}
`

export const SEARCH_CHANNELS_QUERY = gql`
  query SearchChannels($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...ProfileFields
        }
      }
    }
  }
  ${ProfileFields}
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
  ${PostFields}
  ${CommentFields}
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
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
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
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
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
  ${CommentFields}
`

export const VIDEO_DETAIL_QUERY = gql`
  query VideoDetails(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
      }
    }
  }
  ${PostFields}
`

export const VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY = gql`
  query VideoDetailsWithCollect($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        collectNftAddress
        collectModule {
          ...CollectFields
        }
      }
    }
  }
  ${CollectFields}
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
  ${PostFields}
  ${CommentFields}
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

export const BROADCAST_MUTATION = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txId
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
    bytesStats: globalProtocolStats(request: { sources: "lenstube-bytes" }) {
      totalPosts
    }
  }
`

export const VIDEO_COLLECTORS_QUERY = gql`
  query VideoCollectors($request: WhoCollectedPublicationRequest!) {
    whoCollectedPublication(request: $request) {
      items {
        address
        defaultProfile {
          ...ProfileFields
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFields}
`

export const CHANNEL_SUBSCRIBERS_QUERY = gql`
  query Subscribers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            ...ProfileFields
          }
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFields}
`

export const COLLECTED_NFTS_QUERY = gql`
  query Nfts($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        contractAddress
        tokenId
        name
        originalContent {
          animatedUrl
          uri
          metaType
        }
        collectionName
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
`

export const PUBLICATION_REVENUE_QUERY = gql`
  query PublicationRevenue($request: PublicationRevenueQueryRequest!) {
    publicationRevenue(request: $request) {
      revenue {
        total {
          value
        }
      }
    }
  }
`
export const MUTUAL_SUBSCRIBERS_QUERY = gql`
  query MutualSubscribers($request: MutualFollowersProfilesQueryRequest!) {
    mutualFollowersProfiles(request: $request) {
      items {
        ...ProfileFields
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${ProfileFields}
`
