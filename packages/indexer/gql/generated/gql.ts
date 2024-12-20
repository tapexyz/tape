/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "fragment AccountManagerPermissions on AccountManagerPermissions {\n  canExecuteTransactions\n  canSetMetadataUri\n  canTransferNative\n  canTransferTokens\n}": types.AccountManagerPermissionsFragmentDoc,
    "fragment AccountFields on Account {\n  address\n  score\n  metadata {\n    bio\n    coverPicture\n    id\n    name\n    picture\n    attributes {\n      ...MetadataAttributeFields\n    }\n  }\n  username {\n    ...UsernameFields\n  }\n  operations {\n    ...LoggedInAccountOperationsFields\n  }\n}": types.AccountFieldsFragmentDoc,
    "fragment AccountMetadataFields on AccountMetadata {\n  bio\n  coverPicture\n  id\n  name\n  picture\n  attributes {\n    ...MetadataAttributeFields\n  }\n}": types.AccountMetadataFieldsFragmentDoc,
    "fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {\n  id\n  isFollowedByMe\n  isFollowingMe\n  isMutedByMe\n  isBlockedByMe\n  hasBlockedMe\n  canBlock\n  canUnblock\n  hasReported\n}": types.LoggedInAccountOperationsFieldsFragmentDoc,
    "fragment AmountFields on Amount {\n  asset {\n    ...AssetFields\n  }\n  value\n}": types.AmountFieldsFragmentDoc,
    "fragment AppFields on App {\n  address\n  defaultFeedAddress\n  graphAddress\n  namespaceAddress\n  sponsorshipAddress\n  treasuryAddress\n  createdAt\n  metadata {\n    description\n    developer\n    logo\n    name\n    platforms\n    privacyPolicy\n    termsOfService\n    url\n  }\n}": types.AppFieldsFragmentDoc,
    "fragment AssetFields on Asset {\n  ... on Erc20 {\n    contract {\n      address\n      chainId\n    }\n    decimals\n    name\n    symbol\n  }\n}": types.AssetFieldsFragmentDoc,
    "fragment BooleanValueFields on BooleanValue {\n  onChain\n  optimistic\n}": types.BooleanValueFieldsFragmentDoc,
    "fragment GroupFields on Group {\n  address\n  timestamp\n  metadata {\n    description\n    icon\n    name\n    id\n  }\n}": types.GroupFieldsFragmentDoc,
    "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}": types.MetadataAttributeFieldsFragmentDoc,
    "fragment NetworkAddressFields on NetworkAddress {\n  address\n  chainId\n}": types.NetworkAddressFieldsFragmentDoc,
    "fragment CommentNotificationFields on CommentNotification {\n  __typename\n  id\n  comment {\n    ...PostFields\n  }\n}": types.CommentNotificationFieldsFragmentDoc,
    "fragment FollowNotificationFields on FollowNotification {\n  __typename\n  id\n  followers {\n    account {\n      ...AccountFields\n    }\n  }\n}": types.FollowNotificationFieldsFragmentDoc,
    "fragment MentionNotificationFields on MentionNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n}": types.MentionNotificationFieldsFragmentDoc,
    "fragment QuoteNotificationFields on QuoteNotification {\n  __typename\n  id\n  quote {\n    ...PostFields\n  }\n}": types.QuoteNotificationFieldsFragmentDoc,
    "fragment ReactionNotificationFields on ReactionNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n  reactions {\n    account {\n      ...AccountFields\n    }\n  }\n}": types.ReactionNotificationFieldsFragmentDoc,
    "fragment RepostNotificationFields on RepostNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n  reposts {\n    account {\n      ...AccountFields\n    }\n    repostedAt\n  }\n}": types.RepostNotificationFieldsFragmentDoc,
    "fragment SimpleCollectActionSettingsFields on SimpleCollectActionSettings {\n  collectLimit\n  collectNft\n  endsAt\n  followerOnly\n  recipient\n  referralFee\n  amount {\n    ...AmountFields\n  }\n  contract {\n    ...NetworkAddressFields\n  }\n  recipients {\n    recipient\n    split\n  }\n}": types.SimpleCollectActionSettingsFieldsFragmentDoc,
    "fragment UnknownActionSettingsFields on UnknownActionSettings {\n  __typename\n}": types.UnknownActionSettingsFieldsFragmentDoc,
    "fragment LoggedInPostOperationsFields on LoggedInPostOperations {\n  id\n  hasBookmarked\n  hasReacted\n  hasReported\n  isNotInterested\n  hasCommented {\n    ...BooleanValueFields\n  }\n  hasQuoted {\n    ...BooleanValueFields\n  }\n  hasReposted {\n    ...BooleanValueFields\n  }\n}": types.LoggedInPostOperationsFieldsFragmentDoc,
    "fragment MediaAudioFields on MediaAudio {\n  artist\n  item\n  cover\n  license\n}": types.MediaAudioFieldsFragmentDoc,
    "fragment MediaFields on AnyMedia {\n  ... on MediaVideo {\n    ...MediaVideoFields\n  }\n  ... on MediaImage {\n    ...MediaImageFields\n  }\n  ... on MediaAudio {\n    ...MediaAudioFields\n  }\n}": types.MediaFieldsFragmentDoc,
    "fragment MediaImageFields on MediaImage {\n  altTag\n  attributes {\n    ...MetadataAttributeFields\n  }\n  item\n  license\n}": types.MediaImageFieldsFragmentDoc,
    "fragment MediaVideoFields on MediaVideo {\n  altTag\n  attributes {\n    ...MetadataAttributeFields\n  }\n  cover\n  duration\n  item\n  license\n}": types.MediaVideoFieldsFragmentDoc,
    "fragment VideoMetadataFields on VideoMetadata {\n  __typename\n  title\n  content\n  tags\n  attributes {\n    ...MetadataAttributeFields\n  }\n  attachments {\n    ...MediaFields\n  }\n  video {\n    ...MediaVideoFields\n  }\n}": types.VideoMetadataFieldsFragmentDoc,
    "fragment PostActionFields on PostAction {\n  ... on SimpleCollectActionSettings {\n    ...SimpleCollectActionSettingsFields\n  }\n  ... on UnknownActionSettings {\n    ...UnknownActionSettingsFields\n  }\n}": types.PostActionFieldsFragmentDoc,
    "fragment PostBaseFields on Post {\n  __typename\n  id\n  isEdited\n  isDeleted\n  timestamp\n  author {\n    ...AccountFields\n  }\n  feed {\n    address\n  }\n  app {\n    ...AppFields\n  }\n  metadata {\n    ...PostMetadataFields\n  }\n  actions {\n    ...PostActionFields\n  }\n  stats {\n    ...PostStatsFields\n  }\n  operations {\n    ...LoggedInPostOperationsFields\n  }\n}": types.PostBaseFieldsFragmentDoc,
    "fragment PostFields on Post {\n  ...PostBaseFields\n  root {\n    ...PostBaseFields\n  }\n  commentOn {\n    ...PostBaseFields\n  }\n  quoteOf {\n    ...PostBaseFields\n  }\n}": types.PostFieldsFragmentDoc,
    "fragment PostMetadataFields on PostMetadata {\n  __typename\n  ... on VideoMetadata {\n    ...VideoMetadataFields\n  }\n}": types.PostMetadataFieldsFragmentDoc,
    "fragment PostStatsFields on PostStats {\n  bookmarks\n  collects\n  comments\n  quotes\n  reactions\n  reposts\n}": types.PostStatsFieldsFragmentDoc,
    "fragment RepostFields on Repost {\n  __typename\n  id\n  author {\n    ...AccountFields\n  }\n  isDeleted\n  timestamp\n  repostOf {\n    ...PostFields\n  }\n}": types.RepostFieldsFragmentDoc,
    "fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {\n  reason\n  raw {\n    chainId\n    data\n    from\n    gasLimit\n    maxFeePerGas\n    maxPriorityFeePerGas\n    nonce\n    to\n    type\n    value\n  }\n}": types.SelfFundedTransactionRequestFieldsFragmentDoc,
    "fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {\n  reason\n  raw {\n    chainId\n    data\n    from\n    gasLimit\n    maxFeePerGas\n    maxPriorityFeePerGas\n    nonce\n    to\n    type\n    value\n    customData {\n      customSignature\n      factoryDeps\n      gasPerPubdata\n      paymasterParams {\n        paymaster\n        paymasterInput\n      }\n    }\n  }\n}": types.SponsoredTransactionRequestFieldsFragmentDoc,
    "fragment UsernameFields on Username {\n  id\n  value\n  namespace {\n    address\n    namespace\n    metadata {\n      description\n      id\n    }\n  }\n  localName\n  linkedTo\n  ownedBy\n  timestamp\n}": types.UsernameFieldsFragmentDoc,
    "mutation CreateAccountWithUsername($request: CreateAccountWithUsernameRequest!) {\n  createAccountWithUsername(request: $request) {\n    ... on CreateAccountResponse {\n      hash\n    }\n    ... on InvalidUsername {\n      invalidUsernameReason: reason\n    }\n    ... on SelfFundedTransactionRequest {\n      selfFundedTransactionRequestReason: reason\n    }\n    ... on SponsoredTransactionRequest {\n      sponsoredTransactionRequestReason: reason\n    }\n    ... on TransactionWillFail {\n      transactionWillFailReason: reason\n    }\n  }\n}": types.CreateAccountWithUsernameDocument,
    "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    ... on AuthenticationTokens {\n      __typename\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ExpiredChallengeError {\n      __typename\n      reason\n    }\n    ... on ForbiddenError {\n      __typename\n      reason\n    }\n    ... on WrongSignerError {\n      __typename\n      reason\n    }\n  }\n}": types.AuthenticateDocument,
    "mutation Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}": types.ChallengeDocument,
    "mutation Refresh($request: RefreshRequest!) {\n  refresh(request: $request) {\n    ... on AuthenticationTokens {\n      __typename\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ForbiddenError {\n      __typename\n      reason\n    }\n  }\n}": types.RefreshDocument,
    "mutation AddReaction($request: AddReactionRequest!) {\n  addReaction(request: $request) {\n    ... on AddReactionResponse {\n      success\n    }\n    ... on AddReactionFailure {\n      reason\n    }\n  }\n}": types.AddReactionDocument,
    "mutation BookmarkPost($request: BookmarkPostRequest!) {\n  bookmarkPost(request: $request)\n}": types.BookmarkPostDocument,
    "mutation CreatePost($request: CreatePostRequest!) {\n  post(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DeletePost($request: DeletePostRequest!) {\n  deletePost(request: $request) {\n    ... on DeletePostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}": types.DeletePostDocument,
    "mutation EditPost($request: EditPostRequest!) {\n  editPost(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}": types.EditPostDocument,
    "mutation ReportPost($request: ReportPostRequest!) {\n  reportPost(request: $request)\n}": types.ReportPostDocument,
    "mutation Repost($request: CreateRepostRequest!) {\n  repost(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}": types.RepostDocument,
    "mutation UndoBookmarkPost($request: BookmarkPostRequest!) {\n  undoBookmarkPost(request: $request)\n}": types.UndoBookmarkPostDocument,
    "mutation UndoReaction($request: UndoReactionRequest!) {\n  undoReaction(request: $request) {\n    ... on UndoReactionResponse {\n      success\n    }\n    ... on UndoReactionFailure {\n      reason\n    }\n  }\n}": types.UndoReactionDocument,
    "query AccountManagers($request: AccountManagersRequest!) {\n  accountManagers(request: $request) {\n    items {\n      manager\n      isLensManager\n      permissions {\n        ...AccountManagerPermissions\n      }\n      addedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountManagersDocument,
    "query AccountStats($request: AccountStatsRequest!) {\n  accountStats(request: $request) {\n    feedStats {\n      posts\n      comments\n      reposts\n      quotes\n      reacted\n      reactions\n      collects\n    }\n    graphFollowStats {\n      followers\n      following\n    }\n  }\n}": types.AccountStatsDocument,
    "query Account($request: AccountRequest!) {\n  account(request: $request) {\n    ...AccountFields\n  }\n}": types.AccountDocument,
    "query AccountsAvailable($request: AccountsAvailableRequest!) {\n  accountsAvailable(request: $request) {\n    items {\n      ... on AccountManaged {\n        __typename\n        account {\n          ...AccountFields\n        }\n        permissions {\n          ...AccountManagerPermissions\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        __typename\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountsAvailableDocument,
    "query AccountsBlocked($request: AccountsBlockedRequest!) {\n  accountsBlocked(request: $request) {\n    items {\n      account {\n        ...AccountFields\n      }\n      blockedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountsBlockedDocument,
    "query Accounts($request: AccountsRequest!) {\n  accounts(request: $request) {\n    items {\n      ...AccountFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountsDocument,
    "query AuthenticatedSessions($request: AuthenticatedSessionsRequest!) {\n  authenticatedSessions(request: $request) {\n    items {\n      authenticationId\n      app\n      browser\n      device\n      os\n      origin\n      signer\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AuthenticatedSessionsDocument,
    "query FollowersYouKnow($request: FollowersYouKnowRequest!) {\n  followersYouKnow(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowersYouKnowDocument,
    "query Followers($request: FollowersRequest!) {\n  followers(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowersDocument,
    "query Following($request: FollowingRequest!) {\n  following(request: $request) {\n    items {\n      following {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowingDocument,
    "query LastLoggedInAccount($request: LastLoggedInAccountRequest!) {\n  lastLoggedInAccount(request: $request) {\n    address\n    owner\n    score\n    metadata {\n      ...AccountMetadataFields\n    }\n    username {\n      ...UsernameFields\n    }\n    operations {\n      ...LoggedInAccountOperationsFields\n    }\n  }\n}": types.LastLoggedInAccountDocument,
    "query Me {\n  me {\n    loggedInAs {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    isSignless\n    isSponsored\n    appLoggedIn\n    limit {\n      window\n      allowanceLeft\n      allowanceUsed\n      allowance\n    }\n  }\n}": types.MeDocument,
    "query Notifications($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on CommentNotification {\n        ...CommentNotificationFields\n      }\n      ... on FollowNotification {\n        ...FollowNotificationFields\n      }\n      ... on MentionNotification {\n        ...MentionNotificationFields\n      }\n      ... on QuoteNotification {\n        ...QuoteNotificationFields\n      }\n      ... on ReactionNotification {\n        ...ReactionNotificationFields\n      }\n      ... on RepostNotification {\n        ...RepostNotificationFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.NotificationsDocument,
    "query Usernames($request: UsernamesRequest!) {\n  usernames(request: $request) {\n    items {\n      ...UsernameFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.UsernamesDocument,
    "query Group($request: GroupRequest!) {\n  group(request: $request) {\n    ...GroupFields\n  }\n}": types.GroupDocument,
    "query PostReferences($request: PostReferencesRequest!) {\n  postReferences(request: $request) {\n    items {\n      ...PostFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.PostReferencesDocument,
    "query Post($request: PostRequest!) {\n  post(request: $request) {\n    ...PostFields\n  }\n}": types.PostDocument,
    "query Posts($request: PostsRequest!) {\n  posts(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Repost {\n        ...RepostFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.PostsDocument,
    "query Search($postsRequest: PostsRequest!, $accountsRequest: AccountsRequest!) {\n  posts(request: $postsRequest) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Repost {\n        ...RepostFields\n      }\n    }\n  }\n  accounts(request: $accountsRequest) {\n    items {\n      ...AccountFields\n    }\n  }\n}": types.SearchDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AccountManagerPermissions on AccountManagerPermissions {\n  canExecuteTransactions\n  canSetMetadataUri\n  canTransferNative\n  canTransferTokens\n}"): typeof import('./graphql').AccountManagerPermissionsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AccountFields on Account {\n  address\n  score\n  metadata {\n    bio\n    coverPicture\n    id\n    name\n    picture\n    attributes {\n      ...MetadataAttributeFields\n    }\n  }\n  username {\n    ...UsernameFields\n  }\n  operations {\n    ...LoggedInAccountOperationsFields\n  }\n}"): typeof import('./graphql').AccountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AccountMetadataFields on AccountMetadata {\n  bio\n  coverPicture\n  id\n  name\n  picture\n  attributes {\n    ...MetadataAttributeFields\n  }\n}"): typeof import('./graphql').AccountMetadataFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {\n  id\n  isFollowedByMe\n  isFollowingMe\n  isMutedByMe\n  isBlockedByMe\n  hasBlockedMe\n  canBlock\n  canUnblock\n  hasReported\n}"): typeof import('./graphql').LoggedInAccountOperationsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AmountFields on Amount {\n  asset {\n    ...AssetFields\n  }\n  value\n}"): typeof import('./graphql').AmountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AppFields on App {\n  address\n  defaultFeedAddress\n  graphAddress\n  namespaceAddress\n  sponsorshipAddress\n  treasuryAddress\n  createdAt\n  metadata {\n    description\n    developer\n    logo\n    name\n    platforms\n    privacyPolicy\n    termsOfService\n    url\n  }\n}"): typeof import('./graphql').AppFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AssetFields on Asset {\n  ... on Erc20 {\n    contract {\n      address\n      chainId\n    }\n    decimals\n    name\n    symbol\n  }\n}"): typeof import('./graphql').AssetFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment BooleanValueFields on BooleanValue {\n  onChain\n  optimistic\n}"): typeof import('./graphql').BooleanValueFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment GroupFields on Group {\n  address\n  timestamp\n  metadata {\n    description\n    icon\n    name\n    id\n  }\n}"): typeof import('./graphql').GroupFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}"): typeof import('./graphql').MetadataAttributeFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment NetworkAddressFields on NetworkAddress {\n  address\n  chainId\n}"): typeof import('./graphql').NetworkAddressFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CommentNotificationFields on CommentNotification {\n  __typename\n  id\n  comment {\n    ...PostFields\n  }\n}"): typeof import('./graphql').CommentNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FollowNotificationFields on FollowNotification {\n  __typename\n  id\n  followers {\n    account {\n      ...AccountFields\n    }\n  }\n}"): typeof import('./graphql').FollowNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MentionNotificationFields on MentionNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n}"): typeof import('./graphql').MentionNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment QuoteNotificationFields on QuoteNotification {\n  __typename\n  id\n  quote {\n    ...PostFields\n  }\n}"): typeof import('./graphql').QuoteNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ReactionNotificationFields on ReactionNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n  reactions {\n    account {\n      ...AccountFields\n    }\n  }\n}"): typeof import('./graphql').ReactionNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RepostNotificationFields on RepostNotification {\n  __typename\n  id\n  post {\n    ...PostFields\n  }\n  reposts {\n    account {\n      ...AccountFields\n    }\n    repostedAt\n  }\n}"): typeof import('./graphql').RepostNotificationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleCollectActionSettingsFields on SimpleCollectActionSettings {\n  collectLimit\n  collectNft\n  endsAt\n  followerOnly\n  recipient\n  referralFee\n  amount {\n    ...AmountFields\n  }\n  contract {\n    ...NetworkAddressFields\n  }\n  recipients {\n    recipient\n    split\n  }\n}"): typeof import('./graphql').SimpleCollectActionSettingsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UnknownActionSettingsFields on UnknownActionSettings {\n  __typename\n}"): typeof import('./graphql').UnknownActionSettingsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LoggedInPostOperationsFields on LoggedInPostOperations {\n  id\n  hasBookmarked\n  hasReacted\n  hasReported\n  isNotInterested\n  hasCommented {\n    ...BooleanValueFields\n  }\n  hasQuoted {\n    ...BooleanValueFields\n  }\n  hasReposted {\n    ...BooleanValueFields\n  }\n}"): typeof import('./graphql').LoggedInPostOperationsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MediaAudioFields on MediaAudio {\n  artist\n  item\n  cover\n  license\n}"): typeof import('./graphql').MediaAudioFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MediaFields on AnyMedia {\n  ... on MediaVideo {\n    ...MediaVideoFields\n  }\n  ... on MediaImage {\n    ...MediaImageFields\n  }\n  ... on MediaAudio {\n    ...MediaAudioFields\n  }\n}"): typeof import('./graphql').MediaFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MediaImageFields on MediaImage {\n  altTag\n  attributes {\n    ...MetadataAttributeFields\n  }\n  item\n  license\n}"): typeof import('./graphql').MediaImageFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MediaVideoFields on MediaVideo {\n  altTag\n  attributes {\n    ...MetadataAttributeFields\n  }\n  cover\n  duration\n  item\n  license\n}"): typeof import('./graphql').MediaVideoFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment VideoMetadataFields on VideoMetadata {\n  __typename\n  title\n  content\n  tags\n  attributes {\n    ...MetadataAttributeFields\n  }\n  attachments {\n    ...MediaFields\n  }\n  video {\n    ...MediaVideoFields\n  }\n}"): typeof import('./graphql').VideoMetadataFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostActionFields on PostAction {\n  ... on SimpleCollectActionSettings {\n    ...SimpleCollectActionSettingsFields\n  }\n  ... on UnknownActionSettings {\n    ...UnknownActionSettingsFields\n  }\n}"): typeof import('./graphql').PostActionFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostBaseFields on Post {\n  __typename\n  id\n  isEdited\n  isDeleted\n  timestamp\n  author {\n    ...AccountFields\n  }\n  feed {\n    address\n  }\n  app {\n    ...AppFields\n  }\n  metadata {\n    ...PostMetadataFields\n  }\n  actions {\n    ...PostActionFields\n  }\n  stats {\n    ...PostStatsFields\n  }\n  operations {\n    ...LoggedInPostOperationsFields\n  }\n}"): typeof import('./graphql').PostBaseFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostFields on Post {\n  ...PostBaseFields\n  root {\n    ...PostBaseFields\n  }\n  commentOn {\n    ...PostBaseFields\n  }\n  quoteOf {\n    ...PostBaseFields\n  }\n}"): typeof import('./graphql').PostFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostMetadataFields on PostMetadata {\n  __typename\n  ... on VideoMetadata {\n    ...VideoMetadataFields\n  }\n}"): typeof import('./graphql').PostMetadataFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostStatsFields on PostStats {\n  bookmarks\n  collects\n  comments\n  quotes\n  reactions\n  reposts\n}"): typeof import('./graphql').PostStatsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RepostFields on Repost {\n  __typename\n  id\n  author {\n    ...AccountFields\n  }\n  isDeleted\n  timestamp\n  repostOf {\n    ...PostFields\n  }\n}"): typeof import('./graphql').RepostFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {\n  reason\n  raw {\n    chainId\n    data\n    from\n    gasLimit\n    maxFeePerGas\n    maxPriorityFeePerGas\n    nonce\n    to\n    type\n    value\n  }\n}"): typeof import('./graphql').SelfFundedTransactionRequestFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {\n  reason\n  raw {\n    chainId\n    data\n    from\n    gasLimit\n    maxFeePerGas\n    maxPriorityFeePerGas\n    nonce\n    to\n    type\n    value\n    customData {\n      customSignature\n      factoryDeps\n      gasPerPubdata\n      paymasterParams {\n        paymaster\n        paymasterInput\n      }\n    }\n  }\n}"): typeof import('./graphql').SponsoredTransactionRequestFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UsernameFields on Username {\n  id\n  value\n  namespace {\n    address\n    namespace\n    metadata {\n      description\n      id\n    }\n  }\n  localName\n  linkedTo\n  ownedBy\n  timestamp\n}"): typeof import('./graphql').UsernameFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateAccountWithUsername($request: CreateAccountWithUsernameRequest!) {\n  createAccountWithUsername(request: $request) {\n    ... on CreateAccountResponse {\n      hash\n    }\n    ... on InvalidUsername {\n      invalidUsernameReason: reason\n    }\n    ... on SelfFundedTransactionRequest {\n      selfFundedTransactionRequestReason: reason\n    }\n    ... on SponsoredTransactionRequest {\n      sponsoredTransactionRequestReason: reason\n    }\n    ... on TransactionWillFail {\n      transactionWillFailReason: reason\n    }\n  }\n}"): typeof import('./graphql').CreateAccountWithUsernameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    ... on AuthenticationTokens {\n      __typename\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ExpiredChallengeError {\n      __typename\n      reason\n    }\n    ... on ForbiddenError {\n      __typename\n      reason\n    }\n    ... on WrongSignerError {\n      __typename\n      reason\n    }\n  }\n}"): typeof import('./graphql').AuthenticateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}"): typeof import('./graphql').ChallengeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Refresh($request: RefreshRequest!) {\n  refresh(request: $request) {\n    ... on AuthenticationTokens {\n      __typename\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ForbiddenError {\n      __typename\n      reason\n    }\n  }\n}"): typeof import('./graphql').RefreshDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddReaction($request: AddReactionRequest!) {\n  addReaction(request: $request) {\n    ... on AddReactionResponse {\n      success\n    }\n    ... on AddReactionFailure {\n      reason\n    }\n  }\n}"): typeof import('./graphql').AddReactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation BookmarkPost($request: BookmarkPostRequest!) {\n  bookmarkPost(request: $request)\n}"): typeof import('./graphql').BookmarkPostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($request: CreatePostRequest!) {\n  post(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreatePostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePost($request: DeletePostRequest!) {\n  deletePost(request: $request) {\n    ... on DeletePostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}"): typeof import('./graphql').DeletePostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation EditPost($request: EditPostRequest!) {\n  editPost(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}"): typeof import('./graphql').EditPostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ReportPost($request: ReportPostRequest!) {\n  reportPost(request: $request)\n}"): typeof import('./graphql').ReportPostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Repost($request: CreateRepostRequest!) {\n  repost(request: $request) {\n    ... on PostResponse {\n      hash\n    }\n    ... on SelfFundedTransactionRequest {\n      ...SelfFundedTransactionRequestFields\n    }\n    ... on SponsoredTransactionRequest {\n      ...SponsoredTransactionRequestFields\n    }\n    ... on TransactionWillFail {\n      reason\n    }\n  }\n}"): typeof import('./graphql').RepostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UndoBookmarkPost($request: BookmarkPostRequest!) {\n  undoBookmarkPost(request: $request)\n}"): typeof import('./graphql').UndoBookmarkPostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UndoReaction($request: UndoReactionRequest!) {\n  undoReaction(request: $request) {\n    ... on UndoReactionResponse {\n      success\n    }\n    ... on UndoReactionFailure {\n      reason\n    }\n  }\n}"): typeof import('./graphql').UndoReactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AccountManagers($request: AccountManagersRequest!) {\n  accountManagers(request: $request) {\n    items {\n      manager\n      isLensManager\n      permissions {\n        ...AccountManagerPermissions\n      }\n      addedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountManagersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AccountStats($request: AccountStatsRequest!) {\n  accountStats(request: $request) {\n    feedStats {\n      posts\n      comments\n      reposts\n      quotes\n      reacted\n      reactions\n      collects\n    }\n    graphFollowStats {\n      followers\n      following\n    }\n  }\n}"): typeof import('./graphql').AccountStatsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Account($request: AccountRequest!) {\n  account(request: $request) {\n    ...AccountFields\n  }\n}"): typeof import('./graphql').AccountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AccountsAvailable($request: AccountsAvailableRequest!) {\n  accountsAvailable(request: $request) {\n    items {\n      ... on AccountManaged {\n        __typename\n        account {\n          ...AccountFields\n        }\n        permissions {\n          ...AccountManagerPermissions\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        __typename\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountsAvailableDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AccountsBlocked($request: AccountsBlockedRequest!) {\n  accountsBlocked(request: $request) {\n    items {\n      account {\n        ...AccountFields\n      }\n      blockedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountsBlockedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Accounts($request: AccountsRequest!) {\n  accounts(request: $request) {\n    items {\n      ...AccountFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AuthenticatedSessions($request: AuthenticatedSessionsRequest!) {\n  authenticatedSessions(request: $request) {\n    items {\n      authenticationId\n      app\n      browser\n      device\n      os\n      origin\n      signer\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AuthenticatedSessionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FollowersYouKnow($request: FollowersYouKnowRequest!) {\n  followersYouKnow(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FollowersYouKnowDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Followers($request: FollowersRequest!) {\n  followers(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FollowersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Following($request: FollowingRequest!) {\n  following(request: $request) {\n    items {\n      following {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FollowingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query LastLoggedInAccount($request: LastLoggedInAccountRequest!) {\n  lastLoggedInAccount(request: $request) {\n    address\n    owner\n    score\n    metadata {\n      ...AccountMetadataFields\n    }\n    username {\n      ...UsernameFields\n    }\n    operations {\n      ...LoggedInAccountOperationsFields\n    }\n  }\n}"): typeof import('./graphql').LastLoggedInAccountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    loggedInAs {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    isSignless\n    isSponsored\n    appLoggedIn\n    limit {\n      window\n      allowanceLeft\n      allowanceUsed\n      allowance\n    }\n  }\n}"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Notifications($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on CommentNotification {\n        ...CommentNotificationFields\n      }\n      ... on FollowNotification {\n        ...FollowNotificationFields\n      }\n      ... on MentionNotification {\n        ...MentionNotificationFields\n      }\n      ... on QuoteNotification {\n        ...QuoteNotificationFields\n      }\n      ... on ReactionNotification {\n        ...ReactionNotificationFields\n      }\n      ... on RepostNotification {\n        ...RepostNotificationFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').NotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Usernames($request: UsernamesRequest!) {\n  usernames(request: $request) {\n    items {\n      ...UsernameFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').UsernamesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Group($request: GroupRequest!) {\n  group(request: $request) {\n    ...GroupFields\n  }\n}"): typeof import('./graphql').GroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PostReferences($request: PostReferencesRequest!) {\n  postReferences(request: $request) {\n    items {\n      ...PostFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').PostReferencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($request: PostRequest!) {\n  post(request: $request) {\n    ...PostFields\n  }\n}"): typeof import('./graphql').PostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Posts($request: PostsRequest!) {\n  posts(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Repost {\n        ...RepostFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').PostsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Search($postsRequest: PostsRequest!, $accountsRequest: AccountsRequest!) {\n  posts(request: $postsRequest) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Repost {\n        ...RepostFields\n      }\n    }\n  }\n  accounts(request: $accountsRequest) {\n    items {\n      ...AccountFields\n    }\n  }\n}"): typeof import('./graphql').SearchDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
