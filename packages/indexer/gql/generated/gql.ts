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
    "fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {\n  id\n  isFollowedByMe\n  isFollowingMe\n  canFollow\n  canUnfollow\n  isMutedByMe\n  isBlockedByMe\n  hasBlockedMe\n  canBlock\n  canUnblock\n  hasReported\n}": types.LoggedInAccountOperationsFieldsFragmentDoc,
    "fragment GroupFields on Group {\n  address\n  timestamp\n  metadata {\n    description\n    icon\n    name\n    slug\n    id\n  }\n}": types.GroupFieldsFragmentDoc,
    "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}": types.MetadataAttributeFieldsFragmentDoc,
    "fragment UsernameFields on Username {\n  id\n  value\n  namespace {\n    address\n    namespace\n    metadata {\n      description\n      id\n    }\n  }\n  localName\n  linkedTo\n  ownedBy\n  timestamp\n}": types.UsernameFieldsFragmentDoc,
    "mutation CreateAccountWithUsername($request: CreateAccountWithUsernameRequest!) {\n  createAccountWithUsername(request: $request) {\n    ... on CreateAccountResponse {\n      hash\n    }\n    ... on InvalidUsername {\n      invalidUsernameReason: reason\n    }\n    ... on SelfFundedTransactionRequest {\n      selfFundedTransactionRequestReason: reason\n    }\n    ... on SponsoredTransactionRequest {\n      sponsoredTransactionRequestReason: reason\n    }\n    ... on TransactionWillFail {\n      transactionWillFailReason: reason\n    }\n  }\n}": types.CreateAccountWithUsernameDocument,
    "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    ... on AuthenticationTokens {\n      accessToken\n      refreshToken\n      idToken\n    }\n  }\n}": types.AuthenticateDocument,
    "mutation Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}": types.ChallengeDocument,
    "mutation Refresh($request: RefreshRequest!) {\n  refresh(request: $request) {\n    ... on AuthenticationTokens {\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ForbiddenError {\n      reason\n    }\n  }\n}": types.RefreshDocument,
    "query AccountManagers($request: AccountManagersRequest!) {\n  accountManagers(request: $request) {\n    items {\n      manager\n      isLensManager\n      permissions {\n        ...AccountManagerPermissions\n      }\n      addedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountManagersDocument,
    "query AccountStats($request: AccountStatsRequest!) {\n  accountStats(request: $request) {\n    feedStats {\n      posts\n      comments\n      reposts\n      quotes\n      reacted\n      reactions\n      collects\n    }\n    graphFollowStats {\n      followers\n      following\n    }\n  }\n}": types.AccountStatsDocument,
    "query Account($request: AccountRequest!) {\n  account(request: $request) {\n    ...AccountFields\n  }\n}": types.AccountDocument,
    "query AccountsAvailable($request: AccountsAvailableRequest!) {\n  accountsAvailable(request: $request) {\n    items {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        permissions {\n          ...AccountManagerPermissions\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountsAvailableDocument,
    "query AccountsBlocked($request: AccountsBlockedRequest!) {\n  accountsBlocked(request: $request) {\n    items {\n      account {\n        ...AccountFields\n      }\n      blockedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AccountsBlockedDocument,
    "query Accounts($request: AccountsRequest!) {\n  accounts(request: $request) {\n    ...AccountFields\n  }\n}": types.AccountsDocument,
    "query AuthenticatedSessions($request: AuthenticatedSessionsRequest!) {\n  authenticatedSessions(request: $request) {\n    items {\n      authenticationId\n      app\n      browser\n      device\n      os\n      origin\n      signer\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.AuthenticatedSessionsDocument,
    "query FollowersYouKnow($request: FollowersYouKnowRequest!) {\n  followersYouKnow(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowersYouKnowDocument,
    "query Followers($request: FollowersRequest!) {\n  followers(request: $request) {\n    items {\n      follower {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowersDocument,
    "query Following($request: FollowingRequest!) {\n  following(request: $request) {\n    items {\n      following {\n        ...AccountFields\n      }\n      followedOn\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowingDocument,
    "query LastLoggedInAccount($request: LastLoggedInAccountRequest!) {\n  lastLoggedInAccount(request: $request) {\n    address\n    owner\n    score\n    metadata {\n      ...AccountMetadataFields\n    }\n    username {\n      ...UsernameFields\n    }\n    operations {\n      ...LoggedInAccountOperationsFields\n    }\n  }\n}": types.LastLoggedInAccountDocument,
    "query Me {\n  me {\n    account {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    isSignless\n    isSponsored\n    appLoggedIn\n    limit {\n      window\n      allowanceLeft\n      allowanceUsed\n      allowance\n    }\n  }\n}": types.MeDocument,
    "query Usernames($request: UsernamesRequest!) {\n  usernames(request: $request) {\n    items {\n      ...UsernameFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.UsernamesDocument,
    "query Feed($request: FeedRequest!) {\n  feed(request: $request) {\n    address\n  }\n}": types.FeedDocument,
    "query Group($request: GroupRequest!) {\n  group(request: $request) {\n    ...GroupFields\n  }\n}": types.GroupDocument,
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
export function graphql(source: "fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {\n  id\n  isFollowedByMe\n  isFollowingMe\n  canFollow\n  canUnfollow\n  isMutedByMe\n  isBlockedByMe\n  hasBlockedMe\n  canBlock\n  canUnblock\n  hasReported\n}"): typeof import('./graphql').LoggedInAccountOperationsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment GroupFields on Group {\n  address\n  timestamp\n  metadata {\n    description\n    icon\n    name\n    slug\n    id\n  }\n}"): typeof import('./graphql').GroupFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}"): typeof import('./graphql').MetadataAttributeFieldsFragmentDoc;
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
export function graphql(source: "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    ... on AuthenticationTokens {\n      accessToken\n      refreshToken\n      idToken\n    }\n  }\n}"): typeof import('./graphql').AuthenticateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}"): typeof import('./graphql').ChallengeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Refresh($request: RefreshRequest!) {\n  refresh(request: $request) {\n    ... on AuthenticationTokens {\n      accessToken\n      refreshToken\n      idToken\n    }\n    ... on ForbiddenError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').RefreshDocument;
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
export function graphql(source: "query AccountsAvailable($request: AccountsAvailableRequest!) {\n  accountsAvailable(request: $request) {\n    items {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        permissions {\n          ...AccountManagerPermissions\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountsAvailableDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AccountsBlocked($request: AccountsBlockedRequest!) {\n  accountsBlocked(request: $request) {\n    items {\n      account {\n        ...AccountFields\n      }\n      blockedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').AccountsBlockedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Accounts($request: AccountsRequest!) {\n  accounts(request: $request) {\n    ...AccountFields\n  }\n}"): typeof import('./graphql').AccountsDocument;
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
export function graphql(source: "query Me {\n  me {\n    account {\n      ... on AccountManaged {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n      ... on AccountOwned {\n        account {\n          ...AccountFields\n        }\n        addedAt\n      }\n    }\n    isSignless\n    isSponsored\n    appLoggedIn\n    limit {\n      window\n      allowanceLeft\n      allowanceUsed\n      allowance\n    }\n  }\n}"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Usernames($request: UsernamesRequest!) {\n  usernames(request: $request) {\n    items {\n      ...UsernameFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').UsernamesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Feed($request: FeedRequest!) {\n  feed(request: $request) {\n    address\n  }\n}"): typeof import('./graphql').FeedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Group($request: GroupRequest!) {\n  group(request: $request) {\n    ...GroupFields\n  }\n}"): typeof import('./graphql').GroupDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
