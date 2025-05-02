/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AccessToken: { input: any; output: any; }
  AlwaysTrue: { input: any; output: any; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  BlockchainData: { input: any; output: any; }
  ChainId: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  EvmAddress: { input: any; output: any; }
  FixedBytes32: { input: any; output: any; }
  GeneratedNotificationId: { input: any; output: any; }
  GeoUri: { input: any; output: any; }
  GrantId: { input: any; output: any; }
  IdToken: { input: any; output: any; }
  /** A scalar that can represent any JSON value. */
  JSON: { input: any; output: any; }
  JsonString: { input: any; output: any; }
  LegacyProfileId: { input: any; output: any; }
  LegacyPublicationId: { input: any; output: any; }
  LegacyRefreshToken: { input: any; output: any; }
  Locale: { input: any; output: any; }
  MarketplaceMetadataAttributeValue: { input: any; output: any; }
  MetadataId: { input: any; output: any; }
  PostId: { input: any; output: any; }
  RefreshToken: { input: any; output: any; }
  RuleId: { input: any; output: any; }
  ServerAPIKey: { input: any; output: any; }
  Signature: { input: any; output: any; }
  Tag: { input: any; output: any; }
  TxHash: { input: any; output: any; }
  URI: { input: any; output: any; }
  URL: { input: any; output: any; }
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
   * Strings within GraphQL. UUIDs are used to assign unique identifiers to
   * entities without requiring a central allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: { input: any; output: any; }
  UsernameValue: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export type AccessControlRequest = {
  /** The access control address */
  address: Scalars['EvmAddress']['input'];
};

export type AccessControlResult = {
  __typename?: 'AccessControlResult';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
};

export type Account = {
  __typename?: 'Account';
  actions: Array<AccountAction>;
  address: Scalars['EvmAddress']['output'];
  /**
   * The account created at. Note if they are using a standard EOA this will be genesis block
   * timestamp
   */
  createdAt: Scalars['DateTime']['output'];
  /** The metadata of the account. */
  metadata?: Maybe<AccountMetadata>;
  /** The operations for the account. */
  operations?: Maybe<LoggedInAccountOperations>;
  /**
   * The owner of the account - note if the Account is not a lens account this will return the
   * address of the account itself.
   */
  owner: Scalars['EvmAddress']['output'];
  /** Get the rules for the account. */
  rules: AccountFollowRules;
  /** The score of the account. */
  score: Scalars['Int']['output'];
  /** The username linked to the account. */
  username?: Maybe<Username>;
};


export type AccountUsernameArgs = {
  request?: AccountUsernameOneOf;
};

/**
 * The configured actions for an account. All accounts have the TippingAccountAction enabled by
 * default which is not listed here.
 */
export type AccountAction = TippingAccountAction | UnknownAccountAction;

export type AccountActionConfigInput = {
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type AccountActionExecuteInput = {
  tipping?: InputMaybe<TippingAmountInput>;
  unknown?: InputMaybe<UnknownActionExecuteInput>;
};

export type AccountActionExecuted = TippingAccountActionExecuted | UnknownAccountActionExecuted;

export type AccountActionExecutedNotification = {
  __typename?: 'AccountActionExecutedNotification';
  actions: Array<AccountActionExecuted>;
  id: Scalars['GeneratedNotificationId']['output'];
};

export type AccountActionExecutedNotificationAttributes = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  action?: InputMaybe<Scalars['EvmAddress']['input']>;
  actionType?: InputMaybe<AccountActionType>;
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  executingAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountActionFilter = {
  address?: InputMaybe<Scalars['EvmAddress']['input']>;
  tipping?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export enum AccountActionType {
  Tipping = 'TIPPING',
  Unknown = 'UNKNOWN'
}

export type AccountAvailable = AccountManaged | AccountOwned;

export type AccountBalancesRequest = {
  /** Whether to include the native token balance. */
  includeNative?: Scalars['Boolean']['input'];
  /** The ERC-20 token addresses to get balances for. */
  tokens?: Array<Scalars['EvmAddress']['input']>;
};

export type AccountBlocked = {
  __typename?: 'AccountBlocked';
  account: Account;
  blockedAt: Scalars['DateTime']['output'];
};

export type AccountBlockedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountBlockedResponse = {
  __typename?: 'AccountBlockedResponse';
  hash: Scalars['TxHash']['output'];
};

export type AccountCreatedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountExecutedActions = {
  __typename?: 'AccountExecutedActions';
  account: Account;
  firstAt: Scalars['DateTime']['output'];
  lastAt: Scalars['DateTime']['output'];
  total: Scalars['Int']['output'];
};

export type AccountFeedsStats = {
  __typename?: 'AccountFeedsStats';
  /** The total number of collects. */
  collects: Scalars['Int']['output'];
  /** The total number of comments. */
  comments: Scalars['Int']['output'];
  /** The total number of posts. */
  posts: Scalars['Int']['output'];
  /** The total number of quotes. */
  quotes: Scalars['Int']['output'];
  /** The total number of times the account has reacted. */
  reacted: Scalars['Int']['output'];
  /** The total number of reactions. */
  reactions: Scalars['Int']['output'];
  /** The total number of reposts. */
  reposts: Scalars['Int']['output'];
  /** The total number of tips received. */
  tips: Scalars['Int']['output'];
};

export type AccountFeedsStatsFilter = {
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
};

export type AccountFeedsStatsRequest = {
  /** The account to get stats for. */
  account: Scalars['EvmAddress']['input'];
  /** An optional filter to apply to the result. */
  filter?: InputMaybe<AccountFeedsStatsFilter>;
};

export type AccountFollowOperationValidationFailed = {
  __typename?: 'AccountFollowOperationValidationFailed';
  reason: Scalars['String']['output'];
  unsatisfiedRules?: Maybe<AccountFollowUnsatisfiedRules>;
};

export type AccountFollowOperationValidationOutcome = AccountFollowOperationValidationFailed | AccountFollowOperationValidationPassed | AccountFollowOperationValidationUnknown;

export type AccountFollowOperationValidationPassed = {
  __typename?: 'AccountFollowOperationValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type AccountFollowOperationValidationRule = AccountFollowRule | GraphRule;

export type AccountFollowOperationValidationUnknown = {
  __typename?: 'AccountFollowOperationValidationUnknown';
  extraChecksRequired: Array<AccountFollowOperationValidationRule>;
};

export type AccountFollowRule = {
  __typename?: 'AccountFollowRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  id: Scalars['RuleId']['output'];
  type: AccountFollowRuleType;
};

export type AccountFollowRuleConfig = {
  simplePaymentRule?: InputMaybe<SimplePaymentFollowRuleConfig>;
  tokenGatedRule?: InputMaybe<TokenGatedFollowRuleConfig>;
  unknownRule?: InputMaybe<UnknownAccountRuleConfig>;
};

export enum AccountFollowRuleType {
  SimplePayment = 'SIMPLE_PAYMENT',
  TokenGated = 'TOKEN_GATED',
  Unknown = 'UNKNOWN'
}

export enum AccountFollowRuleUnsatisfiedReason {
  FollowSimplePaymentNotEnoughBalance = 'FOLLOW_SIMPLE_PAYMENT_NOT_ENOUGH_BALANCE',
  FollowTokenGatedNotATokenHolder = 'FOLLOW_TOKEN_GATED_NOT_A_TOKEN_HOLDER',
  GraphAccountBlocked = 'GRAPH_ACCOUNT_BLOCKED',
  GraphGroupGatedNotAMember = 'GRAPH_GROUP_GATED_NOT_A_MEMBER',
  GraphTokenGatedNotATokenHolder = 'GRAPH_TOKEN_GATED_NOT_A_TOKEN_HOLDER'
}

export type AccountFollowRules = {
  __typename?: 'AccountFollowRules';
  anyOf: Array<AccountFollowRule>;
  required: Array<AccountFollowRule>;
};

export type AccountFollowRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type AccountFollowUnsatisfiedRule = {
  __typename?: 'AccountFollowUnsatisfiedRule';
  config: Array<AnyKeyValue>;
  message: Scalars['String']['output'];
  reason: AccountFollowRuleUnsatisfiedReason;
  rule: Scalars['EvmAddress']['output'];
};

export type AccountFollowUnsatisfiedRules = {
  __typename?: 'AccountFollowUnsatisfiedRules';
  anyOf: Array<AccountFollowUnsatisfiedRule>;
  required: Array<AccountFollowUnsatisfiedRule>;
};

export type AccountFollowedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  followedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  follower?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountGraphsFollowStats = {
  __typename?: 'AccountGraphsFollowStats';
  /** The total number of followers. */
  followers: Scalars['Int']['output'];
  /** The total number of following. */
  following: Scalars['Int']['output'];
};

export type AccountGraphsStatsFilter = {
  /** The graphs to filter by. */
  graphs?: InputMaybe<Array<GraphOneOf>>;
};

export type AccountGraphsStatsRequest = {
  /** The account to get stats for. */
  account: Scalars['EvmAddress']['input'];
  /** An optional filter to apply to the result. */
  filter?: InputMaybe<AccountGraphsStatsFilter>;
};

export type AccountManaged = {
  __typename?: 'AccountManaged';
  /** The account you are managing. */
  account: Account;
  /** The date the account management was added. */
  addedAt: Scalars['DateTime']['output'];
  /** The permissions you have on the account. */
  permissions: AccountManagerPermissions;
};

export type AccountManager = {
  __typename?: 'AccountManager';
  /** The date the account manager was added. */
  addedAt: Scalars['DateTime']['output'];
  /** Whether the account manager is a Lens manager. */
  isLensManager: Scalars['Boolean']['output'];
  /** The address of the account manager. */
  manager: Scalars['EvmAddress']['output'];
  /** The permissions the account manager has. */
  permissions: AccountManagerPermissions;
};

export type AccountManagerAddedNotificationAttributes = {
  managedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  manager?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountManagerChallengeRequest = {
  /** The address of the Lens Account. */
  account: Scalars['EvmAddress']['input'];
  /**
   * The App you intend to authenticate with.
   *
   * It MUST be a valid App address.
   * Note: On the testnet, it will default to the playground app.
   * This is to make it easier if you forget to set it. This may change in the future.
   */
  app?: Scalars['EvmAddress']['input'];
  /** The address of the Account Manager. */
  manager: Scalars['EvmAddress']['input'];
};

export type AccountManagerPermissions = {
  __typename?: 'AccountManagerPermissions';
  /** Whether the account can execute transactions. */
  canExecuteTransactions: Scalars['Boolean']['output'];
  /** Whether the account can set the metadata URI. */
  canSetMetadataUri: Scalars['Boolean']['output'];
  /** Whether the account can transfer native tokens. */
  canTransferNative: Scalars['Boolean']['output'];
  /** Whether the account can transfer tokens. */
  canTransferTokens: Scalars['Boolean']['output'];
};

export type AccountManagerPermissionsInput = {
  /** Whether the account can execute transactions. */
  canExecuteTransactions: Scalars['Boolean']['input'];
  /** Whether the account can set the metadata URI. */
  canSetMetadataUri: Scalars['Boolean']['input'];
  /** Whether the account can transfer native tokens. */
  canTransferNative: Scalars['Boolean']['input'];
  /** Whether the account can transfer tokens. */
  canTransferTokens: Scalars['Boolean']['input'];
};

export type AccountManagerRemovedNotificationAttributes = {
  managedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  manager?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountManagerUpdatedNotificationAttributes = {
  managedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  manager?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountManagersRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
};

export type AccountMention = {
  __typename?: 'AccountMention';
  /** The account that was mentioned. */
  account: Scalars['EvmAddress']['output'];
  /** The namespace that was used in a mention. */
  namespace: Scalars['EvmAddress']['output'];
  /**
   * The replacement information.
   * Use to replace mentions in the post content.
   */
  replace: MentionReplace;
};

export type AccountMentionedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  author?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  mentionedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  mentionedUsername?: InputMaybe<Scalars['UsernameValue']['input']>;
};

export type AccountMetadata = {
  __typename?: 'AccountMetadata';
  attributes: Array<MetadataAttribute>;
  /** The Account bio as markdown. */
  bio?: Maybe<Scalars['String']['output']>;
  coverPicture?: Maybe<Scalars['URI']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** The Account display name. */
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['URI']['output']>;
};


export type AccountMetadataCoverPictureArgs = {
  request?: MediaImageRequest;
};


export type AccountMetadataPictureArgs = {
  request?: MediaImageRequest;
};

export type AccountOwned = {
  __typename?: 'AccountOwned';
  /** The account you own. */
  account: Account;
  /** The date the account was created. */
  addedAt: Scalars['DateTime']['output'];
};

export type AccountOwnerChallengeRequest = {
  /** The address of the Lens Account. */
  account: Scalars['EvmAddress']['input'];
  /**
   * The App you intend to authenticate with.
   *
   * It MUST be a valid App address.
   * Note: On the testnet, it will default to the playground app.
   * This is to make it easier if you forget to set it. This may change in the future.
   */
  app?: Scalars['EvmAddress']['input'];
  /** The address of the Account Owner. */
  owner: Scalars['EvmAddress']['input'];
};

export type AccountOwnershipTransferredNotificationAttributes = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountPostReaction = {
  __typename?: 'AccountPostReaction';
  account: Account;
  reactions: Array<PostReaction>;
};

export type AccountRecommendationsRequest = {
  /** The account to get recommendations for. */
  account: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
  /** Shuffle the recommendations. */
  shuffle?: Scalars['Boolean']['input'];
};

export enum AccountReportReason {
  Impersonation = 'IMPERSONATION',
  Other = 'OTHER',
  RepetitiveSpam = 'REPETITIVE_SPAM'
}

export type AccountReportedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  reportedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  reporter?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountRequest = {
  /** The account address. */
  address?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The legacy profile ID. */
  legacyProfileId?: InputMaybe<Scalars['LegacyProfileId']['input']>;
  /** The transaction hash you created the account with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
  /** The username. */
  username?: InputMaybe<UsernameInput>;
};

export type AccountRulesConfigInput = {
  anyOf?: Array<AccountFollowRuleConfig>;
  required?: Array<AccountFollowRuleConfig>;
};

/**
 * Used to filter posts based on their author's account score.
 * The account score is an integer between 1 and 10000, where 1 is the lowest and 10000 is the
 * highest.
 */
export type AccountScoreFilter = {
  atLeast?: InputMaybe<Scalars['Int']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
};

export type AccountStats = {
  __typename?: 'AccountStats';
  /** The stats for the feeds. */
  feedStats: AccountFeedsStats;
  /** The stats for the graphs. */
  graphFollowStats: AccountGraphsFollowStats;
};

export type AccountStatsRequest = {
  /** The account to get stats for. */
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The feeds to get stats for. */
  forFeeds?: Array<Scalars['EvmAddress']['input']>;
  /** The graphs to get stats for. */
  forGraphs?: Array<Scalars['EvmAddress']['input']>;
  /** The username. */
  username?: InputMaybe<UsernameInput>;
};

export type AccountUnblockedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountUnblockedResponse = {
  __typename?: 'AccountUnblockedResponse';
  hash: Scalars['TxHash']['output'];
};

export type AccountUnfollowedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
  unfollowedAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  unfollower?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountUsernameAssignedNotificationAttributes = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountUsernameCreatedNotificationAttributes = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountUsernameOneOf = {
  /**
   * This will get the last linked username if it exists
   * note that it may not marry up to the app where a post
   * was created if used in that context
   */
  autoResolve?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  /** The namespace to get account assigned username */
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountUsernameUnassignedNotificationAttributes = {
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
  previousAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type AccountsAvailableRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The visibility of hidden accounts. */
  hiddenFilter?: ManagedAccountsVisibility;
  /** Whether to include owned accounts. Defaults to true. */
  includeOwned?: Scalars['Boolean']['input'];
  /** The account to get managed by. */
  managedBy: Scalars['EvmAddress']['input'];
  /** The page size. */
  pageSize?: PageSize;
};

export type AccountsBlockedRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
};

export type AccountsBulkRequest = {
  /** The addresses to get. */
  addresses?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The legacy profile IDs to get. */
  legacyProfileIds?: InputMaybe<Array<Scalars['LegacyProfileId']['input']>>;
  /** The accounts that are owned by the addresses */
  ownedBy?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The usernames to get. */
  usernames?: InputMaybe<Array<UsernameInput>>;
};

export type AccountsFilter = {
  /** The optional filter to narrow accounts by search query. */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum AccountsOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Alphabetical = 'ALPHABETICAL',
  BestMatch = 'BEST_MATCH'
}

export type AccountsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The optional accounts filter */
  filter?: InputMaybe<AccountsFilter>;
  /** The order by. */
  orderBy?: AccountsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type ActionMetadata = {
  __typename?: 'ActionMetadata';
  /** List of authors email addresses. */
  authors: Array<Scalars['String']['output']>;
  /**
   * An optional list of `ContractKeyValuePairDescriptor` that describes the `params` argument
   * of the `configure` function.
   */
  configureParams: Array<KeyValuePair>;
  /** Markdown formatted description of the Action. */
  description: Scalars['String']['output'];
  /**
   * A list of `ContractKeyValuePairDescriptor` that describes the `params` argument of the
   * `execute` function.
   */
  executeParams: Array<KeyValuePair>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** A short name for the Action. */
  name: Scalars['String']['output'];
  /**
   * An optional list of `ContractKeyValuePairDescriptor` that describes the `params` argument
   * of the `setDisabledParams` function.
   */
  setDisabledParams: Array<KeyValuePair>;
  /** The link to the Action source code. Typically a GitHub repository. */
  source: Scalars['URI']['output'];
};

export type AddAccountManagerRequest = {
  /** The address to add as a manager. */
  address: Scalars['EvmAddress']['input'];
  /** The permissions to give the account manager. */
  permissions: AccountManagerPermissionsInput;
};

export type AddAccountManagerResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AddAdminsRequest = {
  /** The graph/app/sponsor/feed/username/group address which manages these admins */
  address: Scalars['EvmAddress']['input'];
  /** The addresses to add as admins */
  admins: Array<Scalars['EvmAddress']['input']>;
};

export type AddAdminsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AddAppAuthorizationEndpointRequest = {
  /** The app. */
  app: Scalars['EvmAddress']['input'];
  /**
   * The bearer token for the app authorization endpoint.
   * This is used in the `Authorization: Bearer <token>` header.
   */
  bearerToken?: InputMaybe<Scalars['String']['input']>;
  /** The app authorization endpoint. */
  endpoint: Scalars['URL']['input'];
};

export type AddAppFeedsRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app feeds (max 10 per request) */
  feeds: Array<Scalars['EvmAddress']['input']>;
};

export type AddAppFeedsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AddAppGroupsRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app groups (max 10 per request) */
  groups: Array<Scalars['EvmAddress']['input']>;
};

export type AddAppGroupsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AddAppSignersRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app signers (max 10 per request) */
  signers: Array<Scalars['EvmAddress']['input']>;
};

export type AddAppSignersResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AddReactionFailure = {
  __typename?: 'AddReactionFailure';
  reason: Scalars['String']['output'];
};

export type AddReactionRequest = {
  /** The post to react to. */
  post: Scalars['PostId']['input'];
  /** The reaction to add. */
  reaction: PostReactionType;
};

export type AddReactionResponse = {
  __typename?: 'AddReactionResponse';
  success: Scalars['Boolean']['output'];
};

export type AddReactionResult = AddReactionFailure | AddReactionResponse;

export type AddressKeyValue = {
  __typename?: 'AddressKeyValue';
  address: Scalars['EvmAddress']['output'];
  key: Scalars['String']['output'];
};

export type Admin = {
  __typename?: 'Admin';
  account: Account;
  addedAt: Scalars['DateTime']['output'];
};

export type AdminsForFilterRequest = {
  /** The optional filter to narrow admins query */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum AdminsForOrderBy {
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type AdminsForRequest = {
  /** The graph/app/sponsor/feed/username/group address */
  address: Scalars['EvmAddress']['input'];
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AdminsForFilterRequest>;
  /** The order by. */
  orderBy?: AdminsForOrderBy;
  pageSize?: PageSize;
};

export type AmountInput = {
  /**
   * The token address. To represent the native token, use the
   * 0x000000000000000000000000000000000000800a.
   */
  currency: Scalars['EvmAddress']['input'];
  /**
   * Token value in its main unit (e.g., 1.5 DAI), not in the smallest fraction (e.g.,
   * wei).
   */
  value: Scalars['BigDecimal']['input'];
};

export type AnyAccountBalance = Erc20Amount | Erc20BalanceError | NativeAmount | NativeBalanceError;

export type AnyKeyValue = AddressKeyValue | ArrayKeyValue | BigDecimalKeyValue | BooleanKeyValue | DictionaryKeyValue | IntKeyValue | IntNullableKeyValue | RawKeyValue | StringKeyValue;

export type AnyKeyValueInput = {
  raw?: InputMaybe<RawKeyValueInput>;
};

/** AnyMedia */
export type AnyMedia = MediaAudio | MediaImage | MediaVideo;

export type AnyPost = Post | Repost;

export type App = {
  __typename?: 'App';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
  defaultFeedAddress?: Maybe<Scalars['EvmAddress']['output']>;
  graphAddress?: Maybe<Scalars['EvmAddress']['output']>;
  hasAuthorizationEndpoint: Scalars['Boolean']['output'];
  metadata?: Maybe<AppMetadata>;
  namespaceAddress?: Maybe<Scalars['EvmAddress']['output']>;
  owner: Scalars['EvmAddress']['output'];
  sponsorshipAddress?: Maybe<Scalars['EvmAddress']['output']>;
  treasuryAddress?: Maybe<Scalars['EvmAddress']['output']>;
  verificationEnabled: Scalars['Boolean']['output'];
};

export type AppFeed = {
  __typename?: 'AppFeed';
  feed: Scalars['EvmAddress']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type AppFeedsRequest = {
  /** The app address */
  app: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
};

export type AppGroupsRequest = {
  /** The app address */
  app: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
};

export type AppMetadata = {
  __typename?: 'AppMetadata';
  /** An optional short and detailed description of the app, explaining its features and purpose. */
  description?: Maybe<Scalars['String']['output']>;
  /** The Developer of the app. */
  developer: Scalars['String']['output'];
  /** The logo of the app. */
  logo?: Maybe<Scalars['URI']['output']>;
  /** The name of the app. */
  name: Scalars['String']['output'];
  /** The platforms supported by the app. */
  platforms: Array<AppPlatform>;
  /** The privacy policy for the app. */
  privacyPolicy?: Maybe<Scalars['URI']['output']>;
  /** The tagline of the app. */
  tagline?: Maybe<Scalars['String']['output']>;
  /** The terms of service for the app. */
  termsOfService?: Maybe<Scalars['URI']['output']>;
  /** The url of the app. */
  url: Scalars['URI']['output'];
};


export type AppMetadataLogoArgs = {
  request?: MediaImageRequest;
};

export enum AppPlatform {
  Android = 'ANDROID',
  Ios = 'IOS',
  Web = 'WEB'
}

export type AppRequest = {
  /** The app */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the app with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type AppServerApiKeyRequest = {
  /** The app address. */
  app: Scalars['EvmAddress']['input'];
};

export type AppSigner = {
  __typename?: 'AppSigner';
  signer: Scalars['EvmAddress']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type AppSignersFilterRequest = {
  /**
   * The optional filter to narrow signers.
   * Uses fuzzy search on signer address
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum AppSignersOrderBy {
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type AppSignersRequest = {
  /** The app address */
  app: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AppSignersFilterRequest>;
  /** The order by. */
  orderBy?: AppSignersOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type AppUser = {
  __typename?: 'AppUser';
  account: Account;
  firstLoginOn: Scalars['DateTime']['output'];
  lastActiveOn: Scalars['DateTime']['output'];
};

export type AppUsersFilterRequest = {
  /** The optional filter to narrow app users query */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum AppUsersOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Alphabetical = 'ALPHABETICAL',
  BestMatch = 'BEST_MATCH'
}

export type AppUsersRequest = {
  /** The App to get users for. */
  app: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<AppUsersFilterRequest>;
  /** The order by. */
  orderBy?: AppUsersOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type ApproveGroupMembershipRequest = {
  /** The accounts you want to approve membership for. */
  accounts: Array<Scalars['EvmAddress']['input']>;
  /** The group you want to add member to. */
  group: Scalars['EvmAddress']['input'];
  /** The processing params for the add member rules. */
  rulesProcessingParams?: InputMaybe<Array<GroupRulesProcessingParams>>;
};

export type ApproveGroupMembershipRequestsResponse = {
  __typename?: 'ApproveGroupMembershipRequestsResponse';
  hash: Scalars['TxHash']['output'];
};

export type ApproveGroupMembershipResult = ApproveGroupMembershipRequestsResponse | GroupOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AppsFilter = {
  /** The optional filter to get apps linked to feed */
  linkedToFeed?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The optional filter to get apps linked to graph */
  linkedToGraph?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The optional filter to get apps linked to sponsorship */
  linkedToSponsorship?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The optional filter to get apps managed by address */
  managedBy?: InputMaybe<ManagedBy>;
  /**
   * The optional filter to narrow apps by search query.
   * Uses fuzzy search on app name
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum AppsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type AppsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The optional apps filter */
  filter?: InputMaybe<AppsFilter>;
  /** The order by. */
  orderBy?: AppsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type AppsResult = {
  __typename?: 'AppsResult';
  items: Array<App>;
  pageInfo: PaginatedResultInfo;
};

export type ArrayData = AddressKeyValue | BigDecimalKeyValue | BooleanKeyValue | DictionaryKeyValue | IntKeyValue | IntNullableKeyValue | RawKeyValue | StringKeyValue;

export type ArrayKeyValue = {
  __typename?: 'ArrayKeyValue';
  array: Array<ArrayData>;
  key: Scalars['String']['output'];
};

export type ArticleMetadata = {
  __typename?: 'ArticleMetadata';
  /** Any attachment you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  /** The content of the article. */
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The optional article title. */
  title?: Maybe<Scalars['String']['output']>;
};

export type AssignUsernameResponse = {
  __typename?: 'AssignUsernameResponse';
  hash: Scalars['TxHash']['output'];
};

export type AssignUsernameToAccountRequest = {
  /** The processing params for the namespace assign rules. */
  assignRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** The processing params for the namespace unassign rules from account */
  unassignAccountRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** The processing params for the namespace unassign rules from namespace */
  unassignUsernameRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  username: UsernameInput;
};

export type AssignUsernameToAccountResult = AssignUsernameResponse | NamespaceOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type AudioMetadata = {
  __typename?: 'AudioMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  audio: MediaAudio;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The optional audio title. */
  title?: Maybe<Scalars['String']['output']>;
};

export type AuthenticatedSession = {
  __typename?: 'AuthenticatedSession';
  app: Scalars['EvmAddress']['output'];
  authenticationId: Scalars['UUID']['output'];
  browser?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  device?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  origin?: Maybe<Scalars['URL']['output']>;
  os?: Maybe<Scalars['String']['output']>;
  signer: Scalars['EvmAddress']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthenticatedSessionsRequest = {
  /** You can optionally filter the authentications by the app that created them. */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  pageSize?: PageSize;
};

export type AuthenticationChallenge = {
  __typename?: 'AuthenticationChallenge';
  id: Scalars['UUID']['output'];
  text: Scalars['String']['output'];
};

export type AuthenticationResult = AuthenticationTokens | ExpiredChallengeError | ForbiddenError | WrongSignerError;

export type AuthenticationTokens = {
  __typename?: 'AuthenticationTokens';
  /** The Access Token to use as a Bearer token in authenticated Lens API requests. */
  accessToken: Scalars['AccessToken']['output'];
  idToken: Scalars['IdToken']['output'];
  /** The Refresh Token to use to obtain a new tokens triplet without re-authenticating. */
  refreshToken: Scalars['RefreshToken']['output'];
};

export type BanGroupAccountsRequest = {
  /** The accounts you want to ban on the group. */
  accounts: Array<Scalars['EvmAddress']['input']>;
  /** The group you want to ban member on. */
  group: Scalars['EvmAddress']['input'];
};

export type BanGroupAccountsResponse = {
  __typename?: 'BanGroupAccountsResponse';
  hash: Scalars['TxHash']['output'];
};

export type BanGroupAccountsResult = BanGroupAccountsResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type BigDecimalKeyValue = {
  __typename?: 'BigDecimalKeyValue';
  bigDecimal: Scalars['BigDecimal']['output'];
  key: Scalars['String']['output'];
};

export type BlockRequest = {
  /** The account to block. */
  account: Scalars['EvmAddress']['input'];
};

export type BlockResult = AccountBlockedResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type BookmarkPostRequest = {
  post: Scalars['PostId']['input'];
};

export type BooleanKeyValue = {
  __typename?: 'BooleanKeyValue';
  boolean: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
};

export type BooleanValue = {
  __typename?: 'BooleanValue';
  onChain: Scalars['Boolean']['output'];
  optimistic: Scalars['Boolean']['output'];
};

export type BuilderChallengeRequest = {
  /** The builder's address. Most typically the EOA of their wallet. */
  address: Scalars['EvmAddress']['input'];
};

export type CanCreateUsernameResult = NamespaceOperationValidationFailed | NamespaceOperationValidationPassed | NamespaceOperationValidationUnknown | UsernameTaken;

export type CanFollowRequest = {
  graph: Scalars['EvmAddress']['input'];
};

export type CanUnfollowRequest = {
  graph: Scalars['EvmAddress']['input'];
};

export type CancelGroupMembershipRequestRequest = {
  /** The group you want cancel your membership request for */
  group: Scalars['EvmAddress']['input'];
};

export type CancelGroupMembershipRequestResponse = {
  __typename?: 'CancelGroupMembershipRequestResponse';
  hash: Scalars['TxHash']['output'];
};

export type CancelGroupMembershipRequestResult = CancelGroupMembershipRequestResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

/**
 * The request to generate a new authentication challenge.
 *
 * The optional fields are used to specify the role you are authenticating as.
 * You can only specify one role at a time.
 */
export type ChallengeRequest = {
  /** Use this to authenticate as an Account Manager. */
  accountManager?: InputMaybe<AccountManagerChallengeRequest>;
  /** Use this to authenticate as an Account Owner. */
  accountOwner?: InputMaybe<AccountOwnerChallengeRequest>;
  /** Use this to authenticate as a Builder. */
  builder?: InputMaybe<BuilderChallengeRequest>;
  /** Use this to authenticate as an Onboarding User. */
  onboardingUser?: InputMaybe<OnboardingUserChallengeRequest>;
};

export type CheckingInMetadata = {
  __typename?: 'CheckingInMetadata';
  /** The optional address of the location. */
  address?: Maybe<PhysicalAddress>;
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** Where you're checking in from (free form text). */
  location: Scalars['String']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** The optional geographic position of the location. */
  position?: Maybe<Scalars['GeoUri']['output']>;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type CollectedBy = {
  /** The address of the account that collected the posts. */
  account: Scalars['EvmAddress']['input'];
};

export type CommentNotification = {
  __typename?: 'CommentNotification';
  comment: Post;
  id: Scalars['GeneratedNotificationId']['output'];
};

export type ConfigureAccountActionRequest = {
  /** The action type and configuration. */
  action: AccountActionConfigInput;
};

export type ConfigureAccountActionResponse = {
  __typename?: 'ConfigureAccountActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type ConfigureAccountActionResult = ConfigureAccountActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type ConfigurePostActionRequest = {
  /** The post action configuration parameters. */
  params: PostActionConfigInput;
  /** The post to configure the action for. */
  post: Scalars['PostId']['input'];
};

export type ConfigurePostActionResponse = {
  __typename?: 'ConfigurePostActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type ConfigurePostActionResult = ConfigurePostActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export enum ContentWarning {
  Nsfw = 'NSFW',
  Sensitive = 'SENSITIVE',
  Spoiler = 'SPOILER'
}

export type CreateAccountResponse = {
  __typename?: 'CreateAccountResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateAccountWithUsernameRequest = {
  /** Any account managers you wish to add to the account */
  accountManager?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The processing params for the username assign rules. */
  assignUsernameRuleProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** The processing params for the username create rules. */
  createUsernameRuleProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** Enable signless on creation adding the lens API key to the account manager */
  enableSignless?: Scalars['Boolean']['input'];
  /** The account metadata uri */
  metadataUri: Scalars['URI']['input'];
  /**
   * If you do not supply this it will use the onboarding or builder address, you can use this
   * if your server is onboarding users
   */
  owner?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The username you wish to mint with the account */
  username: UsernameInput;
};

export type CreateAccountWithUsernameResult = CreateAccountResponse | NamespaceOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UsernameTaken;

export type CreateAppRequest = {
  /** List of admins who can manage this app */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The app default feed */
  defaultFeed: FeedChoiceOneOf;
  /** The app feeds defaults to use the global feed */
  feeds?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The app default graph */
  graph: GraphChoiceOneOf;
  /** The app groups leave empty if none */
  groups?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The app metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** The app username namespace */
  namespace: UsernameNamespaceChoiceOneOf;
  /** The app signers leave empty if none */
  signers?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The app sponsorship leave empty if none */
  sponsorship?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The app treasury leave empty if none */
  treasury?: InputMaybe<Scalars['EvmAddress']['input']>;
  /**
   * Whether the App Verification workflow is enabled.
   * This gives control to approve or reject transactions involving
   * social interactions (e.g., post, follow, comment, etc.) using the app.
   */
  verification?: Scalars['Boolean']['input'];
};

export type CreateAppResponse = {
  __typename?: 'CreateAppResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateAppResult = CreateAppResponse | SelfFundedTransactionRequest | TransactionWillFail;

export type CreateFeedRequest = {
  /** List of admins who can manage this feed */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The feed metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** Rules for the feed */
  rules?: InputMaybe<FeedRulesConfigInput>;
};

export type CreateFeedResponse = {
  __typename?: 'CreateFeedResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateFeedResult = CreateFeedResponse | SelfFundedTransactionRequest | TransactionWillFail;

export type CreateFollowRequest = {
  /** The account to follow. */
  account: Scalars['EvmAddress']['input'];
  /** The data required by any follow rules associated with the account being followed. */
  followRuleProcessingParams?: InputMaybe<Array<AccountFollowRulesProcessingParams>>;
  /** The graph to follow the account on. If not provided, the global graph is used. */
  graph?: Scalars['EvmAddress']['input'];
  /** The data required by the graph rules associated with the specified graph. */
  graphRulesProcessingParams?: InputMaybe<Array<GraphRulesProcessingParams>>;
};

export type CreateFrameEip712TypedData = {
  __typename?: 'CreateFrameEIP712TypedData';
  /** The domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateFrameEip712TypedDataTypes;
  /** The value */
  value: CreateFrameEip712TypedDataValue;
};

export type CreateFrameEip712TypedDataInput = {
  /** The typed data domain */
  domain: Eip712TypedDataDomainInput;
  /** The typed data types */
  types: CreateFrameEip712TypedDataTypesInput;
  /** The typed data value */
  value: FrameEip712Request;
};

export type CreateFrameEip712TypedDataTypes = {
  __typename?: 'CreateFrameEIP712TypedDataTypes';
  /** The frame data */
  frameData: Array<Eip712TypedDataField>;
};

export type CreateFrameEip712TypedDataTypesInput = {
  /** The frame data */
  frameData: Array<Eip712TypedDataFieldInput>;
};

export type CreateFrameEip712TypedDataValue = {
  __typename?: 'CreateFrameEIP712TypedDataValue';
  /** The account address */
  account: Scalars['EvmAddress']['output'];
  /** The app the frame is being executed from */
  app: Scalars['EvmAddress']['output'];
  /** The button index */
  buttonIndex: Scalars['Int']['output'];
  /** The deadline the typed data expires */
  deadline: Scalars['Int']['output'];
  /** The input text */
  inputText: Scalars['String']['output'];
  /** The post id */
  postId: Scalars['PostId']['output'];
  /** The frame spec version */
  specVersion: Scalars['String']['output'];
  /** The state */
  state: Scalars['String']['output'];
  /** The transaction id */
  transactionId: Scalars['String']['output'];
  /** The url */
  url: Scalars['URI']['output'];
};

export type CreateGraphRequest = {
  /** List of admins who can manage this graph */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The graph metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** Rules for the graph */
  rules?: InputMaybe<GraphRulesConfigInput>;
};

export type CreateGraphResponse = {
  __typename?: 'CreateGraphResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateGraphResult = CreateGraphResponse | SelfFundedTransactionRequest | TransactionWillFail;

export type CreateGroupRequest = {
  /** List of admins who can manage this group */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The group feed configuration */
  feed?: InputMaybe<GroupFeedParams>;
  /** The group metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** Will default to the person creating it if no owner is supplied */
  owner?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** Rules for the group */
  rules?: InputMaybe<GroupRulesConfigInput>;
};

export type CreateGroupResponse = {
  __typename?: 'CreateGroupResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateGroupResult = CreateGroupResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type CreateNamespaceResponse = {
  __typename?: 'CreateNamespaceResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreatePostRequest = {
  /** The actions to attach to the post. */
  actions?: InputMaybe<Array<PostActionConfigInput>>;
  /** The post to comment on, if any. */
  commentOn?: InputMaybe<ReferencingPostInput>;
  /** The URI of the post metadata. */
  contentUri: Scalars['URI']['input'];
  /**
   * The feed to post to.
   * Defaults to the global feed for new posts, or the original post's feed for comments and
   * quotes.
   */
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The processing params for the feed rules. */
  feedRulesProcessingParams?: InputMaybe<Array<FeedRulesProcessingParams>>;
  /** The post to quote, if any. */
  quoteOf?: InputMaybe<ReferencingPostInput>;
  /** Rules for the post */
  rules?: InputMaybe<PostRulesConfigInput>;
};

export type CreateRepostRequest = {
  /** The processing params for the feed rules. */
  feedRulesProcessingParams?: InputMaybe<Array<FeedRulesProcessingParams>>;
  /** The post to reference. */
  post: Scalars['PostId']['input'];
  /** The processing params for the post rules. */
  postRulesProcessingParams?: InputMaybe<Array<PostRulesProcessingParams>>;
};

export type CreateSnsSubscriptionRequest = {
  /** The app to optionally assign this subscription to. */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  /**
   * The topics to subscribe to. You can subscribe to multiple topics at once. This cannot be
   * changed once the subscription is created.
   */
  topics: Array<SnsTopicInput>;
  /**
   * The webhook URL to send notifications to. It must be an HTTP or HTTPS URL that is
   * accessible by the Lens API and is owned by you as it will be used to confirm the
   * subscription.
   */
  webhook: Scalars['String']['input'];
};

export type CreateSponsorshipRequest = {
  /** List of admins who can manage this sponsorship. */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /**
   * Indicates whether the Lens API is authorized as the sponsorship signer
   * to sponsor end-user social operations (e.g., posts, comments, follows)
   * performed through the Lens API for apps associated with this sponsorship.
   */
  allowLensAccess: Scalars['Boolean']['input'];
  /** The list of addresses excluded from the sponsorship rate limits. */
  exclusionList?: InputMaybe<Array<SponsorshipRateLimitsExempt>>;
  /** The sponsorship metadata URI */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** The sponsorship usage allowances with the corresponding limits. */
  rateLimit?: InputMaybe<SponsorshipRateLimitsInput>;
  /** List of sponsorship signers. */
  signers?: InputMaybe<Array<SponsorshipSignerInput>>;
};

export type CreateSponsorshipResponse = {
  __typename?: 'CreateSponsorshipResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateSponsorshipResult = CreateSponsorshipResponse | SelfFundedTransactionRequest | TransactionWillFail;

export type CreateUnfollowRequest = {
  /** The account to unfollow. */
  account: Scalars['EvmAddress']['input'];
  /**
   * The graph where the account is followed and should be unfollowed.
   * If not provided, the global graph is used.
   */
  graph?: Scalars['EvmAddress']['input'];
  /** The processing params for the graph rules. */
  graphRulesProcessingParams?: InputMaybe<Array<GraphRulesProcessingParams>>;
};

export type CreateUsernameNamespaceRequest = {
  /** List of admins who can manage this feed */
  admins?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The feed metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /**
   * The namespace for example for lens this would be lens, and it means that the usernames will
   * be like lens/username
   */
  namespace: Scalars['String']['input'];
  rules?: InputMaybe<NamespaceRulesConfigInput>;
  /** The namespace NFT collection ERC721 symbol */
  symbol: Scalars['String']['input'];
};

export type CreateUsernameNamespaceResult = CreateNamespaceResponse | SelfFundedTransactionRequest | TransactionWillFail;

export type CreateUsernameRequest = {
  /** The processing params for the namespace assign rules from account */
  assignAccountNamespaceRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** If you want to auto assign the username to the account default is true */
  autoAssign?: Scalars['Boolean']['input'];
  /** The processing params for the namespace create rules. */
  createUsernameRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  /** The processing params for the namespace unassign rules from namespace */
  unassignUsernameNamespaceRulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
  username: UsernameInput;
};

export type CreateUsernameResponse = {
  __typename?: 'CreateUsernameResponse';
  hash: Scalars['TxHash']['output'];
};

export type CreateUsernameResult = CreateUsernameResponse | NamespaceOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UsernameTaken;

export type DebugPostMetadataRequest = {
  json?: InputMaybe<Scalars['String']['input']>;
  rawUri?: InputMaybe<Scalars['URI']['input']>;
  source: EntityType;
};

export type DebugPostMetadataResult = {
  __typename?: 'DebugPostMetadataResult';
  reason?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type DeletePostRequest = {
  /** The processing params for the feed rules. */
  feedRulesProcessingParams?: InputMaybe<Array<FeedRulesProcessingParams>>;
  /** The post to delete. */
  post: Scalars['PostId']['input'];
};

export type DeletePostResponse = {
  __typename?: 'DeletePostResponse';
  hash: Scalars['TxHash']['output'];
};

export type DeletePostResult = DeletePostResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type DeleteSnsSubscriptionRequest = {
  id: Scalars['UUID']['input'];
};

export type DepositRequest = {
  erc20?: InputMaybe<AmountInput>;
  native?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type DepositResult = InsufficientFunds | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type DictionaryKeyValue = {
  __typename?: 'DictionaryKeyValue';
  dictionary: Array<PrimitiveData>;
  key: Scalars['String']['output'];
};

export type DisableAccountActionRequest = {
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type DisableAccountActionResponse = {
  __typename?: 'DisableAccountActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type DisableAccountActionResult = DisableAccountActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type DisablePostActionParams = {
  simpleCollect?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type DisablePostActionRequest = {
  action: DisablePostActionParams;
  /** The target post. */
  post: Scalars['PostId']['input'];
};

export type DisablePostActionResponse = {
  __typename?: 'DisablePostActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type DisablePostActionResult = DisablePostActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type DismissRecommendedAccountsRequest = {
  accounts: Array<Scalars['EvmAddress']['input']>;
};

export type EditPostRequest = {
  contentUri: Scalars['URI']['input'];
  /** The processing params for the feed rules. */
  feedRulesProcessingParams?: InputMaybe<Array<FeedRulesProcessingParams>>;
  /** The processing params for the parent post (if post edited is a comment or quote) */
  parentPostRulesProcessingParams?: InputMaybe<Array<PostRulesProcessingParams>>;
  post: Scalars['PostId']['input'];
};

/** Contains EIP-712 transaction metadata. */
export type Eip712Meta = {
  __typename?: 'Eip712Meta';
  /** Custom signature used for cases where the signer's account is not an EOA. */
  customSignature?: Maybe<Scalars['BlockchainData']['output']>;
  /**
   * An array of bytes containing the bytecode of the contract being deployed and any related
   * contracts it can deploy.
   */
  factoryDeps: Array<Scalars['BlockchainData']['output']>;
  /** The maximum amount of gas the user is willing to pay for a single byte of pubdata. */
  gasPerPubdata: Scalars['BigInt']['output'];
  /** Parameters for configuring the custom paymaster for the transaction. */
  paymasterParams?: Maybe<PaymasterParams>;
};

export type Eip712TransactionRequest = {
  __typename?: 'Eip712TransactionRequest';
  /** The chain ID for the network this transaction is valid on. */
  chainId: Scalars['Int']['output'];
  /** The custom data for EIP-712 transaction metadata. */
  customData: Eip712Meta;
  /** The transaction data. */
  data: Scalars['BlockchainData']['output'];
  /** The sender of the transaction. */
  from: Scalars['EvmAddress']['output'];
  /** The maximum amount of gas to allow this transaction to consume. */
  gasLimit: Scalars['Int']['output'];
  /**
   * The maximum total fee to pay per gas. The actual
   * value used is protocol enforced to be the block's base fee.
   */
  maxFeePerGas: Scalars['BigInt']['output'];
  /** The maximum priority fee to pay per gas. */
  maxPriorityFeePerGas: Scalars['BigInt']['output'];
  /** The nonce of the transaction, used to prevent replay attacks. */
  nonce: Scalars['Int']['output'];
  /** The target of the transaction. */
  to: Scalars['EvmAddress']['output'];
  /** The transaction type: 113 for EIP-712 transactions. */
  type: Scalars['Int']['output'];
  /** The transaction value (in wei). */
  value: Scalars['BigInt']['output'];
};

export type Eip712TypedDataDomain = {
  __typename?: 'Eip712TypedDataDomain';
  /** The chain id */
  chainId: Scalars['Int']['output'];
  /** The name of the domain */
  name: Scalars['String']['output'];
  /** The verifying contract */
  verifyingContract: Scalars['EvmAddress']['output'];
  /** The version of the domain */
  version: Scalars['String']['output'];
};

export type Eip712TypedDataDomainInput = {
  /** The chain id */
  chainId: Scalars['Int']['input'];
  /** The name of the domain */
  name: Scalars['String']['input'];
  /** The verifying contract */
  verifyingContract: Scalars['EvmAddress']['input'];
  /** The version of the domain */
  version: Scalars['String']['input'];
};

export type Eip712TypedDataField = {
  __typename?: 'Eip712TypedDataField';
  /** The name of the field */
  name: Scalars['String']['output'];
  /** The type of the field */
  type: Scalars['String']['output'];
};

export type Eip712TypedDataFieldInput = {
  /** The name of the field */
  name: Scalars['String']['input'];
  /** The type of the field */
  type: Scalars['String']['input'];
};

export type Eip1559TransactionRequest = {
  __typename?: 'Eip1559TransactionRequest';
  /** The chain ID for the network this transaction is valid on. */
  chainId: Scalars['Int']['output'];
  /** The transaction data. */
  data: Scalars['BlockchainData']['output'];
  /** The sender of the transaction. */
  from: Scalars['EvmAddress']['output'];
  /** The maximum amount of gas to allow this transaction to consume. */
  gasLimit: Scalars['Int']['output'];
  /**
   * The maximum total fee to pay per gas. The actual
   * value used is protocol enforced to be the block's base fee.
   */
  maxFeePerGas: Scalars['BigInt']['output'];
  /** The maximum priority fee to pay per gas. */
  maxPriorityFeePerGas: Scalars['BigInt']['output'];
  /** The nonce of the transaction, used to prevent replay attacks. */
  nonce: Scalars['Int']['output'];
  /** The target of the transaction. */
  to: Scalars['EvmAddress']['output'];
  /** The transaction type: 2 for EIP-1559 transactions. */
  type: Scalars['Int']['output'];
  /** The transaction value (in wei). */
  value: Scalars['BigInt']['output'];
};

export type EmbedMetadata = {
  __typename?: 'EmbedMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  /** The embed URL. */
  embed: Scalars['URI']['output'];
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type EnableAccountActionRequest = {
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type EnableAccountActionResponse = {
  __typename?: 'EnableAccountActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type EnableAccountActionResult = EnableAccountActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type EnablePostActionParams = {
  simpleCollect?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type EnablePostActionRequest = {
  action: EnablePostActionParams;
  /** The target post. */
  post: Scalars['PostId']['input'];
};

export type EnablePostActionResponse = {
  __typename?: 'EnablePostActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type EnablePostActionResult = EnablePostActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type EnableSignlessResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type EntityId = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  accountAction?: InputMaybe<Scalars['EvmAddress']['input']>;
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
  group?: InputMaybe<Scalars['EvmAddress']['input']>;
  post?: InputMaybe<Scalars['PostId']['input']>;
  postAction?: InputMaybe<Scalars['EvmAddress']['input']>;
  sponsorship?: InputMaybe<Scalars['EvmAddress']['input']>;
  usernameNamespace?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export enum EntityType {
  Account = 'ACCOUNT',
  AccountAction = 'ACCOUNT_ACTION',
  App = 'APP',
  Feed = 'FEED',
  Graph = 'GRAPH',
  Group = 'GROUP',
  Post = 'POST',
  PostAction = 'POST_ACTION',
  Rule = 'RULE',
  Sponsorship = 'SPONSORSHIP',
  UsernameNamespace = 'USERNAME_NAMESPACE'
}

export type Erc20 = {
  __typename?: 'Erc20';
  /** The contract address of the token. */
  contract: NetworkAddress;
  /** The number of decimals the token uses. */
  decimals: Scalars['Int']['output'];
  /** The name of the token. */
  name: Scalars['String']['output'];
  /** The symbol of the token. */
  symbol: Scalars['String']['output'];
};

export type Erc20Amount = {
  __typename?: 'Erc20Amount';
  /** The ERC-20 token info. */
  asset: Erc20;
  /**
   * Token value in its main unit (e.g., 1.5 DAI), not in the smallest fraction (e.g.,
   * wei).
   */
  value: Scalars['BigDecimal']['output'];
};

export type Erc20BalanceError = {
  __typename?: 'Erc20BalanceError';
  /** The reason for the failure. */
  reason: Scalars['String']['output'];
  /** The token for which the balance retrieval failed. */
  token: Scalars['EvmAddress']['output'];
};

export type EventLocation = {
  __typename?: 'EventLocation';
  physical?: Maybe<Scalars['String']['output']>;
  virtual?: Maybe<Scalars['URI']['output']>;
};

export type EventMetadata = {
  __typename?: 'EventMetadata';
  /** The address of the event. */
  address?: Maybe<PhysicalAddress>;
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  /** The event end time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`). */
  endsAt: Scalars['DateTime']['output'];
  id: Scalars['MetadataId']['output'];
  /** The links you want to include with it. */
  links: Array<Scalars['URI']['output']>;
  locale: Scalars['Locale']['output'];
  /** The location of the event. */
  location: EventLocation;
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** The geographic position of the event. */
  position?: Maybe<Scalars['GeoUri']['output']>;
  schedulingAdjustments?: Maybe<EventSchedulingAdjustments>;
  /** The event start time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`). */
  startsAt: Scalars['DateTime']['output'];
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The title of the event. */
  title?: Maybe<Scalars['String']['output']>;
};

export type EventSchedulingAdjustments = {
  __typename?: 'EventSchedulingAdjustments';
  /**
   * Indicates a reference timezone for the event start and end times. If physical event, you
   * could use the timezone of the event location. If virtual event, the timezone of the event
   * organizer.
   */
  timezoneId: TimezoneId;
  timezoneOffset: Scalars['Float']['output'];
};

export type ExecuteAccountActionRequest = {
  /** The target account to execute the action on. */
  account: Scalars['EvmAddress']['input'];
  /** The action params. */
  action: AccountActionExecuteInput;
};

export type ExecuteAccountActionResponse = {
  __typename?: 'ExecuteAccountActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type ExecuteAccountActionResult = ExecuteAccountActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type ExecutePostActionRequest = {
  /** The action params. */
  action: PostActionExecuteInput;
  /** The target post to execute the action on. */
  post: Scalars['PostId']['input'];
};

export type ExecutePostActionResponse = {
  __typename?: 'ExecutePostActionResponse';
  hash: Scalars['TxHash']['output'];
};

export type ExecutePostActionResult = ExecutePostActionResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type ExecutedUnknownActionRequest = {
  address: Scalars['EvmAddress']['input'];
};

/** The challenge has expired or was not found. */
export type ExpiredChallengeError = {
  __typename?: 'ExpiredChallengeError';
  reason: Scalars['String']['output'];
};

/**
 * The transaction has failed to be mined or indexed.
 *
 * The reason for the failure is provided.
 */
export type FailedTransactionStatus = {
  __typename?: 'FailedTransactionStatus';
  blockTimestamp: Scalars['DateTime']['output'];
  reason: Scalars['String']['output'];
  summary: Array<SubOperationStatus>;
};

export type Feed = {
  __typename?: 'Feed';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
  metadata?: Maybe<FeedMetadata>;
  operations?: Maybe<LoggedInFeedPostOperations>;
  owner: Scalars['EvmAddress']['output'];
  rules: FeedRules;
};

export type FeedChoiceOneOf = {
  custom?: InputMaybe<Scalars['EvmAddress']['input']>;
  globalFeed?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  none?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export type FeedMetadata = {
  __typename?: 'FeedMetadata';
  /** Optional markdown formatted description of the Feed. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** The name of the Feed. */
  name: Scalars['String']['output'];
};

export type FeedOneOf = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  globalFeed?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export type FeedOperationValidationFailed = {
  __typename?: 'FeedOperationValidationFailed';
  reason: Scalars['String']['output'];
  unsatisfiedRules?: Maybe<FeedUnsatisfiedRules>;
};

export type FeedOperationValidationOutcome = FeedOperationValidationFailed | FeedOperationValidationPassed | FeedOperationValidationUnknown;

export type FeedOperationValidationPassed = {
  __typename?: 'FeedOperationValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type FeedOperationValidationUnknown = {
  __typename?: 'FeedOperationValidationUnknown';
  extraChecksRequired: Array<FeedRule>;
};

export type FeedRequest = {
  /** The feed */
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the feed with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type FeedRule = {
  __typename?: 'FeedRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  executesOn: Array<FeedRuleExecuteOn>;
  id: Scalars['RuleId']['output'];
  type: FeedRuleType;
};

export type FeedRuleConfig = {
  groupGatedRule?: InputMaybe<GroupGatedFeedRuleConfig>;
  simplePaymentRule?: InputMaybe<SimplePaymentFeedRuleConfig>;
  tokenGatedRule?: InputMaybe<TokenGatedFeedRuleConfig>;
  unknownRule?: InputMaybe<UnknownFeedRuleConfig>;
};

export enum FeedRuleExecuteOn {
  ChangingPostRule = 'CHANGING_POST_RULE',
  CreatingPost = 'CREATING_POST',
  DeletingPost = 'DELETING_POST',
  EditingPost = 'EDITING_POST'
}

export enum FeedRuleType {
  AccountBlocking = 'ACCOUNT_BLOCKING',
  GroupGated = 'GROUP_GATED',
  RestrictedSigners = 'RESTRICTED_SIGNERS',
  SimplePayment = 'SIMPLE_PAYMENT',
  TokenGated = 'TOKEN_GATED',
  Unknown = 'UNKNOWN'
}

export enum FeedRuleUnsatisfiedReason {
  AccountBlocked = 'ACCOUNT_BLOCKED',
  GroupGatedNotAMember = 'GROUP_GATED_NOT_A_MEMBER',
  SimplePaymentNotEnoughBalance = 'SIMPLE_PAYMENT_NOT_ENOUGH_BALANCE',
  TokenGatedNotATokenHolder = 'TOKEN_GATED_NOT_A_TOKEN_HOLDER'
}

export type FeedRules = {
  __typename?: 'FeedRules';
  anyOf: Array<FeedRule>;
  required: Array<FeedRule>;
};

export type FeedRulesConfigInput = {
  anyOf?: Array<FeedRuleConfig>;
  required?: Array<FeedRuleConfig>;
};

export type FeedRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type FeedUnsatisfiedRule = {
  __typename?: 'FeedUnsatisfiedRule';
  config: Array<AnyKeyValue>;
  message: Scalars['String']['output'];
  reason: FeedRuleUnsatisfiedReason;
  rule: Scalars['EvmAddress']['output'];
};

export type FeedUnsatisfiedRules = {
  __typename?: 'FeedUnsatisfiedRules';
  anyOf: Array<FeedUnsatisfiedRule>;
  required: Array<FeedUnsatisfiedRule>;
};

export type FeedsFilter = {
  /** The optional filter to get feeds managed by address */
  managedBy?: InputMaybe<ManagedBy>;
  /**
   * The optional filter to narrow feeds by search query.
   * Uses fuzzy search on feed name
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum FeedsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type FeedsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<FeedsFilter>;
  /** The order by. */
  orderBy?: FeedsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

/**
 * The transaction has been mined and indexed correctly.
 *
 * If the transaction involves any metadata, the metadata has been snapshotted and indexed.
 */
export type FinishedTransactionStatus = {
  __typename?: 'FinishedTransactionStatus';
  blockTimestamp: Scalars['DateTime']['output'];
  summary: Array<SubOperationStatus>;
};

export type FixedSizeTransform = {
  height: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type FollowNotification = {
  __typename?: 'FollowNotification';
  followers: Array<NotificationAccountFollow>;
  id: Scalars['GeneratedNotificationId']['output'];
};

export type FollowPair = {
  /** The account being followed. */
  account: Scalars['EvmAddress']['input'];
  /** The follower. */
  follower: Scalars['EvmAddress']['input'];
  /** The graph you are checking defaults to global graph. */
  graph?: Scalars['EvmAddress']['input'];
};

export type FollowResponse = {
  __typename?: 'FollowResponse';
  hash: Scalars['TxHash']['output'];
};

export type FollowResult = AccountFollowOperationValidationFailed | FollowResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type FollowStatusRequest = {
  pairs: Array<FollowPair>;
};

export type FollowStatusResult = {
  __typename?: 'FollowStatusResult';
  account: Scalars['EvmAddress']['output'];
  follower: Scalars['EvmAddress']['output'];
  graph: Scalars['EvmAddress']['output'];
  isFollowing: BooleanValue;
};

export type Follower = {
  __typename?: 'Follower';
  /** The timestamp when the follower was followed */
  followedOn: Scalars['DateTime']['output'];
  /** The account which is following */
  follower: Account;
  /** The graph the follower is following on */
  graph: Scalars['EvmAddress']['output'];
};

export type FollowerOn = {
  __typename?: 'FollowerOn';
  globalGraph: Scalars['Boolean']['output'];
  graph: Scalars['EvmAddress']['output'];
};

export type FollowerOnInput = {
  globalGraph?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type FollowersFilter = {
  /**
   * The graphs to filter by.
   * The result will come back if they follow on ANY of the supplied graphs
   */
  graphs?: InputMaybe<Array<GraphOneOf>>;
};

export type FollowersOnlyPostRuleConfig = {
  graph?: Scalars['EvmAddress']['input'];
  quotesRestricted?: Scalars['Boolean']['input'];
  repliesRestricted?: Scalars['Boolean']['input'];
  repostRestricted?: Scalars['Boolean']['input'];
};

export enum FollowersOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Asc = 'ASC',
  Desc = 'DESC'
}

export type FollowersRequest = {
  /** The account to get followers for. */
  account: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the result. */
  filter?: InputMaybe<FollowersFilter>;
  /** The order by. */
  orderBy?: FollowersOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type FollowersYouKnowFilter = {
  /**
   * The graphs to get followers you know for
   * The result will come back if they follow on ANY of the supplied graphs
   */
  graphs?: InputMaybe<Array<GraphOneOf>>;
};

export enum FollowersYouKnowOrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type FollowersYouKnowRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the result. */
  filter?: InputMaybe<FollowersYouKnowFilter>;
  /** The account you are looking from. */
  observer: Scalars['EvmAddress']['input'];
  /** The order by. */
  orderBy?: FollowersYouKnowOrderBy;
  /** The page size. */
  pageSize?: PageSize;
  /** The account to check followers you know. */
  target: Scalars['EvmAddress']['input'];
};

export type Following = {
  __typename?: 'Following';
  /** The timestamp when the following happened */
  followedOn: Scalars['DateTime']['output'];
  /** The account which is following */
  following: Account;
  /** The graph the account is following on */
  graph: Scalars['EvmAddress']['output'];
};

export type FollowingFilter = {
  /**
   * The graphs to filter by.
   * The result will come back if they are following on ANY of the supplied graphs
   */
  graphs?: InputMaybe<Array<GraphOneOf>>;
};

export enum FollowingOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Asc = 'ASC',
  Desc = 'DESC'
}

export type FollowingRequest = {
  /** The account to get following for. */
  account: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the result. */
  filter?: InputMaybe<FollowingFilter>;
  /** The order by. */
  orderBy?: FollowingOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export enum ForYouSource {
  Curated = 'CURATED',
  ExtendedNetwork = 'EXTENDED_NETWORK',
  Following = 'FOLLOWING',
  Popular = 'POPULAR'
}

export type ForbiddenError = {
  __typename?: 'ForbiddenError';
  reason: Scalars['String']['output'];
};

export type FrameEip712Request = {
  /** The account address */
  account: Scalars['EvmAddress']['input'];
  /** The app the frame is being executed from */
  app: Scalars['EvmAddress']['input'];
  /** The button index */
  buttonIndex: Scalars['Int']['input'];
  /** The deadline the typed data expires */
  deadline: Scalars['Int']['input'];
  /** The input text */
  inputText: Scalars['String']['input'];
  /** The post id */
  post: Scalars['PostId']['input'];
  /** The frame spec version */
  specVersion: Scalars['String']['input'];
  /** The state */
  state: Scalars['String']['input'];
  /** The transaction id */
  transactionId: Scalars['String']['input'];
  /** The url */
  url: Scalars['URI']['input'];
};

export type FrameLensManagerSignatureResult = {
  __typename?: 'FrameLensManagerSignatureResult';
  /** The signature */
  signature: Scalars['Signature']['output'];
  /** The signed typed data */
  signedTypedData: CreateFrameEip712TypedData;
};

export type FrameVerifySignature = {
  /** The identity token */
  identityToken: Scalars['IdToken']['input'];
  /** The signature */
  signature: Scalars['Signature']['input'];
  /** The signed typed data */
  signedTypedData: CreateFrameEip712TypedDataInput;
};

export enum FrameVerifySignatureResult {
  /** The deadline has expired */
  DeadlineExpired = 'DEADLINE_EXPIRED',
  /** The identity token is not a valid identity token */
  IdentityCannotUseAccount = 'IDENTITY_CANNOT_USE_ACCOUNT',
  /** The identity token is not a valid identity token used with an account authentication */
  IdentityTokenNotValid = 'IDENTITY_TOKEN_NOT_VALID',
  /** The identity token is not authorized to use the frame */
  IdentityUnauthorized = 'IDENTITY_UNAUTHORIZED',
  /** The post does not exist */
  PostDoesntExist = 'POST_DOESNT_EXIST',
  /** The signature is not valid */
  SignatureNotValid = 'SIGNATURE_NOT_VALID',
  /** The signer address cannot use the account */
  SignerAddressCannotUseAccount = 'SIGNER_ADDRESS_CANNOT_USE_ACCOUNT',
  /** The typed data account is not matching the identity token account */
  TypedDataAccountNotMatchingIdentityToken = 'TYPED_DATA_ACCOUNT_NOT_MATCHING_IDENTITY_TOKEN',
  /** The typed data domain is not in the correct format */
  TypedDataDomainIncorrect = 'TYPED_DATA_DOMAIN_INCORRECT',
  /** The typed data types is not in the correct format */
  TypedDataTypesIncorrectFields = 'TYPED_DATA_TYPES_INCORRECT_FIELDS',
  /** The frame was verified */
  Verified = 'VERIFIED'
}

export type GenerateNewAppServerApiKeyRequest = {
  /** The app to generate the new server side api key for */
  app: Scalars['EvmAddress']['input'];
};

export type GetSnsSubscriptionsRequest = {
  /**
   * The app to get subscriptions for. If not provided, all subscriptions owned by the logged in
   * account will be returned.
   */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type Graph = {
  __typename?: 'Graph';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
  metadata?: Maybe<GraphMetadata>;
  owner: Scalars['EvmAddress']['output'];
  rules: GraphRules;
};

export type GraphChoiceOneOf = {
  custom?: InputMaybe<Scalars['EvmAddress']['input']>;
  globalGraph?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  none?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export type GraphMetadata = {
  __typename?: 'GraphMetadata';
  /** Optional markdown formatted description of the graph. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** The name of the graph. */
  name: Scalars['String']['output'];
};

export type GraphOneOf = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  globalGraph?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type GraphRequest = {
  /** The graph */
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the graph with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type GraphRule = {
  __typename?: 'GraphRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  executesOn: Array<GraphRuleExecuteOn>;
  id: Scalars['RuleId']['output'];
  type: GraphRuleType;
};

export type GraphRuleConfig = {
  groupGatedRule?: InputMaybe<GroupGatedGraphRuleConfig>;
  tokenGatedRule?: InputMaybe<TokenGatedGraphRuleConfig>;
  unknownRule?: InputMaybe<UnknownGraphRuleConfig>;
};

export enum GraphRuleExecuteOn {
  ChangingFollowRules = 'CHANGING_FOLLOW_RULES',
  Following = 'FOLLOWING',
  Unfollowing = 'UNFOLLOWING'
}

export enum GraphRuleType {
  AccountBlocking = 'ACCOUNT_BLOCKING',
  GroupGated = 'GROUP_GATED',
  TokenGated = 'TOKEN_GATED',
  Unknown = 'UNKNOWN'
}

export type GraphRules = {
  __typename?: 'GraphRules';
  anyOf: Array<GraphRule>;
  required: Array<GraphRule>;
};

export type GraphRulesConfigInput = {
  anyOf?: Array<GraphRuleConfig>;
  required?: Array<GraphRuleConfig>;
};

export type GraphRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type GraphsFilter = {
  /** The optional filter to get graphs managed by address */
  managedBy?: InputMaybe<ManagedBy>;
  /**
   * The optional filter to narrow graphs by search query.
   * Uses fuzzy search on graph name
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum GraphsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type GraphsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GraphsFilter>;
  /** The order by. */
  orderBy?: GraphsOrderBy;
  pageSize?: PageSize;
};

export type Group = {
  __typename?: 'Group';
  address: Scalars['EvmAddress']['output'];
  /** Returns true if the group has banning rule enabled */
  banningEnabled: Scalars['Boolean']['output'];
  feed?: Maybe<Feed>;
  /** Returns true if the group has membership approval rule enabled */
  membershipApprovalEnabled: Scalars['Boolean']['output'];
  metadata?: Maybe<GroupMetadata>;
  operations?: Maybe<LoggedInGroupOperations>;
  owner: Scalars['EvmAddress']['output'];
  rules: GroupRules;
  timestamp: Scalars['DateTime']['output'];
};

export type GroupBannedAccount = {
  __typename?: 'GroupBannedAccount';
  account: Account;
  bannedAt: Scalars['DateTime']['output'];
  bannedBy: Account;
  lastActiveAt: Scalars['DateTime']['output'];
  ruleId: Scalars['RuleId']['output'];
};

export type GroupBannedAccountsFilter = {
  /** The optional filter to narrow banned accounts by search query. */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum GroupBannedAccountsOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  FirstBanned = 'FIRST_BANNED',
  LastActive = 'LAST_ACTIVE',
  LastBanned = 'LAST_BANNED'
}

export type GroupBannedAccountsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GroupBannedAccountsFilter>;
  /** The group */
  group: Scalars['EvmAddress']['input'];
  /** The order by. */
  orderBy?: GroupBannedAccountsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type GroupFeedParams = {
  /** The feed metadata uri */
  metadataUri?: InputMaybe<Scalars['URI']['input']>;
  /** Whether replies are restricted to group members. */
  repliesRestricted?: Scalars['Boolean']['input'];
  /**
   * Rules for the feed
   * Note: Group feed has GroupGated rule set by default
   */
  rules?: InputMaybe<FeedRulesConfigInput>;
};

export type GroupGatedFeedRuleConfig = {
  /** The group one must be a member of to post. */
  group: Scalars['EvmAddress']['input'];
  /** Whether replies are restricted to group members. */
  repliesRestricted?: Scalars['Boolean']['input'];
};

export type GroupGatedGraphRuleConfig = {
  group: Scalars['EvmAddress']['input'];
};

export type GroupMember = {
  __typename?: 'GroupMember';
  account: Account;
  joinedAt: Scalars['DateTime']['output'];
  lastActiveAt: Scalars['DateTime']['output'];
};

export type GroupMembersFilter = {
  /** The optional filter to narrow members by search query. */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum GroupMembersOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  FirstJoined = 'FIRST_JOINED',
  LastActive = 'LAST_ACTIVE',
  LastJoined = 'LAST_JOINED'
}

export type GroupMembersRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GroupMembersFilter>;
  /** The group */
  group: Scalars['EvmAddress']['input'];
  /** The order by. */
  orderBy?: GroupMembersOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type GroupMembershipRequest = {
  __typename?: 'GroupMembershipRequest';
  account: Account;
  lastActiveAt: Scalars['DateTime']['output'];
  requestedAt: Scalars['DateTime']['output'];
  ruleId: Scalars['RuleId']['output'];
};

export type GroupMembershipRequestApprovedNotification = {
  __typename?: 'GroupMembershipRequestApprovedNotification';
  approvedAt: Scalars['DateTime']['output'];
  approvedBy: Account;
  group: Group;
  id: Scalars['GeneratedNotificationId']['output'];
};

export type GroupMembershipRequestRejectedNotification = {
  __typename?: 'GroupMembershipRequestRejectedNotification';
  group: Group;
  id: Scalars['GeneratedNotificationId']['output'];
  rejectedAt: Scalars['DateTime']['output'];
  rejectedBy: Account;
};

export type GroupMembershipRequestsFilter = {
  /** The optional filter to narrow members by search query. */
  searchBy?: InputMaybe<UsernameSearchInput>;
};

export enum GroupMembershipRequestsOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  FirstRequested = 'FIRST_REQUESTED',
  LastActive = 'LAST_ACTIVE',
  LastRequested = 'LAST_REQUESTED'
}

export type GroupMembershipRequestsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GroupMembershipRequestsFilter>;
  /** The group */
  group: Scalars['EvmAddress']['input'];
  /** The order by. */
  orderBy?: GroupMembershipRequestsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type GroupMention = {
  __typename?: 'GroupMention';
  /** The group that was mentioned */
  group: Scalars['EvmAddress']['output'];
  /**
   * The replacement information.
   * Use to replace mentions in the post content.
   */
  replace: MentionReplace;
};

export type GroupMetadata = {
  __typename?: 'GroupMetadata';
  coverPicture?: Maybe<Scalars['URI']['output']>;
  /** Optional markdown formatted description of the Community. */
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['URI']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** The name of the Community. */
  name: Scalars['String']['output'];
};


export type GroupMetadataCoverPictureArgs = {
  request?: MediaImageRequest;
};


export type GroupMetadataIconArgs = {
  request?: MediaImageRequest;
};

export type GroupOperationValidationFailed = {
  __typename?: 'GroupOperationValidationFailed';
  reason: Scalars['String']['output'];
  unsatisfiedRules?: Maybe<GroupUnsatisfiedRules>;
};

export type GroupOperationValidationOutcome = GroupOperationValidationFailed | GroupOperationValidationPassed | GroupOperationValidationUnknown;

export type GroupOperationValidationPassed = {
  __typename?: 'GroupOperationValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type GroupOperationValidationUnknown = {
  __typename?: 'GroupOperationValidationUnknown';
  extraChecksRequired: Array<GroupRule>;
};

export type GroupRequest = {
  /** The group */
  group?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the group with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type GroupRule = {
  __typename?: 'GroupRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  executesOn: Array<GroupRuleExecuteOn>;
  id: Scalars['RuleId']['output'];
  type: GroupRuleType;
};

export type GroupRuleConfig = {
  membershipApprovalRule?: InputMaybe<MembershipApprovalGroupRuleConfig>;
  simplePaymentRule?: InputMaybe<SimplePaymentGroupRuleConfig>;
  tokenGatedRule?: InputMaybe<TokenGatedGroupRuleConfig>;
  unknownRule?: InputMaybe<UnknownGroupRuleConfig>;
};

export enum GroupRuleExecuteOn {
  Adding = 'ADDING',
  Joining = 'JOINING',
  Leaving = 'LEAVING',
  Removing = 'REMOVING'
}

export enum GroupRuleType {
  AdditionRemovalPid = 'ADDITION_REMOVAL_PID',
  BanAccount = 'BAN_ACCOUNT',
  MembershipApproval = 'MEMBERSHIP_APPROVAL',
  SimplePayment = 'SIMPLE_PAYMENT',
  TokenGated = 'TOKEN_GATED',
  Unknown = 'UNKNOWN'
}

export enum GroupRuleUnsatisfiedReason {
  AccountBanned = 'ACCOUNT_BANNED',
  MembershipApprovalRequired = 'MEMBERSHIP_APPROVAL_REQUIRED',
  SimplePaymentNotEnoughBalance = 'SIMPLE_PAYMENT_NOT_ENOUGH_BALANCE',
  TokenGatedAccountJoiningNotATokenHolder = 'TOKEN_GATED_ACCOUNT_JOINING_NOT_A_TOKEN_HOLDER',
  TokenGatedAccountRemovalStillTokenHolder = 'TOKEN_GATED_ACCOUNT_REMOVAL_STILL_TOKEN_HOLDER'
}

export type GroupRules = {
  __typename?: 'GroupRules';
  anyOf: Array<GroupRule>;
  required: Array<GroupRule>;
};

export type GroupRulesConfigInput = {
  anyOf?: Array<GroupRuleConfig>;
  required?: Array<GroupRuleConfig>;
};

export type GroupRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type GroupStatsRequest = {
  /** The group address to check its total members. */
  group: Scalars['EvmAddress']['input'];
};

export type GroupStatsResponse = {
  __typename?: 'GroupStatsResponse';
  totalMembers: Scalars['Int']['output'];
};

export type GroupUnsatisfiedRule = {
  __typename?: 'GroupUnsatisfiedRule';
  config: Array<AnyKeyValue>;
  message: Scalars['String']['output'];
  reason: GroupRuleUnsatisfiedReason;
  rule: Scalars['EvmAddress']['output'];
};

export type GroupUnsatisfiedRules = {
  __typename?: 'GroupUnsatisfiedRules';
  anyOf: Array<GroupUnsatisfiedRule>;
  required: Array<GroupUnsatisfiedRule>;
};

export type GroupsFilter = {
  /** The optional filter to get groups managed by address */
  managedBy?: InputMaybe<ManagedBy>;
  /** The optional filter to get groups where account is a member */
  member?: InputMaybe<Scalars['EvmAddress']['input']>;
  /**
   * The optional filter to narrow groups by search query.
   * Uses fuzzy search on group name
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum GroupsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type GroupsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<GroupsFilter>;
  /** The order by. */
  orderBy?: GroupsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type HasReactedRequest = {
  type?: InputMaybe<PostReactionType>;
};

export type HeightBasedTransform = {
  height: Scalars['Int']['input'];
};

export type HideManagedAccountRequest = {
  /** The account to hide. */
  account: Scalars['EvmAddress']['input'];
};

export type HideReplyRequest = {
  post: Scalars['PostId']['input'];
};

export type ImageMetadata = {
  __typename?: 'ImageMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  image: MediaImage;
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The optional image title. */
  title?: Maybe<Scalars['String']['output']>;
};

/** The image transformation to apply to the image. */
export type ImageTransform = {
  fixedSize?: InputMaybe<FixedSizeTransform>;
  heightBased?: InputMaybe<HeightBasedTransform>;
  widthBased?: InputMaybe<WidthBasedTransform>;
};

export enum IndexingStatus {
  Failed = 'FAILED',
  Finished = 'FINISHED',
  Pending = 'PENDING'
}

export type InsufficientFunds = {
  __typename?: 'InsufficientFunds';
  reason: Scalars['String']['output'];
};

export type IntKeyValue = {
  __typename?: 'IntKeyValue';
  int: Scalars['Int']['output'];
  key: Scalars['String']['output'];
};

export type IntNullableKeyValue = {
  __typename?: 'IntNullableKeyValue';
  key: Scalars['String']['output'];
  optionalInt?: Maybe<Scalars['Int']['output']>;
};

export type IsFollowedByMeRequest = {
  graph: Scalars['EvmAddress']['input'];
};

export type IsFollowingMeRequest = {
  graph: Scalars['EvmAddress']['input'];
};

export type JoinGroupRequest = {
  /** The group you want to join */
  group: Scalars['EvmAddress']['input'];
  /** The processing params for the join rules. */
  rulesProcessingParams?: InputMaybe<Array<GroupRulesProcessingParams>>;
};

export type JoinGroupResponse = {
  __typename?: 'JoinGroupResponse';
  hash: Scalars['TxHash']['output'];
};

export type JoinGroupResult = GroupOperationValidationFailed | JoinGroupResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type KeyValuePair = {
  __typename?: 'KeyValuePair';
  /** A unique 32 bytes long hexadecimal string key. */
  key: Scalars['FixedBytes32']['output'];
  /** The human-readable name of the parameter. */
  name: Scalars['String']['output'];
  /** The human-readable ABI description of the parameter. */
  type: Scalars['String']['output'];
};

export type LastLoggedInAccountRequest = {
  /** The address to get the last logged in account for. */
  address: Scalars['EvmAddress']['input'];
  /** The app to get the last logged in account for. */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type LeaveGroupRequest = {
  /** The group you want to leave */
  group: Scalars['EvmAddress']['input'];
  /** The processing params for the leave rules. */
  rulesProcessingParams?: InputMaybe<Array<GroupRulesProcessingParams>>;
};

export type LeaveGroupResponse = {
  __typename?: 'LeaveGroupResponse';
  hash: Scalars['TxHash']['output'];
};

export type LeaveGroupResult = GroupOperationValidationFailed | LeaveGroupResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type LengthAmountPair = {
  amount: Scalars['BigDecimal']['input'];
  length: Scalars['Int']['input'];
};

export type LinkMetadata = {
  __typename?: 'LinkMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** The sharing link url. */
  sharingLink: Scalars['URI']['output'];
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type LivestreamMetadata = {
  __typename?: 'LivestreamMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  /**
   * The data cannot be changed so you can put in an API endpoint to know if it is still live or
   * not for clients to be able to check.
   */
  checkLiveApi?: Maybe<Scalars['URI']['output']>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  /** The optional stream end time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`) */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['MetadataId']['output'];
  /**
   * Some livestream platforms have the live url as a separate url. If not your case make sure
   * `liveUrl` and `playbackUrl` are the same.
   */
  liveUrl: Scalars['URI']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /**
   * Some livestream platforms have the playback url as a separate url. If not your case make
   * sure `liveUrl` and `playbackUrl` are the same.
   */
  playbackUrl: Scalars['URI']['output'];
  /** The stream start time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`). */
  startsAt: Scalars['DateTime']['output'];
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The livestream title. */
  title?: Maybe<Scalars['String']['output']>;
};

export type LoggedInAccountOperations = {
  __typename?: 'LoggedInAccountOperations';
  canBlock: Scalars['Boolean']['output'];
  /**
   * Check if the authenticated account can follow the target account.
   *
   * If a graph is not specified it defaults to using the Global Graph
   */
  canFollow: AccountFollowOperationValidationOutcome;
  canUnblock: Scalars['Boolean']['output'];
  /**
   * Check if the authenticated account can unfollow the target account.
   *
   * If a graph is not specified it defaults to using the Global Graph
   */
  canUnfollow: AccountFollowOperationValidationOutcome;
  hasBlockedMe: Scalars['Boolean']['output'];
  hasReported: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isBlockedByMe: Scalars['Boolean']['output'];
  /**
   * Check if the target account is followed by the authenticated account.
   *
   * If a graph is not specified it defaults to using the Global Graph
   */
  isFollowedByMe: Scalars['Boolean']['output'];
  /**
   * Check if the authenticated account is following the target account.
   *
   * If a graph is not specified it defaults to using the Global Graph
   */
  isFollowingMe: Scalars['Boolean']['output'];
  isMutedByMe: Scalars['Boolean']['output'];
};


export type LoggedInAccountOperationsCanFollowArgs = {
  request?: InputMaybe<CanFollowRequest>;
};


export type LoggedInAccountOperationsCanUnfollowArgs = {
  request?: InputMaybe<CanUnfollowRequest>;
};


export type LoggedInAccountOperationsIsFollowedByMeArgs = {
  request?: InputMaybe<IsFollowedByMeRequest>;
};


export type LoggedInAccountOperationsIsFollowingMeArgs = {
  request?: InputMaybe<IsFollowingMeRequest>;
};

export type LoggedInFeedPostOperations = {
  __typename?: 'LoggedInFeedPostOperations';
  canPost: FeedOperationValidationOutcome;
  id: Scalars['ID']['output'];
};

export type LoggedInGroupOperations = {
  __typename?: 'LoggedInGroupOperations';
  canAddMember: GroupOperationValidationOutcome;
  canJoin: GroupOperationValidationOutcome;
  canLeave: GroupOperationValidationOutcome;
  canRemoveMember: GroupOperationValidationOutcome;
  hasRequestedMembership: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isBanned: Scalars['Boolean']['output'];
  isMember: Scalars['Boolean']['output'];
};

export type LoggedInPostOperations = {
  __typename?: 'LoggedInPostOperations';
  canComment: PostOperationValidationOutcome;
  canDelete: PostOperationValidationOutcome;
  canEdit: PostOperationValidationOutcome;
  canQuote: PostOperationValidationOutcome;
  canRepost: PostOperationValidationOutcome;
  canSimpleCollect: SimpleCollectValidationOutcome;
  canTip: Scalars['Boolean']['output'];
  executedUnknownActionCount: Scalars['Int']['output'];
  hasBookmarked: Scalars['Boolean']['output'];
  hasCommented: BooleanValue;
  hasExecutedUnknownAction: Scalars['Boolean']['output'];
  hasQuoted: BooleanValue;
  hasReacted: Scalars['Boolean']['output'];
  hasReported: Scalars['Boolean']['output'];
  hasReposted: BooleanValue;
  hasSimpleCollected: Scalars['Boolean']['output'];
  hasTipped: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isNotInterested: Scalars['Boolean']['output'];
  lastTip?: Maybe<PostTip>;
  postTipCount: Scalars['Int']['output'];
  simpleCollectCount: Scalars['Int']['output'];
};


export type LoggedInPostOperationsExecutedUnknownActionCountArgs = {
  request: ExecutedUnknownActionRequest;
};


export type LoggedInPostOperationsHasExecutedUnknownActionArgs = {
  request: ExecutedUnknownActionRequest;
};


export type LoggedInPostOperationsHasReactedArgs = {
  request?: InputMaybe<HasReactedRequest>;
};

export type LoggedInUsernameNamespaceOperations = {
  __typename?: 'LoggedInUsernameNamespaceOperations';
  canCreate: NamespaceOperationValidationOutcome;
  id: Scalars['ID']['output'];
};

export type LoggedInUsernameOperations = {
  __typename?: 'LoggedInUsernameOperations';
  canAssign: NamespaceOperationValidationOutcome;
  canRemove: NamespaceOperationValidationOutcome;
  canUnassign: NamespaceOperationValidationOutcome;
  id: Scalars['ID']['output'];
};

export enum MainContentFocus {
  Article = 'ARTICLE',
  Audio = 'AUDIO',
  CheckingIn = 'CHECKING_IN',
  Embed = 'EMBED',
  Event = 'EVENT',
  Image = 'IMAGE',
  Link = 'LINK',
  Livestream = 'LIVESTREAM',
  Mint = 'MINT',
  ShortVideo = 'SHORT_VIDEO',
  Space = 'SPACE',
  Story = 'STORY',
  TextOnly = 'TEXT_ONLY',
  ThreeD = 'THREE_D',
  Transaction = 'TRANSACTION',
  Video = 'VIDEO'
}

export enum ManagedAccountsVisibility {
  All = 'ALL',
  HiddenOnly = 'HIDDEN_ONLY',
  NoneHidden = 'NONE_HIDDEN'
}

export type ManagedBy = {
  /** The address that is either the owner or an admin of the primitive. */
  address: Scalars['EvmAddress']['input'];
  /** Whether to include the owned primitives or just the ones the address is an admin of. */
  includeOwners?: Scalars['Boolean']['input'];
};

/** MarketplaceMetadataAttribute */
export type MarketplaceMetadataAttribute = {
  __typename?: 'MarketplaceMetadataAttribute';
  displayType?: Maybe<MarketplaceMetadataAttributeDisplayType>;
  /** The name of the trait. */
  traitType?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['MarketplaceMetadataAttributeValue']['output']>;
};

/** MarketplaceMetadataAttributeDisplayType */
export enum MarketplaceMetadataAttributeDisplayType {
  Date = 'DATE',
  Number = 'NUMBER',
  String = 'STRING'
}

export type MeResult = {
  __typename?: 'MeResult';
  /** The app the account is logged in to. */
  appLoggedIn: Scalars['EvmAddress']['output'];
  /** Whether the account is signless. */
  isSignless: Scalars['Boolean']['output'];
  /** Whether the account is sponsored. */
  isSponsored: Scalars['Boolean']['output'];
  /** The sponsorship allowance for the account. */
  limit: SponsorshipAllowance;
  /** The logged in account. */
  loggedInAs: AccountAvailable;
};

export type MediaAudio = {
  __typename?: 'MediaAudio';
  /** The name of the artist. */
  artist?: Maybe<Scalars['String']['output']>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard.
   */
  attributes: Array<MetadataAttribute>;
  cover?: Maybe<Scalars['URI']['output']>;
  /** The credits for the audio. */
  credits?: Maybe<Scalars['String']['output']>;
  /** How long the the audio is in seconds. */
  duration?: Maybe<Scalars['Int']['output']>;
  /** The genre of the audio */
  genre?: Maybe<Scalars['String']['output']>;
  /**
   * The URI of the audio. You can use the optional `request` argument to choose between
   * the original URI or a snapshotted one on CDN. Returns the snapshotted URI by default.
   */
  item: Scalars['URI']['output'];
  /** The type of audio. */
  kind?: Maybe<MediaAudioKind>;
  /** The license for the audio. */
  license?: Maybe<MetadataLicenseType>;
  /** A URI to the lyrics of the audio file. */
  lyrics?: Maybe<Scalars['URI']['output']>;
  /** The record label for the audio. */
  recordLabel?: Maybe<Scalars['String']['output']>;
  /** The mime type of the audio file. */
  type: MediaAudioType;
};


export type MediaAudioCoverArgs = {
  request?: MediaImageRequest;
};


export type MediaAudioItemArgs = {
  request?: MediaAudioRequest;
};

export enum MediaAudioKind {
  Audiobook = 'AUDIOBOOK',
  Music = 'MUSIC',
  Other = 'OTHER',
  Podcast = 'PODCAST',
  Sound = 'SOUND',
  VoiceNote = 'VOICE_NOTE'
}

export type MediaAudioRequest = {
  useOriginal: Scalars['Boolean']['input'];
};

/** The mime type of the audio file. */
export enum MediaAudioType {
  AudioAac = 'AUDIO_AAC',
  AudioFlac = 'AUDIO_FLAC',
  AudioMpeg = 'AUDIO_MPEG',
  AudioMp_4 = 'AUDIO_MP_4',
  AudioOgg = 'AUDIO_OGG',
  AudioVndWave = 'AUDIO_VND_WAVE',
  AudioWav = 'AUDIO_WAV',
  AudioWebm = 'AUDIO_WEBM'
}

export type MediaImage = {
  __typename?: 'MediaImage';
  /** The alt tag for accessibility */
  altTag?: Maybe<Scalars['String']['output']>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard.
   */
  attributes: Array<MetadataAttribute>;
  /** The height of the image. */
  height?: Maybe<Scalars['Int']['output']>;
  /**
   * The URI of the image. You can use the optional `request` argument to choose between
   * the original, snapshotted on CDN, or transformed to a different resolution. Returns the
   * snapshotted URI by default.
   */
  item: Scalars['URI']['output'];
  /** The license for the image */
  license?: Maybe<MetadataLicenseType>;
  /** The mime type of the image */
  type: MediaImageType;
  /** The width of the image. */
  width?: Maybe<Scalars['Int']['output']>;
};


export type MediaImageItemArgs = {
  request?: MediaImageRequest;
};

export type MediaImageRequest = {
  preferTransform?: InputMaybe<ImageTransform>;
  useOriginal?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * The mime type of the image
 *
 * <details><summary>JSON schema</summary>
 *
 * ```json
 * {
 * "description": "The mime type of the image",
 * "type": "string",
 * "enum": [
 * "image/bmp",
 * "image/gif",
 * "image/heic",
 * "image/jpeg",
 * "image/png",
 * "image/svg+xml",
 * "image/tiff",
 * "image/webp",
 * "image/x-ms-bmp"
 * ]
 * }
 * ```
 * </details>
 */
export enum MediaImageType {
  Bmp = 'BMP',
  Gif = 'GIF',
  Heic = 'HEIC',
  Jpeg = 'JPEG',
  Png = 'PNG',
  SvgXml = 'SVG_XML',
  Tiff = 'TIFF',
  Webp = 'WEBP',
  XMsBmp = 'X_MS_BMP'
}

export type MediaSnapshotNotificationAttributes = {
  source?: InputMaybe<PrimitiveId>;
};

export type MediaVideo = {
  __typename?: 'MediaVideo';
  /** The alt tag for accessibility */
  altTag?: Maybe<Scalars['String']['output']>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard.
   */
  attributes: Array<MetadataAttribute>;
  cover?: Maybe<Scalars['URI']['output']>;
  /** How long the the video is in seconds */
  duration?: Maybe<Scalars['Int']['output']>;
  item: Scalars['URI']['output'];
  /** The license for the video */
  license?: Maybe<MetadataLicenseType>;
  /** The mime type of the video */
  type: MediaVideoType;
};


export type MediaVideoCoverArgs = {
  request?: MediaImageRequest;
};


export type MediaVideoItemArgs = {
  request?: MediaVideoRequest;
};

export type MediaVideoRequest = {
  /** Set to `true` to get the original URI of the video. */
  useOriginal: Scalars['Boolean']['input'];
};

/**
 * The mime type of the video
 *
 * <details><summary>JSON schema</summary>
 *
 * ```json
 * {
 * "description": "The mime type of the video",
 * "type": "string",
 * "enum": [
 * "model/gltf+json",
 * "model/gltf-binary",
 * "video/x-m4v",
 * "video/mov",
 * "video/mp4",
 * "video/mpeg",
 * "video/ogg",
 * "video/ogv",
 * "video/quicktime",
 * "video/webm"
 * ]
 * }
 * ```
 * </details>
 */
export enum MediaVideoType {
  ModelGltfBinary = 'MODEL_GLTF_BINARY',
  ModelGltfJson = 'MODEL_GLTF_JSON',
  VideoMov = 'VIDEO_MOV',
  VideoMpeg = 'VIDEO_MPEG',
  VideoMp_4 = 'VIDEO_MP_4',
  VideoOgg = 'VIDEO_OGG',
  VideoOgv = 'VIDEO_OGV',
  VideoQuicktime = 'VIDEO_QUICKTIME',
  VideoWebm = 'VIDEO_WEBM',
  VideoXm_4V = 'VIDEO_XM_4V'
}

export type MembershipApprovalGroupRuleConfig = {
  enable?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export type MentionNotification = {
  __typename?: 'MentionNotification';
  id: Scalars['GeneratedNotificationId']['output'];
  post: Post;
};

export type MentionReplace = {
  __typename?: 'MentionReplace';
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type MetadataAttribute = {
  __typename?: 'MetadataAttribute';
  key: Scalars['String']['output'];
  type: MetadataAttributeType;
  value: Scalars['String']['output'];
};

export enum MetadataAttributeType {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Json = 'JSON',
  Number = 'NUMBER',
  String = 'STRING'
}

export enum MetadataLicenseType {
  Cco = 'CCO',
  CcBy = 'CC_BY',
  CcByNc = 'CC_BY_NC',
  CcByNd = 'CC_BY_ND',
  TbnlCdNplLedger = 'TBNL_CD_NPL_LEDGER',
  TbnlCdNplLegal = 'TBNL_CD_NPL_LEGAL',
  TbnlCdPlLedger = 'TBNL_CD_PL_LEDGER',
  TbnlCdPlLegal = 'TBNL_CD_PL_LEGAL',
  TbnlCDtsaNplLedger = 'TBNL_C_DTSA_NPL_LEDGER',
  TbnlCDtsaNplLegal = 'TBNL_C_DTSA_NPL_LEGAL',
  TbnlCDtsaPlLedger = 'TBNL_C_DTSA_PL_LEDGER',
  TbnlCDtsaPlLegal = 'TBNL_C_DTSA_PL_LEGAL',
  TbnlCDtNplLedger = 'TBNL_C_DT_NPL_LEDGER',
  TbnlCDtNplLegal = 'TBNL_C_DT_NPL_LEGAL',
  TbnlCDtPlLedger = 'TBNL_C_DT_PL_LEDGER',
  TbnlCDtPlLegal = 'TBNL_C_DT_PL_LEGAL',
  TbnlCNdNplLedger = 'TBNL_C_ND_NPL_LEDGER',
  TbnlCNdNplLegal = 'TBNL_C_ND_NPL_LEGAL',
  TbnlCNdPlLedger = 'TBNL_C_ND_PL_LEDGER',
  TbnlCNdPlLegal = 'TBNL_C_ND_PL_LEGAL',
  TbnlNcDtsaNplLedger = 'TBNL_NC_DTSA_NPL_LEDGER',
  TbnlNcDtsaNplLegal = 'TBNL_NC_DTSA_NPL_LEGAL',
  TbnlNcDtsaPlLedger = 'TBNL_NC_DTSA_PL_LEDGER',
  TbnlNcDtsaPlLegal = 'TBNL_NC_DTSA_PL_LEGAL',
  TbnlNcDtNplLedger = 'TBNL_NC_DT_NPL_LEDGER',
  TbnlNcDtNplLegal = 'TBNL_NC_DT_NPL_LEGAL',
  TbnlNcDtPlLedger = 'TBNL_NC_DT_PL_LEDGER',
  TbnlNcDtPlLegal = 'TBNL_NC_DT_PL_LEGAL',
  TbnlNcDNplLedger = 'TBNL_NC_D_NPL_LEDGER',
  TbnlNcDNplLegal = 'TBNL_NC_D_NPL_LEGAL',
  TbnlNcDPlLedger = 'TBNL_NC_D_PL_LEDGER',
  TbnlNcDPlLegal = 'TBNL_NC_D_PL_LEGAL',
  TbnlNcNdNplLedger = 'TBNL_NC_ND_NPL_LEDGER',
  TbnlNcNdNplLegal = 'TBNL_NC_ND_NPL_LEGAL',
  TbnlNcNdPlLedger = 'TBNL_NC_ND_PL_LEDGER',
  TbnlNcNdPlLegal = 'TBNL_NC_ND_PL_LEGAL'
}

export type MetadataSnapshotNotificationAttributes = {
  source?: InputMaybe<PrimitiveId>;
};

export type MintMetadata = {
  __typename?: 'MintMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** The mint item it can be a URL of the known provider like opensea https://opensea.io/assets/ethereum/0xfaa2471e93bd1cee3b0ab381c242ada8e1d1a759/299 or https://zora.co/collect/0x9d90669665607f08005cae4a7098143f554c59ef/39626. The Lens API has an allow list of providers and if the domain does not match it will mark it as failed metadata */
  mintLink: Scalars['URI']['output'];
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type MlinternalAccountRecommendationsRequest = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  secret: Scalars['String']['input'];
};

export type MlinternalForYouRequest = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  secret: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Add an account manager to the authenticated account.
   *
   * You MUST be authenticated as Account Owner to use this mutation.
   */
  addAccountManager: AddAccountManagerResult;
  /**
   * Add admins to a graph/app/sponsor/feed/username/group.
   *
   * You MUST be authenticated as Builder, Account Manager, or Account Owner.
   * In case of Account Manager or Account Owner, the Lens Account needs to be the owner or an
   * admin of the primitive.
   */
  addAdmins: AddAdminsResult;
  /**
   * Add an app authorization endpoint.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  addAppAuthorizationEndpoint: Scalars['Void']['output'];
  /**
   * Add feeds to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  addAppFeeds: AddAppFeedsResult;
  /**
   * Add groups to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  addAppGroups: AddAppGroupsResult;
  /**
   * Add signers to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  addAppSigners: AddAppSignersResult;
  /**
   * Add a post not interested.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  addPostNotInterested: Scalars['Void']['output'];
  /**
   * React to a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  addReaction: AddReactionResult;
  /**
   * Approve group members
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  approveGroupMembershipRequests: ApproveGroupMembershipResult;
  /**
   * Assign a username to an account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  assignUsernameToAccount: AssignUsernameToAccountResult;
  /** Authenticate the user with the signed authentication challenge. */
  authenticate: AuthenticationResult;
  /**
   * Ban accounts to join a group.
   * If the banned account(s) already joined the group, they will be removed from the group.
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  banGroupAccounts: BanGroupAccountsResult;
  /**
   * Block an account with the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  block: BlockResult;
  /**
   * Bookmark a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  bookmarkPost: Scalars['Void']['output'];
  /**
   * Cancel group membership request
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  cancelGroupMembershipRequest: CancelGroupMembershipRequestResult;
  /**
   * Generates a new authentication challenge for the specified address and app.
   *
   * Users must sign the challenge to authenticate.
   *
   * The issued challenge can be for authentication credentials for different roles:
   * - AccountOwner: The `address` is a Lens Account, and the `signed_by` is the Account Owner.
   * - AccountManager: The `address` is a Lens Account, and the `signed_by` is an Account Manager
   * for it.
   * - OnboardingUser: The `address` is an EOA that needs to create their Lens Account.
   * - Builder: The `address` is the EOA of a Builder that needs to use configuration and
   * management features.
   *
   * The HTTP Origin header MUST be present and match the app's domain.
   */
  challenge: AuthenticationChallenge;
  /**
   * Configure the given account action for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  configureAccountAction: ConfigureAccountActionResult;
  /**
   * Configure the given post action for the given post.
   *
   * You MUST be authenticated as Account Owner or Account Manager of the Account
   * that authored this Post to use this mutation.
   */
  configurePostAction: ConfigurePostActionResult;
  /**
   * Create an account with a given username.
   *
   * You MUST be authenticated to use this mutation.
   */
  createAccountWithUsername: CreateAccountWithUsernameResult;
  /**
   * Create a new app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  createApp: CreateAppResult;
  /**
   * Create a new feed
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  createFeed: CreateFeedResult;
  /**
   * Create a new graph
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  createGraph: CreateGraphResult;
  /**
   * Create a new group
   *
   * You MUST be authenticated as Builder, Account Manager, or Account Owner.
   * In case of Account Manager or Account Owner, the Lens Account becomes the owner of the
   * group.
   */
  createGroup: CreateGroupResult;
  createSnsSubscriptions: Array<SnsSubscription>;
  /**
   * Create a new sponsorship.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  createSponsorship: CreateSponsorshipResult;
  /**
   * Create a username.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  createUsername: CreateUsernameResult;
  /**
   * Create a new username namespace aka deploying a new username contract
   *
   * You MUST be authenticated to use this mutation.
   */
  createUsernameNamespace: CreateUsernameNamespaceResult;
  /**
   * Delete a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  deletePost: DeletePostResult;
  deleteSnsSubscription: Scalars['Void']['output'];
  /**
   * Creates a deposit transaction request for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation
   */
  deposit: DepositResult;
  /**
   * Set the given account action for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  disableAccountAction: DisableAccountActionResult;
  /**
   * Disable the given post action for the given post.
   *
   * You MUST be authenticated as the Owner or Manager of the account that made this post to use
   * this mutation.
   */
  disablePostAction: DisablePostActionResult;
  /**
   * Edit a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  editPost: PostResult;
  /**
   * Set the given account action for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  enableAccountAction: EnableAccountActionResult;
  /**
   * Enable the given post action for the authenticated post.
   *
   * You MUST be authenticated as Account Owner or Account Manager of the Account
   * that authored this Post to use this mutation.
   */
  enablePostAction: EnablePostActionResult;
  /**
   * Enables Signless experience for the authenticated account.
   *
   * You MUST be authenticated as Account Owner to use this mutation.
   */
  enableSignless: EnableSignlessResult;
  /**
   * Execute the given account action for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  executeAccountAction: ExecuteAccountActionResult;
  /**
   * Execute the given post action.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  executePostAction: ExecutePostActionResult;
  /**
   * Follow an Account on the global Graph or a specific Graph.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  follow: FollowResult;
  /**
   * Generate a new app server side api key
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  generateNewAppServerApiKey: Scalars['ServerAPIKey']['output'];
  /**
   * Hides an account from the manager list of managed accounts.
   *
   * You MUST be authenticated as Account Manager to use this mutation.
   */
  hideManagedAccount: Scalars['Void']['output'];
  hideReply: Scalars['Void']['output'];
  /**
   * Join a group
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  joinGroup: JoinGroupResult;
  /**
   * Leave a group
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  leaveGroup: LeaveGroupResult;
  /**
   * Issue new authentication tokens from a valid Lens API v2 refresh token.
   *
   * Use this to seamlessly transition your users from Lens API v2 to Lens API v3 without
   * requiring them to re-authenticate.
   *
   * The HTTP Origin header MUST be present and match the app's domain.
   */
  legacyRolloverRefresh: RefreshResult;
  mlAccountRecommendationsInternal: Scalars['Void']['output'];
  mlDismissRecommendedAccounts: Scalars['Void']['output'];
  mlForYouInternal: Scalars['Void']['output'];
  /**
   * Mute an account for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  mute: Scalars['Void']['output'];
  /**
   * Pause a sponsorship.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  pauseSponsorship: PausingResult;
  /**
   * Create a new post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  post: PostResult;
  /**
   * Recommend an account from the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  recommendAccount: Scalars['Void']['output'];
  /** Refreshes the authentication tokens. */
  refresh: RefreshResult;
  /** Refreshes the metadata for the provided entity. */
  refreshMetadata: RefreshMetadataResult;
  /**
   * Reject group membership requests
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  rejectGroupMembershipRequests: RejectGroupMembershipResult;
  /**
   * Remove an account manager to the authenticated account.
   *
   * You MUST be authenticated as Account Owner to use this mutation.
   */
  removeAccountManager: RemoveAccountManagerResult;
  /**
   * Remove admins from a graph/app/sponsor/feed/username/group.
   *
   * You MUST be authenticated as Builder, Account Manager, or Account Owner.
   * In case of Account Manager or Account Owner, the Lens Account needs to be the owner or an
   * admin of the primitive.
   */
  removeAdmins: RemoveAdminsResult;
  /**
   * Remove an app authorization endpoint.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  removeAppAuthorizationEndpoint: Scalars['Void']['output'];
  /**
   * Remove feeds to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  removeAppFeeds: RemoveAppFeedsResult;
  /**
   * Remove groups to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  removeAppGroups: RemoveAppGroupsResult;
  /**
   * Remove signers to an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  removeAppSigners: RemoveAppSignersResult;
  /**
   * Remove group members
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  removeGroupMembers: RemoveGroupMembersResult;
  /**
   * Remove Signless experience for the authenticated account.
   *
   * You MUST be authenticated as Account Owner to use this mutation.
   */
  removeSignless: RemoveSignlessResult;
  /**
   * Report an account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  reportAccount: Scalars['Void']['output'];
  /**
   * Report a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  reportPost: Scalars['Void']['output'];
  /**
   * Repost a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  repost: PostResult;
  /**
   * Request to join a group
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  requestGroupMembership: RequestGroupMembershipResult;
  /**
   * Revoke an authentication.
   *
   * You MUST be authenticated to use this mutation.
   */
  revokeAuthentication: Scalars['Void']['output'];
  /**
   * Set the metadata for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  setAccountMetadata: SetAccountMetadataResult;
  /**
   * Set graph for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppGraph: SetAppGraphResult;
  /**
   * Set metadata for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppMetadata: SetAppMetadataResult;
  /**
   * Set sponsorship for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppSponsorship: SetAppSponsorshipResult;
  /**
   * Set treasury for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppTreasury: SetAppTreasuryResult;
  /**
   * Set username namespace for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppUsernameNamespace: SetAppUsernameNamespaceResult;
  /**
   * Set if the app verification is enabled
   * App needs to have authorization endpoint enabled
   * App needs to return `verification_endpoint` from the authorization endpoint
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setAppVerification: SetAppVerificationResult;
  /**
   * Set default feed for an app
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setDefaultAppFeed: SetDefaultAppFeedResult;
  /**
   * Set metadata for a feed
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the feed
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the feed
   */
  setFeedMetadata: SetFeedMetadataResult;
  /**
   * Set metadata for a graph
   *
   * You MUST be authenticated to use this mutation.
   */
  setGraphMetadata: SetGraphMetadataResult;
  /**
   * Set metadata for a group
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  setGroupMetadata: SetGroupMetadataResult;
  /**
   * Set metadata for a namespace
   *
   * You MUST be authenticated to use this mutation.
   */
  setNamespaceMetadata: SetNamespaceMetadataResult;
  /**
   * Set metadata for a sponsorship
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  setSponsorshipMetadata: SetSponsorshipMetadataResult;
  /**
   * sign a frame action with the lens account manager
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  signFrameAction: FrameLensManagerSignatureResult;
  /** You MUST be authenticated as Account Owner or Account Manager to use this mutation. */
  switchAccount: SwitchAccountResult;
  /**
   * Transfer primitive ownership for the graph/app/sponsor/feed/username/group.
   *
   * You MUST be authenticated as Builder, Account Manager, or Account Owner.
   * In case of Account Manager or Account Owner, the Lens Account needs to be the owner of the
   * primitive.
   */
  transferPrimitiveOwnership: TransferPrimitiveOwnershipResult;
  /**
   * Unassign a username from the logged-in user's Account.
   *
   * Defaults to the Lens namespace if no request is provided.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  unassignUsernameFromAccount: UnassignUsernameToAccountResult;
  /**
   * Unban accounts
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  unbanGroupAccounts: UnbanGroupAccountsResult;
  /**
   * Unblock an account with the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  unblock: UnblockResult;
  /**
   * Undo bookmark.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  undoBookmarkPost: Scalars['Void']['output'];
  /**
   * Undo a post not interested.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  undoPostNotInterested: Scalars['Void']['output'];
  /**
   * Undo reaction to a post.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  undoReaction: UndoReactionResult;
  /**
   * Undo recommended account from the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  undoRecommendedAccount: Scalars['Void']['output'];
  /**
   * Unfollow an Account on the global Graph or a specific Graph.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  unfollow: UnfollowResult;
  /**
   * Undo the hiding of an account from the manager list of managed accounts.
   *
   * You MUST be authenticated as Account Manager to use this mutation.
   */
  unhideManagedAccount: Scalars['Void']['output'];
  unhideReply: Scalars['Void']['output'];
  /**
   * Unmute an account for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  unmute: Scalars['Void']['output'];
  /**
   * Unpause a sponsorship.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  unpauseSponsorship: PausingResult;
  /**
   * Creates an unwrap transaction request to convert wrapped tokens held in the authenticated
   * Lens Account to their unwrapped version. For example:
   * - Mainnet: WGHO -> GHO
   * - Testnet: WGRASS -> GRASS
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation
   */
  unwrapTokens: UnwrapTokensResult;
  /**
   * Update account follow rules
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  updateAccountFollowRules: UpdateAccountFollowRulesResult;
  /**
   * Update the Account Manager Permissions for a given Account Manager.
   *
   * You MUST be authenticated as Account Owner to use this mutation.
   */
  updateAccountManager: UpdateAccountManagerResult;
  /**
   * Update feed rules
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the feed
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the feed
   */
  updateFeedRules: UpdateFeedRulesResult;
  /**
   * Update graph rules
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  updateGraphRules: UpdateGraphRulesResult;
  /**
   * Update group rules
   *
   * You MUST be authenticated as:
   * - Builder and be the owner/admin of the group
   * - Account Manager or Account Owner for a Lens Account that is the owner/admin of the group
   */
  updateGroupRules: UpdateGroupRulesResult;
  /**
   * Update namespace rules
   *
   * You MUST be authenticated to use this mutation.
   */
  updateNamespaceRules: UpdateNamespaceRulesResult;
  /**
   * Update post rules
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation.
   */
  updatePostRules: UpdatePostRulesResult;
  /**
   * Update reserved usernames
   *
   * You MUST be authenticated to use this mutation.
   */
  updateReservedUsernames: UpdateReservedUsernamesResult;
  /**
   * Update a sponsorship exclusion list from the rate limits.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  updateSponsorshipExclusionList: UpdateSponsorshipExclusionListResult;
  /**
   * Update a sponsorship rate limits.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  updateSponsorshipLimits: UpdateSponsorshipLimitsResult;
  /**
   * Update a sponsorship signers list.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  updateSponsorshipSigners: UpdateSponsorshipSignersResult;
  /**
   * Creates a withdrawal transaction request for the authenticated account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation
   */
  withdraw: WithdrawResult;
  /**
   * Creates a wrap transaction request to convert tokens held in the authenticated Lens Account
   * to their ERC20 equivalent. For example:
   * - Mainnet: GHO -> WGHO
   * - Testnet: GRASS -> WGRASS
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this mutation
   */
  wrapTokens: WrapTokensResult;
};


export type MutationAddAccountManagerArgs = {
  request: AddAccountManagerRequest;
};


export type MutationAddAdminsArgs = {
  request: AddAdminsRequest;
};


export type MutationAddAppAuthorizationEndpointArgs = {
  request: AddAppAuthorizationEndpointRequest;
};


export type MutationAddAppFeedsArgs = {
  request: AddAppFeedsRequest;
};


export type MutationAddAppGroupsArgs = {
  request: AddAppGroupsRequest;
};


export type MutationAddAppSignersArgs = {
  request: AddAppSignersRequest;
};


export type MutationAddPostNotInterestedArgs = {
  request: PostNotInterestedRequest;
};


export type MutationAddReactionArgs = {
  request: AddReactionRequest;
};


export type MutationApproveGroupMembershipRequestsArgs = {
  request: ApproveGroupMembershipRequest;
};


export type MutationAssignUsernameToAccountArgs = {
  request: AssignUsernameToAccountRequest;
};


export type MutationAuthenticateArgs = {
  request: SignedAuthChallenge;
};


export type MutationBanGroupAccountsArgs = {
  request: BanGroupAccountsRequest;
};


export type MutationBlockArgs = {
  request: BlockRequest;
};


export type MutationBookmarkPostArgs = {
  request: BookmarkPostRequest;
};


export type MutationCancelGroupMembershipRequestArgs = {
  request: CancelGroupMembershipRequestRequest;
};


export type MutationChallengeArgs = {
  request: ChallengeRequest;
};


export type MutationConfigureAccountActionArgs = {
  request: ConfigureAccountActionRequest;
};


export type MutationConfigurePostActionArgs = {
  request: ConfigurePostActionRequest;
};


export type MutationCreateAccountWithUsernameArgs = {
  request: CreateAccountWithUsernameRequest;
};


export type MutationCreateAppArgs = {
  request: CreateAppRequest;
};


export type MutationCreateFeedArgs = {
  request: CreateFeedRequest;
};


export type MutationCreateGraphArgs = {
  request: CreateGraphRequest;
};


export type MutationCreateGroupArgs = {
  request: CreateGroupRequest;
};


export type MutationCreateSnsSubscriptionsArgs = {
  request: CreateSnsSubscriptionRequest;
};


export type MutationCreateSponsorshipArgs = {
  request: CreateSponsorshipRequest;
};


export type MutationCreateUsernameArgs = {
  request: CreateUsernameRequest;
};


export type MutationCreateUsernameNamespaceArgs = {
  request: CreateUsernameNamespaceRequest;
};


export type MutationDeletePostArgs = {
  request: DeletePostRequest;
};


export type MutationDeleteSnsSubscriptionArgs = {
  request: DeleteSnsSubscriptionRequest;
};


export type MutationDepositArgs = {
  request: DepositRequest;
};


export type MutationDisableAccountActionArgs = {
  request: DisableAccountActionRequest;
};


export type MutationDisablePostActionArgs = {
  request: DisablePostActionRequest;
};


export type MutationEditPostArgs = {
  request: EditPostRequest;
};


export type MutationEnableAccountActionArgs = {
  request: EnableAccountActionRequest;
};


export type MutationEnablePostActionArgs = {
  request: EnablePostActionRequest;
};


export type MutationExecuteAccountActionArgs = {
  request: ExecuteAccountActionRequest;
};


export type MutationExecutePostActionArgs = {
  request: ExecutePostActionRequest;
};


export type MutationFollowArgs = {
  request: CreateFollowRequest;
};


export type MutationGenerateNewAppServerApiKeyArgs = {
  request: GenerateNewAppServerApiKeyRequest;
};


export type MutationHideManagedAccountArgs = {
  request: HideManagedAccountRequest;
};


export type MutationHideReplyArgs = {
  request: HideReplyRequest;
};


export type MutationJoinGroupArgs = {
  request: JoinGroupRequest;
};


export type MutationLeaveGroupArgs = {
  request: LeaveGroupRequest;
};


export type MutationLegacyRolloverRefreshArgs = {
  request: RolloverRefreshRequest;
};


export type MutationMlAccountRecommendationsInternalArgs = {
  request: MlinternalAccountRecommendationsRequest;
};


export type MutationMlDismissRecommendedAccountsArgs = {
  request: DismissRecommendedAccountsRequest;
};


export type MutationMlForYouInternalArgs = {
  request: MlinternalForYouRequest;
};


export type MutationMuteArgs = {
  request: MuteRequest;
};


export type MutationPauseSponsorshipArgs = {
  request: PausingRequest;
};


export type MutationPostArgs = {
  request: CreatePostRequest;
};


export type MutationRecommendAccountArgs = {
  request: RecommendAccount;
};


export type MutationRefreshArgs = {
  request: RefreshRequest;
};


export type MutationRefreshMetadataArgs = {
  request: RefreshMetadataRequest;
};


export type MutationRejectGroupMembershipRequestsArgs = {
  request: RejectGroupMembershipRequest;
};


export type MutationRemoveAccountManagerArgs = {
  request: RemoveAccountManagerRequest;
};


export type MutationRemoveAdminsArgs = {
  request: RemoveAdminsRequest;
};


export type MutationRemoveAppAuthorizationEndpointArgs = {
  request: RemoveAppAuthorizationEndpointRequest;
};


export type MutationRemoveAppFeedsArgs = {
  request: RemoveAppFeedsRequest;
};


export type MutationRemoveAppGroupsArgs = {
  request: RemoveAppGroupsRequest;
};


export type MutationRemoveAppSignersArgs = {
  request: RemoveAppSignersRequest;
};


export type MutationRemoveGroupMembersArgs = {
  request: RemoveGroupMembersRequest;
};


export type MutationReportAccountArgs = {
  request: ReportAccountRequest;
};


export type MutationReportPostArgs = {
  request: ReportPostRequest;
};


export type MutationRepostArgs = {
  request: CreateRepostRequest;
};


export type MutationRequestGroupMembershipArgs = {
  request: RequestGroupMembershipRequest;
};


export type MutationRevokeAuthenticationArgs = {
  request: RevokeAuthenticationRequest;
};


export type MutationSetAccountMetadataArgs = {
  request: SetAccountMetadataRequest;
};


export type MutationSetAppGraphArgs = {
  request: SetAppGraphRequest;
};


export type MutationSetAppMetadataArgs = {
  request: SetAppMetadataRequest;
};


export type MutationSetAppSponsorshipArgs = {
  request: SetAppSponsorshipRequest;
};


export type MutationSetAppTreasuryArgs = {
  request: SetAppTreasuryRequest;
};


export type MutationSetAppUsernameNamespaceArgs = {
  request: SetAppUsernameNamespaceRequest;
};


export type MutationSetAppVerificationArgs = {
  request: SetAppVerificationRequest;
};


export type MutationSetDefaultAppFeedArgs = {
  request: SetDefaultAppFeedRequest;
};


export type MutationSetFeedMetadataArgs = {
  request: SetFeedMetadataRequest;
};


export type MutationSetGraphMetadataArgs = {
  request: SetGraphMetadataRequest;
};


export type MutationSetGroupMetadataArgs = {
  request: SetGroupMetadataRequest;
};


export type MutationSetNamespaceMetadataArgs = {
  request: SetNamespaceMetadataRequest;
};


export type MutationSetSponsorshipMetadataArgs = {
  request: SetSponsorshipMetadataRequest;
};


export type MutationSignFrameActionArgs = {
  request: FrameEip712Request;
};


export type MutationSwitchAccountArgs = {
  request: SwitchAccountRequest;
};


export type MutationTransferPrimitiveOwnershipArgs = {
  request: TransferPrimitiveOwnershipRequest;
};


export type MutationUnassignUsernameFromAccountArgs = {
  request: UnassignUsernameFromAccountRequest;
};


export type MutationUnbanGroupAccountsArgs = {
  request: UnbanGroupAccountsRequest;
};


export type MutationUnblockArgs = {
  request: UnblockRequest;
};


export type MutationUndoBookmarkPostArgs = {
  request: BookmarkPostRequest;
};


export type MutationUndoPostNotInterestedArgs = {
  request: PostNotInterestedRequest;
};


export type MutationUndoReactionArgs = {
  request: UndoReactionRequest;
};


export type MutationUndoRecommendedAccountArgs = {
  request: UndoRecommendedAccount;
};


export type MutationUnfollowArgs = {
  request: CreateUnfollowRequest;
};


export type MutationUnhideManagedAccountArgs = {
  request: UnhideManagedAccountRequest;
};


export type MutationUnhideReplyArgs = {
  request: UnhideReplyRequest;
};


export type MutationUnmuteArgs = {
  request: MuteRequest;
};


export type MutationUnpauseSponsorshipArgs = {
  request: PausingRequest;
};


export type MutationUnwrapTokensArgs = {
  request: UnwrapTokensRequest;
};


export type MutationUpdateAccountFollowRulesArgs = {
  request: UpdateAccountFollowRulesRequest;
};


export type MutationUpdateAccountManagerArgs = {
  request: UpdateAccountManagerRequest;
};


export type MutationUpdateFeedRulesArgs = {
  request: UpdateFeedRulesRequest;
};


export type MutationUpdateGraphRulesArgs = {
  request: UpdateGraphRulesRequest;
};


export type MutationUpdateGroupRulesArgs = {
  request: UpdateGroupRulesRequest;
};


export type MutationUpdateNamespaceRulesArgs = {
  request: UpdateNamespaceRulesRequest;
};


export type MutationUpdatePostRulesArgs = {
  request: UpdatePostRulesRequest;
};


export type MutationUpdateReservedUsernamesArgs = {
  request: UpdateReservedUsernamesRequest;
};


export type MutationUpdateSponsorshipExclusionListArgs = {
  request: UpdateSponsorshipExclusionListRequest;
};


export type MutationUpdateSponsorshipLimitsArgs = {
  request: UpdateSponsorshipLimitsRequest;
};


export type MutationUpdateSponsorshipSignersArgs = {
  request: UpdateSponsorshipSignersRequest;
};


export type MutationWithdrawArgs = {
  request: WithdrawRequest;
};


export type MutationWrapTokensArgs = {
  request: WrapTokensRequest;
};

export type MuteRequest = {
  /** The account to mute. */
  account: Scalars['EvmAddress']['input'];
};

export type NamespaceOperationValidationFailed = {
  __typename?: 'NamespaceOperationValidationFailed';
  reason: Scalars['String']['output'];
  unsatisfiedRules?: Maybe<NamespaceUnsatisfiedRules>;
};

export type NamespaceOperationValidationOutcome = NamespaceOperationValidationFailed | NamespaceOperationValidationPassed | NamespaceOperationValidationUnknown;

export type NamespaceOperationValidationPassed = {
  __typename?: 'NamespaceOperationValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type NamespaceOperationValidationUnknown = {
  __typename?: 'NamespaceOperationValidationUnknown';
  extraChecksRequired: Array<NamespaceRule>;
};

export type NamespaceRequest = {
  /** The namespace */
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the namespace with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type NamespaceReservedUsernamesRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The namespace to get reserved usernames for */
  namespace: Scalars['EvmAddress']['input'];
  /** The page size. */
  pageSize?: PageSize;
};

export type NamespaceRule = {
  __typename?: 'NamespaceRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  executesOn: Array<NamespaceRuleExecuteOn>;
  id: Scalars['RuleId']['output'];
  type: NamespaceRuleType;
};

export type NamespaceRuleConfig = {
  tokenGatedRule?: InputMaybe<TokenGatedNamespaceRuleConfig>;
  unknownRule?: InputMaybe<UnknownNamespaceRuleConfig>;
  usernameLengthRule?: InputMaybe<UsernameLengthNamespaceRuleConfig>;
  usernamePricePerLengthRule?: InputMaybe<UsernamePricePerLengthNamespaceRuleConfig>;
};

export enum NamespaceRuleExecuteOn {
  Assigning = 'ASSIGNING',
  Creating = 'CREATING',
  Removing = 'REMOVING',
  Unassigning = 'UNASSIGNING'
}

export enum NamespaceRuleType {
  PricePerLength = 'PRICE_PER_LENGTH',
  TokenGated = 'TOKEN_GATED',
  Unknown = 'UNKNOWN',
  UsernameLength = 'USERNAME_LENGTH',
  UsernameReserved = 'USERNAME_RESERVED',
  UsernameSimpleCharset = 'USERNAME_SIMPLE_CHARSET'
}

export enum NamespaceRuleUnsatisfiedReason {
  TokenGatedNotATokenHolder = 'TOKEN_GATED_NOT_A_TOKEN_HOLDER',
  UsernameLengthNotWithinRange = 'USERNAME_LENGTH_NOT_WITHIN_RANGE',
  UsernameNotASimpleCharset = 'USERNAME_NOT_A_SIMPLE_CHARSET',
  UsernamePricePerLengthNotEnoughBalance = 'USERNAME_PRICE_PER_LENGTH_NOT_ENOUGH_BALANCE',
  UsernameReserved = 'USERNAME_RESERVED'
}

export type NamespaceRules = {
  __typename?: 'NamespaceRules';
  anyOf: Array<NamespaceRule>;
  required: Array<NamespaceRule>;
};

export type NamespaceRulesConfigInput = {
  anyOf?: Array<NamespaceRuleConfig>;
  required?: Array<NamespaceRuleConfig>;
};

export type NamespaceRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type NamespaceUnsatisfiedRule = {
  __typename?: 'NamespaceUnsatisfiedRule';
  config: Array<AnyKeyValue>;
  message: Scalars['String']['output'];
  reason: NamespaceRuleUnsatisfiedReason;
  rule: Scalars['EvmAddress']['output'];
};

export type NamespaceUnsatisfiedRules = {
  __typename?: 'NamespaceUnsatisfiedRules';
  anyOf: Array<NamespaceUnsatisfiedRule>;
  required: Array<NamespaceUnsatisfiedRule>;
};

export type NamespacesFilter = {
  /** The optional filter to get namespaces managed by address */
  managedBy?: InputMaybe<ManagedBy>;
  /**
   * The optional filter to narrow namespaces by search query.
   * Uses fuzzy search on namespace name
   */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export enum NamespacesOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type NamespacesRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<NamespacesFilter>;
  /** The order by. */
  orderBy?: NamespacesOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type NamespacesResult = {
  __typename?: 'NamespacesResult';
  items: Array<UsernameNamespace>;
  pageInfo: PaginatedResultInfo;
};

export type NativeAmount = {
  __typename?: 'NativeAmount';
  /** The native token info. */
  asset: NativeToken;
  /** Token value in its main unit (e.g., 1.5 GHO). */
  value: Scalars['BigDecimal']['output'];
};

/** A failure to retrieve the balance of the native token. */
export type NativeBalanceError = {
  __typename?: 'NativeBalanceError';
  /** The reason for the failure. */
  reason: Scalars['String']['output'];
};

export type NativeToken = {
  __typename?: 'NativeToken';
  /** The number of decimals the token uses. */
  decimals: Scalars['Int']['output'];
  /** The name of the token. */
  name: Scalars['String']['output'];
  /** The symbol of the token. */
  symbol: Scalars['String']['output'];
};

export type NetworkAddress = {
  __typename?: 'NetworkAddress';
  address: Scalars['EvmAddress']['output'];
  chainId: Scalars['Int']['output'];
};

export type NftMetadata = {
  __typename?: 'NftMetadata';
  /**
   * A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4,
   * M4V, OGV, and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.
   * Animation_url also supports HTML pages, allowing you to build rich experiences and
   * interactive NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths
   * within the HTML page are now supported. However, access to browser extensions is not
   * supported.
   */
  animationUrl?: Maybe<Scalars['URI']['output']>;
  /**
   * These are the attributes for the item, which will show up on the OpenSea and others NFT
   * trading websites on the item.
   */
  attributes: Array<MarketplaceMetadataAttribute>;
  /** A human-readable description of the item. It could be plain text or markdown. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * This is the URL that will appear below the asset's image on OpenSea and others etc. and
   * will allow users to leave OpenSea and view the item on the site.
   */
  externalUrl?: Maybe<Scalars['URI']['output']>;
  /** NFT will store any image here. */
  image?: Maybe<Scalars['URI']['output']>;
  /** Name of the NFT item. */
  name?: Maybe<Scalars['String']['output']>;
};

/** The existence of the transaction is not yet indexed. Keep trying. */
export type NotIndexedYetStatus = {
  __typename?: 'NotIndexedYetStatus';
  reason: Scalars['String']['output'];
  /** True if the transaction has been mined. */
  txHasMined: Scalars['Boolean']['output'];
};

export type Notification = AccountActionExecutedNotification | CommentNotification | FollowNotification | GroupMembershipRequestApprovedNotification | GroupMembershipRequestRejectedNotification | MentionNotification | PostActionExecutedNotification | QuoteNotification | ReactionNotification | RepostNotification;

export type NotificationAccountFollow = {
  __typename?: 'NotificationAccountFollow';
  account: Account;
  followedAt: Scalars['DateTime']['output'];
};

export type NotificationAccountPostReaction = {
  __typename?: 'NotificationAccountPostReaction';
  account: Account;
  reactions: Array<PostReaction>;
};

export type NotificationAccountRepost = {
  __typename?: 'NotificationAccountRepost';
  account: Account;
  repostId: Scalars['PostId']['output'];
  repostedAt: Scalars['DateTime']['output'];
};

export type NotificationFilter = {
  /** The apps to filter by. */
  apps?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
  /** The graphs to filter by. */
  graphs?: InputMaybe<Array<GraphOneOf>>;
  /** Include notification from accounts with low score */
  includeLowScore?: Scalars['Boolean']['input'];
  /** The notification types to filter by. */
  notificationTypes?: InputMaybe<Array<NotificationType>>;
  /** Aggregate notifications by time */
  timeBasedAggregation?: Scalars['Boolean']['input'];
};

export enum NotificationOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Default = 'DEFAULT'
}

export type NotificationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to narrow down the notifications result. */
  filter?: InputMaybe<NotificationFilter>;
  /** An optional order to sort the notifications result. */
  orderBy?: NotificationOrderBy;
};

export enum NotificationType {
  Commented = 'COMMENTED',
  ExecutedAccountAction = 'EXECUTED_ACCOUNT_ACTION',
  ExecutedPostAction = 'EXECUTED_POST_ACTION',
  Followed = 'FOLLOWED',
  GroupMembershipRequestApproved = 'GROUP_MEMBERSHIP_REQUEST_APPROVED',
  GroupMembershipRequestRejected = 'GROUP_MEMBERSHIP_REQUEST_REJECTED',
  Mentioned = 'MENTIONED',
  Quoted = 'QUOTED',
  Reacted = 'REACTED',
  Reposted = 'REPOSTED'
}

export type OnboardingUserChallengeRequest = {
  /**
   * The App you intend to authenticate with.
   *
   * It MUST be a valid App address.
   * Note: On the testnet, it will default to the playground app.
   * This is to make it easier if you forget to set it. This may change in the future.
   */
  app?: Scalars['EvmAddress']['input'];
  /** The address of the EOA that needs to create their Lens Account. */
  wallet: Scalars['EvmAddress']['input'];
};

export enum PageSize {
  Fifty = 'FIFTY',
  Ten = 'TEN'
}

export type PaginatedAccountExecutedActionsResult = {
  __typename?: 'PaginatedAccountExecutedActionsResult';
  items: Array<AccountExecutedActions>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAccountManagersResult = {
  __typename?: 'PaginatedAccountManagersResult';
  /** The account managers. */
  items: Array<AccountManager>;
  /** The pagination information for the given request. */
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAccountsAvailableResult = {
  __typename?: 'PaginatedAccountsAvailableResult';
  /** The accounts available to use for the given address */
  items: Array<AccountAvailable>;
  /** The pagination information for the given request. */
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAccountsBlockedResult = {
  __typename?: 'PaginatedAccountsBlockedResult';
  items: Array<AccountBlocked>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAccountsResult = {
  __typename?: 'PaginatedAccountsResult';
  items: Array<Account>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedActiveAuthenticationsResult = {
  __typename?: 'PaginatedActiveAuthenticationsResult';
  items: Array<AuthenticatedSession>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAdminsResult = {
  __typename?: 'PaginatedAdminsResult';
  items: Array<Admin>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAnyPostsResult = {
  __typename?: 'PaginatedAnyPostsResult';
  items: Array<AnyPost>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAppFeedsResult = {
  __typename?: 'PaginatedAppFeedsResult';
  /** The feeds */
  items: Array<AppFeed>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAppSignersResult = {
  __typename?: 'PaginatedAppSignersResult';
  /** The signers */
  items: Array<AppSigner>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedAppUsersResult = {
  __typename?: 'PaginatedAppUsersResult';
  items: Array<AppUser>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedFeedsResult = {
  __typename?: 'PaginatedFeedsResult';
  items: Array<Feed>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedFollowersResult = {
  __typename?: 'PaginatedFollowersResult';
  items: Array<Follower>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedFollowingResult = {
  __typename?: 'PaginatedFollowingResult';
  items: Array<Following>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedGraphsResult = {
  __typename?: 'PaginatedGraphsResult';
  items: Array<Graph>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedGroupBannedAccountsResult = {
  __typename?: 'PaginatedGroupBannedAccountsResult';
  items: Array<GroupBannedAccount>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedGroupMembersResult = {
  __typename?: 'PaginatedGroupMembersResult';
  items: Array<GroupMember>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedGroupMembershipRequestsResult = {
  __typename?: 'PaginatedGroupMembershipRequestsResult';
  items: Array<GroupMembershipRequest>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedGroupsResult = {
  __typename?: 'PaginatedGroupsResult';
  /** The groups */
  items: Array<Group>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedNamespaceReservedUsernamesResult = {
  __typename?: 'PaginatedNamespaceReservedUsernamesResult';
  items: Array<UsernameReserved>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedNotificationResult = {
  __typename?: 'PaginatedNotificationResult';
  items: Array<Notification>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostActionContracts = {
  __typename?: 'PaginatedPostActionContracts';
  items: Array<PostActionContract>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostEditsResult = {
  __typename?: 'PaginatedPostEditsResult';
  items: Array<PostEdit>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostExecutedActionsResult = {
  __typename?: 'PaginatedPostExecutedActionsResult';
  items: Array<PostExecutedActions>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostReactionsResult = {
  __typename?: 'PaginatedPostReactionsResult';
  items: Array<AccountPostReaction>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostTagsResult = {
  __typename?: 'PaginatedPostTagsResult';
  items: Array<PostTag>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostsForYouResult = {
  __typename?: 'PaginatedPostsForYouResult';
  items: Array<PostForYou>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPostsResult = {
  __typename?: 'PaginatedPostsResult';
  items: Array<Post>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedResultInfo = {
  __typename?: 'PaginatedResultInfo';
  /** The cursor to the next page of results, if any. */
  next?: Maybe<Scalars['Cursor']['output']>;
  /** The cursor to the previous page of results, if any. */
  prev?: Maybe<Scalars['Cursor']['output']>;
};

export type PaginatedTimelineResult = {
  __typename?: 'PaginatedTimelineResult';
  items: Array<TimelineItem>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedUsernamesResult = {
  __typename?: 'PaginatedUsernamesResult';
  items: Array<Username>;
  pageInfo: PaginatedResultInfo;
};

export type PausingRequest = {
  /** The sponsorship to update */
  sponsorship: Scalars['EvmAddress']['input'];
};

export type PausingResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type PayToCollectConfig = {
  __typename?: 'PayToCollectConfig';
  amount: Erc20Amount;
  recipients: Array<RecipientPercent>;
  referralShare?: Maybe<Scalars['Float']['output']>;
};

export type PayToCollectInput = {
  amount: AmountInput;
  recipients: Array<RecipientPercentInput>;
  referralShare?: InputMaybe<Scalars['Float']['input']>;
};

export type PaymasterParams = {
  __typename?: 'PaymasterParams';
  /** The address of the paymaster. */
  paymaster: Scalars['EvmAddress']['output'];
  /** The bytestream input for the paymaster. */
  paymasterInput: Scalars['BlockchainData']['output'];
};

/**
 * The existence of the transaction is known, but its status is not yet known.
 *
 * The transaction could be:
 * - waiting to be included in a block
 * - waiting for a block to be mined
 * - waiting to be indexed by the Lens Indexer
 * - waiting for any associated metadata to be snapshotted and indexed
 */
export type PendingTransactionStatus = {
  __typename?: 'PendingTransactionStatus';
  blockTimestamp: Scalars['DateTime']['output'];
  summary: Array<SubOperationStatus>;
};

/** PhysicalAddress */
export type PhysicalAddress = {
  __typename?: 'PhysicalAddress';
  /** The country name component. */
  country: Scalars['String']['output'];
  /** The full mailing address formatted for display. */
  formatted?: Maybe<Scalars['String']['output']>;
  /** The city or locality. */
  locality: Scalars['String']['output'];
  /** The zip or postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** The state or region. */
  region?: Maybe<Scalars['String']['output']>;
  /**
   * The street address including house number, street name, P.O. Box, apartment or unit number
   * and extended multi-line address information.
   */
  streetAddress?: Maybe<Scalars['String']['output']>;
};

export type Post = {
  __typename?: 'Post';
  actions: Array<PostAction>;
  app?: Maybe<App>;
  author: Account;
  collectibleMetadata: NftMetadata;
  commentOn?: Maybe<Post>;
  contentUri: Scalars['URI']['output'];
  feed: PostFeedInfo;
  id: Scalars['PostId']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEdited: Scalars['Boolean']['output'];
  mentions: Array<PostMention>;
  metadata: PostMetadata;
  operations?: Maybe<LoggedInPostOperations>;
  quoteOf?: Maybe<Post>;
  root?: Maybe<Post>;
  rules: PostRules;
  slug: Scalars['PostId']['output'];
  stats: PostStats;
  timestamp: Scalars['DateTime']['output'];
};


export type PostActionsArgs = {
  request?: PostActionsParams;
};


export type PostContentUriArgs = {
  request?: PostContentUriRequest;
};

export type PostAccountPair = {
  account: Scalars['EvmAddress']['input'];
  post: Scalars['PostId']['input'];
};

/**
 * The configured actions for a post. All posts have the TippingPostAction enabled by default which
 * is not listed here.
 */
export type PostAction = SimpleCollectAction | UnknownPostAction;

export type PostActionConfigInput = {
  simpleCollect?: InputMaybe<SimpleCollectActionConfigInput>;
  unknown?: InputMaybe<UnknownActionConfigInput>;
};

export type PostActionContract = SimpleCollectActionContract | TippingPostActionContract | UnknownPostActionContract;

export type PostActionContractsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  includeUnknown?: Scalars['Boolean']['input'];
  onlyCollectActions?: Scalars['Boolean']['input'];
  pageSize?: PageSize;
};

export type PostActionExecuteInput = {
  simpleCollect?: InputMaybe<SimpleCollectExecuteInput>;
  tipping?: InputMaybe<TippingAmountInput>;
  unknown?: InputMaybe<UnknownActionExecuteInput>;
};

export type PostActionExecuted = SimpleCollectPostActionExecuted | TippingPostActionExecuted | UnknownPostActionExecuted;

export type PostActionExecutedNotification = {
  __typename?: 'PostActionExecutedNotification';
  actions: Array<PostActionExecuted>;
  id: Scalars['GeneratedNotificationId']['output'];
  post: Post;
};

export type PostActionExecutedNotificationAttributes = {
  action?: InputMaybe<Scalars['EvmAddress']['input']>;
  actionType?: InputMaybe<PostActionType>;
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  executingAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  postId?: InputMaybe<Scalars['PostId']['input']>;
  receivingAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type PostActionFilter = {
  address?: InputMaybe<Scalars['EvmAddress']['input']>;
  simpleCollect?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  tipping?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export enum PostActionType {
  SimpleCollect = 'SIMPLE_COLLECT',
  Tipping = 'TIPPING',
  Unknown = 'UNKNOWN'
}

export type PostActionsParams = {
  includeDisabled: Scalars['Boolean']['input'];
};

export type PostBookmarksFilter = {
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
  metadata?: InputMaybe<PostMetadataFilter>;
};

export type PostBookmarksRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PostBookmarksFilter>;
  pageSize?: PageSize;
};

export type PostCollectedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  collector?: InputMaybe<Scalars['EvmAddress']['input']>;
  postAuthor?: InputMaybe<Scalars['EvmAddress']['input']>;
  postId?: InputMaybe<Scalars['PostId']['input']>;
};

export type PostContentUriRequest = {
  useSnapshot: Scalars['Boolean']['input'];
};

export type PostCreatedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  author?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  parentPostId?: InputMaybe<Scalars['PostId']['input']>;
  postTypes?: InputMaybe<Array<PostType>>;
};

export type PostDeletedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  author?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  parentPostId?: InputMaybe<Scalars['PostId']['input']>;
  postTypes?: InputMaybe<Array<PostType>>;
};

export type PostEdit = {
  __typename?: 'PostEdit';
  metadata: PostMetadata;
  timestamp: Scalars['DateTime']['output'];
};

export type PostEditedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  author?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  parentPostId?: InputMaybe<Scalars['PostId']['input']>;
  postTypes?: InputMaybe<Array<PostType>>;
};

export type PostEditsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  pageSize?: PageSize;
  /** The post ID. */
  post: Scalars['PostId']['input'];
};

export type PostExecutedActions = {
  __typename?: 'PostExecutedActions';
  account: Account;
  firstAt: Scalars['DateTime']['output'];
  lastAt: Scalars['DateTime']['output'];
  total: Scalars['Int']['output'];
};

export type PostFeedInfo = {
  __typename?: 'PostFeedInfo';
  address: Scalars['EvmAddress']['output'];
  group?: Maybe<PostGroupInfo>;
  metadata?: Maybe<FeedMetadata>;
};

export type PostForYou = {
  __typename?: 'PostForYou';
  post: Post;
  source: ForYouSource;
};

export type PostGroupInfo = {
  __typename?: 'PostGroupInfo';
  address: Scalars['EvmAddress']['output'];
  metadata?: Maybe<GroupMetadata>;
};

export type PostMention = AccountMention | GroupMention;

export type PostMetadata = ArticleMetadata | AudioMetadata | CheckingInMetadata | EmbedMetadata | EventMetadata | ImageMetadata | LinkMetadata | LivestreamMetadata | MintMetadata | SpaceMetadata | StoryMetadata | TextOnlyMetadata | ThreeDMetadata | TransactionMetadata | UnknownPostMetadata | VideoMetadata;

export type PostMetadataContentWarningFilter = {
  oneOf: Array<ContentWarning>;
};

export type PostMetadataFilter = {
  /** The content warning to filter by. */
  contentWarning?: InputMaybe<PostMetadataContentWarningFilter>;
  /** The main focus of the post. */
  mainContentFocus?: InputMaybe<Array<MainContentFocus>>;
  /** The tags to filter by. */
  tags?: InputMaybe<PostMetadataTagsFilter>;
};

export type PostMetadataTagsFilter = {
  all?: InputMaybe<Array<Scalars['String']['input']>>;
  oneOf?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PostNotInterestedRequest = {
  post: Scalars['PostId']['input'];
};

export type PostOperationValidationFailed = {
  __typename?: 'PostOperationValidationFailed';
  reason: Scalars['String']['output'];
  unsatisfiedRules?: Maybe<PostUnsatisfiedRules>;
};

export type PostOperationValidationOutcome = PostOperationValidationFailed | PostOperationValidationPassed | PostOperationValidationUnknown;

export type PostOperationValidationPassed = {
  __typename?: 'PostOperationValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type PostOperationValidationRule = FeedRule | PostRule;

export type PostOperationValidationUnknown = {
  __typename?: 'PostOperationValidationUnknown';
  extraChecksRequired: Array<PostOperationValidationRule>;
};

export type PostReaction = {
  __typename?: 'PostReaction';
  /**
   * This is the app which it was reacted on - note lens v2 legacy reactions may not have an app
   * linked to it
   */
  app?: Maybe<Scalars['EvmAddress']['output']>;
  reactedAt: Scalars['DateTime']['output'];
  reaction: PostReactionType;
};

export type PostReactionAddedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  postId?: InputMaybe<Scalars['PostId']['input']>;
  reactingAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  reactionType?: InputMaybe<PostReactionType>;
};

export enum PostReactionOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  Default = 'DEFAULT'
}

export type PostReactionRemovedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  postId?: InputMaybe<Scalars['PostId']['input']>;
  reactingAccount?: InputMaybe<Scalars['EvmAddress']['input']>;
  reactionType?: InputMaybe<PostReactionType>;
};

export type PostReactionStatus = {
  __typename?: 'PostReactionStatus';
  account: Scalars['EvmAddress']['output'];
  app?: Maybe<Scalars['EvmAddress']['output']>;
  postId: Scalars['PostId']['output'];
  result: Scalars['Boolean']['output'];
};

export type PostReactionStatusRequest = {
  filter?: InputMaybe<PostReactionsFilter>;
  pairs: Array<PostAccountPair>;
};

export enum PostReactionType {
  Downvote = 'DOWNVOTE',
  Upvote = 'UPVOTE'
}

export type PostReactionsFilter = {
  /** The types of reactions to filter by. */
  anyOf?: InputMaybe<Array<PostReactionType>>;
};

export type PostReactionsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to narrow down the result. */
  filter?: InputMaybe<PostReactionsFilter>;
  /** The order in which to return the results. */
  orderBy?: InputMaybe<PostReactionOrderBy>;
  pageSize?: PageSize;
  /** The ID of the post to get reactions for. */
  post: Scalars['PostId']['input'];
};

export enum PostReferenceType {
  CommentOn = 'COMMENT_ON',
  QuoteOf = 'QUOTE_OF',
  RepostOf = 'REPOST_OF'
}

export type PostReferencesRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
  /** The types of references to get. */
  referenceTypes: Array<PostReferenceType>;
  /** The post to get references for. */
  referencedPost: Scalars['PostId']['input'];
  /**
   * The relevancy filter to apply.
   *
   * This filter is only applicable for `CommentOn` reference type.
   */
  relevancyFilter?: ReferenceRelevancyFilter;
  /** The visibility filter to apply by default it will honour the visibility of the post. */
  visibilityFilter?: PostVisibilityFilter;
};

export enum PostReportReason {
  AnimalAbuse = 'ANIMAL_ABUSE',
  DirectThreat = 'DIRECT_THREAT',
  FakeEngagement = 'FAKE_ENGAGEMENT',
  Harassment = 'HARASSMENT',
  HateSpeech = 'HATE_SPEECH',
  Impersonation = 'IMPERSONATION',
  ManipulationAlgo = 'MANIPULATION_ALGO',
  Misleading = 'MISLEADING',
  MisuseHashtags = 'MISUSE_HASHTAGS',
  Nudity = 'NUDITY',
  Offensive = 'OFFENSIVE',
  Repetitive = 'REPETITIVE',
  Scam = 'SCAM',
  SelfHarm = 'SELF_HARM',
  SomethingElse = 'SOMETHING_ELSE',
  UnauthorizedSale = 'UNAUTHORIZED_SALE',
  Unrelated = 'UNRELATED',
  Violence = 'VIOLENCE'
}

export type PostReportedNotificationAttributes = {
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  author?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  reporter?: InputMaybe<Scalars['EvmAddress']['input']>;
};

/** You must provide either a txHash or a postId or a legacyId, you can not apply more than one. */
export type PostRequest = {
  /** The legacy publication ID. */
  legacyId?: InputMaybe<Scalars['LegacyPublicationId']['input']>;
  /** The post ID. */
  post?: InputMaybe<Scalars['PostId']['input']>;
  /** The transaction hash you sent the post with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  hash: Scalars['TxHash']['output'];
};

export type PostResult = PostOperationValidationFailed | PostResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type PostRule = {
  __typename?: 'PostRule';
  address: Scalars['EvmAddress']['output'];
  config: Array<AnyKeyValue>;
  executesOn: Array<PostRuleExecuteOn>;
  id: Scalars['RuleId']['output'];
  type: PostRuleType;
};

export type PostRuleConfig = {
  followersOnlyRule?: InputMaybe<FollowersOnlyPostRuleConfig>;
  unknownRule?: InputMaybe<UnknownPostRuleConfig>;
};

export enum PostRuleExecuteOn {
  CreatingPost = 'CREATING_POST',
  EditingPost = 'EDITING_POST'
}

export enum PostRuleType {
  FollowersOnly = 'FOLLOWERS_ONLY',
  Unknown = 'UNKNOWN'
}

export enum PostRuleUnsatisfiedReason {
  FeedAccountBlocked = 'FEED_ACCOUNT_BLOCKED',
  FeedGroupGatedNotAMember = 'FEED_GROUP_GATED_NOT_A_MEMBER',
  FeedSimplePaymentNotEnoughBalance = 'FEED_SIMPLE_PAYMENT_NOT_ENOUGH_BALANCE',
  FeedTokenGatedNotATokenHolder = 'FEED_TOKEN_GATED_NOT_A_TOKEN_HOLDER',
  PostNotAFollower = 'POST_NOT_A_FOLLOWER'
}

export type PostRules = {
  __typename?: 'PostRules';
  anyOf: Array<PostRule>;
  required: Array<PostRule>;
};

export type PostRulesConfigInput = {
  anyOf?: Array<PostRuleConfig>;
  required?: Array<PostRuleConfig>;
};

export type PostRulesProcessingParams = {
  unknownRule?: InputMaybe<UnknownRuleProcessingParams>;
};

export type PostStats = {
  __typename?: 'PostStats';
  /** The total number of bookmarks. */
  bookmarks: Scalars['Int']['output'];
  /** The total number of collects. */
  collects: Scalars['Int']['output'];
  /** The total number of comments. */
  comments: Scalars['Int']['output'];
  /** The total number of quotes. */
  quotes: Scalars['Int']['output'];
  /** Get the number of reactions for the post. */
  reactions: Scalars['Int']['output'];
  /** The total number of reposts. */
  reposts: Scalars['Int']['output'];
  /** The total number of tips received. */
  tips: Scalars['Int']['output'];
};


export type PostStatsReactionsArgs = {
  request?: StatsReactionRequest;
};

export type PostTag = {
  __typename?: 'PostTag';
  total: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type PostTagsFilter = {
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
};

export enum PostTagsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  MostPopular = 'MOST_POPULAR'
}

export type PostTagsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the tags. */
  filter?: InputMaybe<PostTagsFilter>;
  orderBy?: PostTagsOrderBy;
  pageSize?: PageSize;
};

export type PostTip = {
  __typename?: 'PostTip';
  amount: Erc20Amount;
  date: Scalars['DateTime']['output'];
};

export enum PostType {
  Comment = 'COMMENT',
  Quote = 'QUOTE',
  Repost = 'REPOST',
  Root = 'ROOT'
}

export type PostUnsatisfiedRule = {
  __typename?: 'PostUnsatisfiedRule';
  config: Array<AnyKeyValue>;
  message: Scalars['String']['output'];
  reason: PostRuleUnsatisfiedReason;
  rule: Scalars['EvmAddress']['output'];
};

export type PostUnsatisfiedRules = {
  __typename?: 'PostUnsatisfiedRules';
  anyOf: Array<PostUnsatisfiedRule>;
  required: Array<PostUnsatisfiedRule>;
};

export enum PostVisibilityFilter {
  /** All posts even if they have been hidden */
  All = 'ALL',
  /** Only the posts that are hidden */
  Hidden = 'HIDDEN',
  /** Only the posts that are visible */
  Visible = 'VISIBLE'
}

export type PostsExploreFilter = {
  /** Metadata filters to apply to posts */
  metadata?: PostMetadataFilter;
  /** Only return posts after this timestamp, defaults to 3 days ago. */
  since?: Scalars['Int']['input'];
};

export type PostsExploreRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** Filter for posts */
  filter?: PostsExploreFilter;
  /** The page size. */
  pageSize?: PageSize;
  /** Shuffle the results, defaults to false. Causes performance issues so is ignored for now. */
  shuffle?: Scalars['Boolean']['input'];
};

export type PostsFilter = {
  /**
   * A filter that returns only posts from authors with `Account Score` either `AtLeast` or
   * `LessThan` the specified value.
   */
  accountScore?: InputMaybe<AccountScoreFilter>;
  /** The apps used to publish the posts. */
  apps?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The authors of the posts. */
  authors?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The account that collected the posts. */
  collectedBy?: InputMaybe<CollectedBy>;
  /** The feeds where the posts are published. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
  /** The metadata filters to apply to the posts. */
  metadata?: InputMaybe<PostMetadataFilter>;
  /** The types of the posts. */
  postTypes?: InputMaybe<Array<PostType>>;
  /** The post IDs to search for. You can also use the post slug. */
  posts?: InputMaybe<Array<Scalars['PostId']['input']>>;
  /** The query text to search for in the post content or metadata tags. */
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type PostsForYouRequest = {
  /** The account to get for you for. If not provided, defaults to the authenticated account. */
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The page size. */
  pageSize?: PageSize;
  /** Shuffle the for you posts. */
  shuffle?: Scalars['Boolean']['input'];
};

export type PostsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PostsFilter>;
  pageSize?: PageSize;
};

export type PrimitiveData = AddressKeyValue | BigDecimalKeyValue | BooleanKeyValue | IntKeyValue | IntNullableKeyValue | RawKeyValue | StringKeyValue;

export type PrimitiveId = {
  account?: InputMaybe<Scalars['EvmAddress']['input']>;
  accountAction?: InputMaybe<Scalars['EvmAddress']['input']>;
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  feed?: InputMaybe<Scalars['EvmAddress']['input']>;
  graph?: InputMaybe<Scalars['EvmAddress']['input']>;
  group?: InputMaybe<Scalars['EvmAddress']['input']>;
  post?: InputMaybe<Scalars['PostId']['input']>;
  postAction?: InputMaybe<Scalars['EvmAddress']['input']>;
  sponsorship?: InputMaybe<Scalars['EvmAddress']['input']>;
  usernameNamespace?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  /** Get access control information */
  accessControl?: Maybe<AccessControlResult>;
  /** Get an account by address, username, or legacy profile ID. */
  account?: Maybe<Account>;
  /**
   * Get native and/or ERC20 token balances in bulk for the authenticated Account.
   *
   * You MUST be authenticated as Account Owner or Account Manager to use this query.
   */
  accountBalances: Array<AnyAccountBalance>;
  /** Get the account stats for the feeds. */
  accountFeedsStats: AccountFeedsStats;
  /** Get the account stats for the graphs. */
  accountGraphsStats: AccountGraphsFollowStats;
  /**
   * Account manager for the authenticated account.
   *
   * You MUST be authenticated to use this query.
   */
  accountManagers: PaginatedAccountManagersResult;
  /** Get the stats for an account. */
  accountStats: AccountStats;
  /** Get accounts. */
  accounts: PaginatedAccountsResult;
  /** Get the accounts which are available to use for the given address */
  accountsAvailable: PaginatedAccountsAvailableResult;
  /**
   * Accounts blocked for the authenticated account.
   *
   * You MUST be authenticated to use this query.
   */
  accountsBlocked: PaginatedAccountsBlockedResult;
  /** Get accounts by address, username, or legacy profile ID. */
  accountsBulk: Array<Account>;
  /** Get admins for a graph/app/sponsor/feed/username/group address */
  adminsFor: PaginatedAdminsResult;
  /** Get an app */
  app?: Maybe<App>;
  /** Get the feeds for an app */
  appFeeds: PaginatedAppFeedsResult;
  /** Get the groups for an app */
  appGroups: PaginatedGroupsResult;
  /**
   * Get the server side API key for the app you must be the owner of the app to see it.
   *
   * You MUST be authenticated as a Builder to use this mutation.
   */
  appServerApiKey?: Maybe<Scalars['String']['output']>;
  /** Get the signers for an app */
  appSigners: PaginatedAppSignersResult;
  /** Get accounts for an app. */
  appUsers: PaginatedAppUsersResult;
  /** Get the apps. */
  apps: AppsResult;
  /**
   * List all active authenticated sessions for the current account.
   *
   * You MUST be authenticated to use this query.
   */
  authenticatedSessions: PaginatedActiveAuthenticationsResult;
  /**
   * Checks if the given username can be created by the account
   *
   * You MUST be authenticated to use this mutation.
   */
  canCreateUsername: CanCreateUsernameResult;
  /** Create a frame typed data */
  createFrameTypedData: CreateFrameEip712TypedData;
  /**
   * Get the current authenticated session for the current account.
   *
   * You MUST be authenticated to use this query.
   */
  currentSession: AuthenticatedSession;
  debugMetadata: DebugPostMetadataResult;
  feed?: Maybe<Feed>;
  /** Get the feeds. */
  feeds: PaginatedFeedsResult;
  followStatus: Array<FollowStatusResult>;
  followers: PaginatedFollowersResult;
  followersYouKnow: PaginatedFollowersResult;
  following: PaginatedFollowingResult;
  getSnsSubscriptions: Array<SnsSubscription>;
  graph?: Maybe<Graph>;
  /** Get the graphs. */
  graphs: PaginatedGraphsResult;
  group?: Maybe<Group>;
  /** Get the banned accounts of a group */
  groupBannedAccounts: PaginatedGroupBannedAccountsResult;
  /** Get the members of the group */
  groupMembers: PaginatedGroupMembersResult;
  /** Get the group membership requests */
  groupMembershipRequests: PaginatedGroupMembershipRequestsResult;
  /** Get the number of members in a Group */
  groupStats: GroupStatsResponse;
  /** Get the groups. */
  groups: PaginatedGroupsResult;
  health: Scalars['Boolean']['output'];
  /** Get the last logged in account for the given address and app if specified. */
  lastLoggedInAccount?: Maybe<Account>;
  maintenance: Scalars['Boolean']['output'];
  /**
   * Account information for the authenticated account.
   *
   * You MUST be authenticated to use this query.
   */
  me: MeResult;
  mlAccountRecommendations: PaginatedAccountsResult;
  mlPostsExplore: PaginatedPostsResult;
  mlPostsForYou: PaginatedPostsForYouResult;
  namespace?: Maybe<UsernameNamespace>;
  /** Get the banned accounts of a group */
  namespaceReservedUsernames: PaginatedNamespaceReservedUsernamesResult;
  /** Get the namespaces. */
  namespaces: NamespacesResult;
  /**
   * Get account notifications.
   *
   * You MUST be authenticated to use this query.
   */
  notifications: PaginatedNotificationResult;
  post?: Maybe<AnyPost>;
  /** Lists all available Post Action contracts. */
  postActionContracts: PaginatedPostActionContracts;
  postBookmarks: PaginatedAnyPostsResult;
  postEdits: PaginatedPostEditsResult;
  postReactionStatus: Array<PostReactionStatus>;
  /** Get the reactions added to a post. */
  postReactions: PaginatedPostReactionsResult;
  /** Get any post references for a given post. */
  postReferences: PaginatedAnyPostsResult;
  postTags: PaginatedPostTagsResult;
  posts: PaginatedAnyPostsResult;
  /** Get the status of a refresh metadata job. */
  refreshMetadataStatus: RefreshMetadataStatusResult;
  /** Get a Sponsorship */
  sponsorship?: Maybe<Sponsorship>;
  /** Get paginated Sponsorship Grants. */
  sponsorshipGrants: SponsorshipGrantsResult;
  /** Get paginated Sponsorship limits Exclusion list. */
  sponsorshipLimitsExclusions: SponsorshipLimitsExclusionsResult;
  /** Get paginated Sponsorship Signers. */
  sponsorshipSigners: SponsorshipSignersResult;
  /** Get paginated Sponsorships. */
  sponsorships: SponsorshipsResult;
  /**
   * Get account timeline.
   *
   * You MUST be authenticated to use this query.
   */
  timeline: PaginatedTimelineResult;
  /** Get most engaged posts for the given account timeline. */
  timelineHighlights: PaginatedPostsResult;
  /** Get the status of a transaction by its hash. */
  transactionStatus: TransactionStatusResult;
  username?: Maybe<Username>;
  /** Get the usernames for the account/owner. */
  usernames: PaginatedUsernamesResult;
  verifyFrameSignature: FrameVerifySignatureResult;
  /** Get who acted on a post. */
  whoExecutedActionOnAccount: PaginatedAccountExecutedActionsResult;
  /** Get who acted on a post. */
  whoExecutedActionOnPost: PaginatedPostExecutedActionsResult;
  /** Get accounts who referenced a post */
  whoReferencedPost: PaginatedAccountsResult;
};


export type QueryAccessControlArgs = {
  request: AccessControlRequest;
};


export type QueryAccountArgs = {
  request: AccountRequest;
};


export type QueryAccountBalancesArgs = {
  request: AccountBalancesRequest;
};


export type QueryAccountFeedsStatsArgs = {
  request: AccountFeedsStatsRequest;
};


export type QueryAccountGraphsStatsArgs = {
  request: AccountGraphsStatsRequest;
};


export type QueryAccountManagersArgs = {
  request: AccountManagersRequest;
};


export type QueryAccountStatsArgs = {
  request: AccountStatsRequest;
};


export type QueryAccountsArgs = {
  request: AccountsRequest;
};


export type QueryAccountsAvailableArgs = {
  request: AccountsAvailableRequest;
};


export type QueryAccountsBlockedArgs = {
  request: AccountsBlockedRequest;
};


export type QueryAccountsBulkArgs = {
  request: AccountsBulkRequest;
};


export type QueryAdminsForArgs = {
  request: AdminsForRequest;
};


export type QueryAppArgs = {
  request: AppRequest;
};


export type QueryAppFeedsArgs = {
  request: AppFeedsRequest;
};


export type QueryAppGroupsArgs = {
  request: AppGroupsRequest;
};


export type QueryAppServerApiKeyArgs = {
  request: AppServerApiKeyRequest;
};


export type QueryAppSignersArgs = {
  request: AppSignersRequest;
};


export type QueryAppUsersArgs = {
  request: AppUsersRequest;
};


export type QueryAppsArgs = {
  request: AppsRequest;
};


export type QueryAuthenticatedSessionsArgs = {
  request: AuthenticatedSessionsRequest;
};


export type QueryCanCreateUsernameArgs = {
  request: UsernameInput;
};


export type QueryCreateFrameTypedDataArgs = {
  request: FrameEip712Request;
};


export type QueryDebugMetadataArgs = {
  debugMetadataRequest: DebugPostMetadataRequest;
};


export type QueryFeedArgs = {
  request: FeedRequest;
};


export type QueryFeedsArgs = {
  request: FeedsRequest;
};


export type QueryFollowStatusArgs = {
  request: FollowStatusRequest;
};


export type QueryFollowersArgs = {
  request: FollowersRequest;
};


export type QueryFollowersYouKnowArgs = {
  request: FollowersYouKnowRequest;
};


export type QueryFollowingArgs = {
  request: FollowingRequest;
};


export type QueryGetSnsSubscriptionsArgs = {
  request: GetSnsSubscriptionsRequest;
};


export type QueryGraphArgs = {
  request: GraphRequest;
};


export type QueryGraphsArgs = {
  request: GraphsRequest;
};


export type QueryGroupArgs = {
  request: GroupRequest;
};


export type QueryGroupBannedAccountsArgs = {
  request: GroupBannedAccountsRequest;
};


export type QueryGroupMembersArgs = {
  request: GroupMembersRequest;
};


export type QueryGroupMembershipRequestsArgs = {
  request: GroupMembershipRequestsRequest;
};


export type QueryGroupStatsArgs = {
  request: GroupStatsRequest;
};


export type QueryGroupsArgs = {
  request: GroupsRequest;
};


export type QueryLastLoggedInAccountArgs = {
  request: LastLoggedInAccountRequest;
};


export type QueryMlAccountRecommendationsArgs = {
  request: AccountRecommendationsRequest;
};


export type QueryMlPostsExploreArgs = {
  request: PostsExploreRequest;
};


export type QueryMlPostsForYouArgs = {
  request: PostsForYouRequest;
};


export type QueryNamespaceArgs = {
  request: NamespaceRequest;
};


export type QueryNamespaceReservedUsernamesArgs = {
  request: NamespaceReservedUsernamesRequest;
};


export type QueryNamespacesArgs = {
  request: NamespacesRequest;
};


export type QueryNotificationsArgs = {
  request: NotificationRequest;
};


export type QueryPostArgs = {
  request: PostRequest;
};


export type QueryPostActionContractsArgs = {
  request: PostActionContractsRequest;
};


export type QueryPostBookmarksArgs = {
  request: PostBookmarksRequest;
};


export type QueryPostEditsArgs = {
  request: PostEditsRequest;
};


export type QueryPostReactionStatusArgs = {
  request: PostReactionStatusRequest;
};


export type QueryPostReactionsArgs = {
  request: PostReactionsRequest;
};


export type QueryPostReferencesArgs = {
  request: PostReferencesRequest;
};


export type QueryPostTagsArgs = {
  request: PostTagsRequest;
};


export type QueryPostsArgs = {
  request: PostsRequest;
};


export type QueryRefreshMetadataStatusArgs = {
  request: RefreshMetadataStatusRequest;
};


export type QuerySponsorshipArgs = {
  request: SponsorshipRequest;
};


export type QuerySponsorshipGrantsArgs = {
  request: SponsorshipGrantsRequest;
};


export type QuerySponsorshipLimitsExclusionsArgs = {
  request: SponsorshipLimitExclusionsRequest;
};


export type QuerySponsorshipSignersArgs = {
  request: SponsorshipSignersRequest;
};


export type QuerySponsorshipsArgs = {
  request: SponsorshipsRequest;
};


export type QueryTimelineArgs = {
  request: TimelineRequest;
};


export type QueryTimelineHighlightsArgs = {
  request: TimelineHighlightsRequest;
};


export type QueryTransactionStatusArgs = {
  request: TransactionStatusRequest;
};


export type QueryUsernameArgs = {
  request: UsernameRequest;
};


export type QueryUsernamesArgs = {
  request: UsernamesRequest;
};


export type QueryVerifyFrameSignatureArgs = {
  request: FrameVerifySignature;
};


export type QueryWhoExecutedActionOnAccountArgs = {
  request: WhoExecutedActionOnAccountRequest;
};


export type QueryWhoExecutedActionOnPostArgs = {
  request: WhoExecutedActionOnPostRequest;
};


export type QueryWhoReferencedPostArgs = {
  request: WhoReferencedPostRequest;
};

export type QuoteNotification = {
  __typename?: 'QuoteNotification';
  id: Scalars['GeneratedNotificationId']['output'];
  quote: Post;
};

export type RawKeyValue = {
  __typename?: 'RawKeyValue';
  data: Scalars['BlockchainData']['output'];
  key: Scalars['BlockchainData']['output'];
};

export type RawKeyValueInput = {
  data: Scalars['BlockchainData']['input'];
  key: Scalars['BlockchainData']['input'];
};

export type ReactionNotification = {
  __typename?: 'ReactionNotification';
  id: Scalars['GeneratedNotificationId']['output'];
  post: Post;
  reactions: Array<NotificationAccountPostReaction>;
};

export type RecipientPercent = {
  __typename?: 'RecipientPercent';
  /** Address of the recipient. */
  address: Scalars['EvmAddress']['output'];
  /** Percentage of the fee that will be sent to the recipient. */
  percent: Scalars['Float']['output'];
};

export type RecipientPercentInput = {
  /** Address of the recipient. */
  address: Scalars['EvmAddress']['input'];
  /** Percentage of the fee that will be sent to the recipient. */
  percent: Scalars['Float']['input'];
};

export type RecommendAccount = {
  /** The account to recommend. */
  account: Scalars['EvmAddress']['input'];
};

export enum ReferenceRelevancyFilter {
  /** All comments. */
  All = 'ALL',
  /** Only the comments that are not relevant */
  NotRelevant = 'NOT_RELEVANT',
  /** Only the comments that are relevant */
  Relevant = 'RELEVANT'
}

export type ReferencingPostInput = {
  /** The post to reference. */
  post: Scalars['PostId']['input'];
  /** The processing params for the post rules. */
  postRulesProcessingParams?: InputMaybe<Array<PostRulesProcessingParams>>;
};

export type ReferralCut = {
  /** Address of the recipient. */
  address: Scalars['EvmAddress']['input'];
  /** Percentage of the referral share that will be sent to the address specified. */
  percent: Scalars['Float']['input'];
};

export type RefreshMetadataRequest = {
  /** Used only when trying to refresh app-specific account metadata */
  app?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The entity to refresh metadata for. */
  entity: EntityId;
};

export type RefreshMetadataResult = {
  __typename?: 'RefreshMetadataResult';
  /** The id of the refresh metadata job. You can use this id to check the status of the job. */
  id: Scalars['UUID']['output'];
};

export type RefreshMetadataStatusRequest = {
  /** The refresh metadata status ID from the refreshMetadata mutation. */
  id: Scalars['UUID']['input'];
};

export type RefreshMetadataStatusResult = {
  __typename?: 'RefreshMetadataStatusResult';
  /** The id of the refresh metadata job. You can use this id to check the status of the job. */
  id: Scalars['UUID']['output'];
  /** An optional reason in case the status is failed. */
  reason?: Maybe<Scalars['String']['output']>;
  /** The status of the refresh metadata job. */
  status: IndexingStatus;
  /** The timestamp when the refresh metadata job was updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type RefreshRequest = {
  refreshToken: Scalars['RefreshToken']['input'];
};

export type RefreshResult = AuthenticationTokens | ForbiddenError;

export type RejectGroupMembershipRequest = {
  /** The accounts you want to reject membership request for. */
  accounts: Array<Scalars['EvmAddress']['input']>;
  /** The group you want to reject membership request for. */
  group: Scalars['EvmAddress']['input'];
};

export type RejectGroupMembershipRequestsResponse = {
  __typename?: 'RejectGroupMembershipRequestsResponse';
  hash: Scalars['TxHash']['output'];
};

export type RejectGroupMembershipResult = RejectGroupMembershipRequestsResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveAccountManagerRequest = {
  /** The address to remove as a manager. */
  manager: Scalars['EvmAddress']['input'];
};

export type RemoveAccountManagerResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveAdminsRequest = {
  /** The graph/app/sponsor/feed/username/group address which manages these admins */
  address: Scalars['EvmAddress']['input'];
  /** The addresses to remove as admins */
  admins: Array<Scalars['EvmAddress']['input']>;
};

export type RemoveAdminsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveAppAuthorizationEndpointRequest = {
  /** The app. */
  app: Scalars['EvmAddress']['input'];
};

export type RemoveAppFeedsRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app feeds (max 10 per request) */
  feeds: Array<Scalars['EvmAddress']['input']>;
};

export type RemoveAppFeedsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveAppGroupsRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app groups (max 10 per request) */
  groups: Array<Scalars['EvmAddress']['input']>;
};

export type RemoveAppGroupsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveAppSignersRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app signers (max 10 per request) */
  signers: Array<Scalars['EvmAddress']['input']>;
};

export type RemoveAppSignersResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveGroupMembersRequest = {
  /** The accounts you want to remove from the group. */
  accounts: Array<Scalars['EvmAddress']['input']>;
  /** Ban the account from the joining the group. */
  ban?: Scalars['Boolean']['input'];
  /** The group you want to join */
  group: Scalars['EvmAddress']['input'];
  /** The processing params for the join rules. */
  rulesProcessingParams?: InputMaybe<Array<GroupRulesProcessingParams>>;
};

export type RemoveGroupMembersResponse = {
  __typename?: 'RemoveGroupMembersResponse';
  hash: Scalars['TxHash']['output'];
};

export type RemoveGroupMembersResult = GroupOperationValidationFailed | RemoveGroupMembersResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RemoveSignlessResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type ReportAccountRequest = {
  /** The account to report. */
  account: Scalars['EvmAddress']['input'];
  /** An optional comment to add to the report. */
  additionalComment?: InputMaybe<Scalars['String']['input']>;
  /** The reason for the report. */
  reason: AccountReportReason;
  /** An optional list of posts to reference in the report. */
  referencePosts?: InputMaybe<Array<Scalars['PostId']['input']>>;
};

export type ReportPostRequest = {
  additionalComment?: InputMaybe<Scalars['String']['input']>;
  post: Scalars['PostId']['input'];
  reason: PostReportReason;
};

export type Repost = {
  __typename?: 'Repost';
  app?: Maybe<App>;
  author: Account;
  id: Scalars['PostId']['output'];
  isDeleted: Scalars['Boolean']['output'];
  repostOf: Post;
  slug: Scalars['PostId']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type RepostNotification = {
  __typename?: 'RepostNotification';
  id: Scalars['GeneratedNotificationId']['output'];
  post: Post;
  reposts: Array<NotificationAccountRepost>;
};

export type RequestGroupMembershipRequest = {
  /** The group you want to add member to. */
  group: Scalars['EvmAddress']['input'];
};

export type RequestGroupMembershipResponse = {
  __typename?: 'RequestGroupMembershipResponse';
  hash: Scalars['TxHash']['output'];
};

export type RequestGroupMembershipResult = RequestGroupMembershipResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type RevokeAuthenticationRequest = {
  authenticationId: Scalars['UUID']['input'];
};

export type RolloverRefreshRequest = {
  /** The app that new tokens will be issued for. */
  app: Scalars['EvmAddress']['input'];
  /** A valid Lens API v2 refresh token for a Profile session. */
  refreshToken: Scalars['LegacyRefreshToken']['input'];
};

export enum SelfFundedFallbackReason {
  CannotSponsor = 'CANNOT_SPONSOR',
  NotSponsored = 'NOT_SPONSORED'
}

export type SelfFundedTransactionRequest = {
  __typename?: 'SelfFundedTransactionRequest';
  /**
   * The raw transaction request object.
   *
   * Use this object if your library does not have a parser for the encoded transaction data.
   */
  raw: Eip1559TransactionRequest;
  reason: Scalars['String']['output'];
  selfFundedReason?: Maybe<SelfFundedFallbackReason>;
};

export type SetAccountMetadataRequest = {
  /** The metadata URI to set. */
  metadataUri: Scalars['URI']['input'];
};

export type SetAccountMetadataResponse = {
  __typename?: 'SetAccountMetadataResponse';
  hash: Scalars['TxHash']['output'];
};

export type SetAccountMetadataResult = SelfFundedTransactionRequest | SetAccountMetadataResponse | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppGraphRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app graph to set */
  graph: GraphChoiceOneOf;
};

export type SetAppGraphResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppMetadataRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app metadata to set */
  metadataUri: Scalars['String']['input'];
};

export type SetAppMetadataResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppSponsorshipRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app sponsorship to set */
  sponsorship: Scalars['EvmAddress']['input'];
};

export type SetAppSponsorshipResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppTreasuryRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app treasury to set */
  treasury: Scalars['EvmAddress']['input'];
};

export type SetAppTreasuryResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppUsernameNamespaceRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app username namespace to set */
  usernameNamespace: UsernameNamespaceChoiceOneOf;
};

export type SetAppUsernameNamespaceResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetAppVerificationRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The new verification state */
  enabled: Scalars['Boolean']['input'];
};

export type SetAppVerificationResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetDefaultAppFeedRequest = {
  /** The app to update */
  app: Scalars['EvmAddress']['input'];
  /** The app default feed to set */
  feed: FeedChoiceOneOf;
};

export type SetDefaultAppFeedResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetFeedMetadataRequest = {
  /** The feed to update */
  feed: Scalars['EvmAddress']['input'];
  /** The feed metadata to set */
  metadataUri: Scalars['String']['input'];
};

export type SetFeedMetadataResponse = {
  __typename?: 'SetFeedMetadataResponse';
  hash: Scalars['TxHash']['output'];
};

export type SetFeedMetadataResult = SelfFundedTransactionRequest | SetFeedMetadataResponse | SponsoredTransactionRequest | TransactionWillFail;

export type SetGraphMetadataRequest = {
  /** The graph to update */
  graph: Scalars['EvmAddress']['input'];
  /** The graph metadata to set */
  metadataUri: Scalars['String']['input'];
};

export type SetGraphMetadataResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetGroupMetadataRequest = {
  /** The group to update */
  group: Scalars['EvmAddress']['input'];
  /** The group metadata to set */
  metadataUri: Scalars['String']['input'];
};

export type SetGroupMetadataResponse = {
  __typename?: 'SetGroupMetadataResponse';
  hash: Scalars['TxHash']['output'];
};

export type SetGroupMetadataResult = SelfFundedTransactionRequest | SetGroupMetadataResponse | SponsoredTransactionRequest | TransactionWillFail;

export type SetNamespaceMetadataRequest = {
  /** The namespace metadata to set */
  metadataUri: Scalars['String']['input'];
  /** The namespace to update */
  namespace: Scalars['EvmAddress']['input'];
};

export type SetNamespaceMetadataResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SetSponsorshipMetadataRequest = {
  /** The sponsorship metadata to set */
  metadataUri: Scalars['URI']['input'];
  /** The sponsorship to update */
  sponsorship: Scalars['EvmAddress']['input'];
};

export type SetSponsorshipMetadataResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type SignedAuthChallenge = {
  id: Scalars['UUID']['input'];
  signature: Scalars['Signature']['input'];
};

export type SimpleCollectAction = {
  __typename?: 'SimpleCollectAction';
  address: Scalars['EvmAddress']['output'];
  collectLimit?: Maybe<Scalars['Int']['output']>;
  collectNftAddress: Scalars['EvmAddress']['output'];
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  followerOnGraph?: Maybe<FollowerOn>;
  isImmutable: Scalars['Boolean']['output'];
  payToCollect?: Maybe<PayToCollectConfig>;
};

export type SimpleCollectActionConfigInput = {
  collectLimit?: InputMaybe<Scalars['Int']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  followerOnGraph?: InputMaybe<FollowerOnInput>;
  isImmutable?: Scalars['Boolean']['input'];
  payToCollect?: InputMaybe<PayToCollectInput>;
};

export type SimpleCollectActionContract = {
  __typename?: 'SimpleCollectActionContract';
  address: Scalars['EvmAddress']['output'];
};

export type SimpleCollectExecuteInput = {
  /**
   * The list of referrers and their cut of the collect referral share.
   * This is calculated as a percentage of the referral share AFTER the
   * treasury fee is deducted.
   */
  referrals?: InputMaybe<Array<ReferralCut>>;
  selected: Scalars['AlwaysTrue']['input'];
};

export type SimpleCollectPostActionExecuted = {
  __typename?: 'SimpleCollectPostActionExecuted';
  action: SimpleCollectAction;
  executedAt: Scalars['DateTime']['output'];
  executedBy: Account;
};

export type SimpleCollectValidationFailed = {
  __typename?: 'SimpleCollectValidationFailed';
  reason: Scalars['String']['output'];
  reasonType: SimpleCollectValidationFailedReason;
};

export enum SimpleCollectValidationFailedReason {
  EndDateReached = 'END_DATE_REACHED',
  LimitReached = 'LIMIT_REACHED',
  NotAFollower = 'NOT_A_FOLLOWER',
  NotEnabled = 'NOT_ENABLED',
  NotEnoughBalance = 'NOT_ENOUGH_BALANCE',
  PostDeleted = 'POST_DELETED'
}

export type SimpleCollectValidationOutcome = SimpleCollectValidationFailed | SimpleCollectValidationPassed;

export type SimpleCollectValidationPassed = {
  __typename?: 'SimpleCollectValidationPassed';
  passed: Scalars['AlwaysTrue']['output'];
};

export type SimplePaymentFeedRuleConfig = {
  cost: AmountInput;
  recipient: Scalars['EvmAddress']['input'];
};

export type SimplePaymentFollowRuleConfig = {
  cost: AmountInput;
  recipient: Scalars['EvmAddress']['input'];
};

export type SimplePaymentGroupRuleConfig = {
  cost: AmountInput;
  recipient: Scalars['EvmAddress']['input'];
};

export enum SnsNotificationType {
  AccountActionExecuted = 'ACCOUNT_ACTION_EXECUTED',
  AccountBlocked = 'ACCOUNT_BLOCKED',
  AccountContentConsumed = 'ACCOUNT_CONTENT_CONSUMED',
  AccountCreated = 'ACCOUNT_CREATED',
  AccountFollowed = 'ACCOUNT_FOLLOWED',
  AccountFollowRulesUpdated = 'ACCOUNT_FOLLOW_RULES_UPDATED',
  AccountManagerAdded = 'ACCOUNT_MANAGER_ADDED',
  AccountManagerRemoved = 'ACCOUNT_MANAGER_REMOVED',
  AccountManagerUpdated = 'ACCOUNT_MANAGER_UPDATED',
  AccountMentioned = 'ACCOUNT_MENTIONED',
  AccountMetadataUpdated = 'ACCOUNT_METADATA_UPDATED',
  AccountOwnershipTransferred = 'ACCOUNT_OWNERSHIP_TRANSFERRED',
  AccountReported = 'ACCOUNT_REPORTED',
  AccountUnblocked = 'ACCOUNT_UNBLOCKED',
  AccountUnfollowed = 'ACCOUNT_UNFOLLOWED',
  AccountUsernameAssigned = 'ACCOUNT_USERNAME_ASSIGNED',
  AccountUsernameCreated = 'ACCOUNT_USERNAME_CREATED',
  AccountUsernameUnassigned = 'ACCOUNT_USERNAME_UNASSIGNED',
  MediaSnapshotError = 'MEDIA_SNAPSHOT_ERROR',
  MediaSnapshotSuccess = 'MEDIA_SNAPSHOT_SUCCESS',
  MetadataSnapshotError = 'METADATA_SNAPSHOT_ERROR',
  MetadataSnapshotSuccess = 'METADATA_SNAPSHOT_SUCCESS',
  MlAccountSignal = 'ML_ACCOUNT_SIGNAL',
  MlRecommendedAccountDismissed = 'ML_RECOMMENDED_ACCOUNT_DISMISSED',
  PostActionExecuted = 'POST_ACTION_EXECUTED',
  PostCollected = 'POST_COLLECTED',
  PostCreated = 'POST_CREATED',
  PostDeleted = 'POST_DELETED',
  PostEdited = 'POST_EDITED',
  PostReactionAdded = 'POST_REACTION_ADDED',
  PostReactionRemoved = 'POST_REACTION_REMOVED',
  PostReported = 'POST_REPORTED',
  RefreshMetadataError = 'REFRESH_METADATA_ERROR',
  RefreshMetadataSuccess = 'REFRESH_METADATA_SUCCESS'
}

export type SnsSubscription = {
  __typename?: 'SnsSubscription';
  account: Scalars['EvmAddress']['output'];
  app?: Maybe<Scalars['EvmAddress']['output']>;
  filter: Scalars['JSON']['output'];
  id: Scalars['UUID']['output'];
  topic: SnsNotificationType;
  topicArn: Scalars['String']['output'];
  webhook: Scalars['URL']['output'];
};

export type SnsTopicInput = {
  accountActionExecuted?: InputMaybe<AccountActionExecutedNotificationAttributes>;
  accountBlocked?: InputMaybe<AccountBlockedNotificationAttributes>;
  accountCreated?: InputMaybe<AccountCreatedNotificationAttributes>;
  accountFollowed?: InputMaybe<AccountFollowedNotificationAttributes>;
  accountManagerAdded?: InputMaybe<AccountManagerAddedNotificationAttributes>;
  accountManagerRemoved?: InputMaybe<AccountManagerRemovedNotificationAttributes>;
  accountManagerUpdated?: InputMaybe<AccountManagerUpdatedNotificationAttributes>;
  accountMentioned?: InputMaybe<AccountMentionedNotificationAttributes>;
  accountOwnershipTransferred?: InputMaybe<AccountOwnershipTransferredNotificationAttributes>;
  accountReported?: InputMaybe<AccountReportedNotificationAttributes>;
  accountUnblocked?: InputMaybe<AccountUnblockedNotificationAttributes>;
  accountUnfollowed?: InputMaybe<AccountUnfollowedNotificationAttributes>;
  accountUsernameAssigned?: InputMaybe<AccountUsernameAssignedNotificationAttributes>;
  accountUsernameCreated?: InputMaybe<AccountUsernameCreatedNotificationAttributes>;
  accountUsernameUnassigned?: InputMaybe<AccountUsernameUnassignedNotificationAttributes>;
  mediaSnapshotError?: InputMaybe<MediaSnapshotNotificationAttributes>;
  mediaSnapshotSuccess?: InputMaybe<MediaSnapshotNotificationAttributes>;
  metadataSnapshotError?: InputMaybe<MetadataSnapshotNotificationAttributes>;
  metadataSnapshotSuccess?: InputMaybe<MetadataSnapshotNotificationAttributes>;
  postActionExecuted?: InputMaybe<PostActionExecutedNotificationAttributes>;
  postCollected?: InputMaybe<PostCollectedNotificationAttributes>;
  postCreated?: InputMaybe<PostCreatedNotificationAttributes>;
  postDeleted?: InputMaybe<PostDeletedNotificationAttributes>;
  postEdited?: InputMaybe<PostEditedNotificationAttributes>;
  postReactionAdded?: InputMaybe<PostReactionAddedNotificationAttributes>;
  postReactionRemoved?: InputMaybe<PostReactionRemovedNotificationAttributes>;
  postReported?: InputMaybe<PostReportedNotificationAttributes>;
  refreshMetadataError?: InputMaybe<MetadataSnapshotNotificationAttributes>;
  refreshMetadataSuccess?: InputMaybe<MetadataSnapshotNotificationAttributes>;
};

export type SpaceMetadata = {
  __typename?: 'SpaceMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  /** The space join link. */
  link: Scalars['URI']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** The space start time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`). */
  startsAt: Scalars['DateTime']['output'];
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The space title. */
  title: Scalars['String']['output'];
};

export enum SponsoredFallbackReason {
  CannotDelegate = 'CANNOT_DELEGATE',
  RequiresSignature = 'REQUIRES_SIGNATURE',
  SignlessDisabled = 'SIGNLESS_DISABLED',
  SignlessFailed = 'SIGNLESS_FAILED'
}

export type SponsoredTransactionRequest = {
  __typename?: 'SponsoredTransactionRequest';
  /**
   * The raw transaction request object.
   *
   * Use this object if your library does not have a parser for the encoded transaction data.
   */
  raw: Eip712TransactionRequest;
  reason: Scalars['String']['output'];
  sponsoredReason?: Maybe<SponsoredFallbackReason>;
};

export type Sponsorship = {
  __typename?: 'Sponsorship';
  address: Scalars['EvmAddress']['output'];
  /**
   * Indicates whether the Lens API is authorized as the sponsorship signer
   * to sponsor end-user social operations (e.g., posts, comments, follows)
   * performed through the Lens API for apps associated with this sponsorship.
   */
  allowsLensAccess: Scalars['Boolean']['output'];
  /**
   * The native token balance of the sponsorship contract.
   *
   * This value is cached for up to 2 minutes for each sponsorship contract.
   */
  balance: Scalars['BigDecimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  isPaused: Scalars['Boolean']['output'];
  limits?: Maybe<SponsorshipLimits>;
  metadata?: Maybe<SponsorshipMetadata>;
  owner: Scalars['EvmAddress']['output'];
};

export type SponsorshipAllowance = {
  __typename?: 'SponsorshipAllowance';
  /** The total sponsorship allowance. */
  allowance: Scalars['Int']['output'];
  /** The number of remaining sponsorship allowance. */
  allowanceLeft: Scalars['Int']['output'];
  /** The number of sponsorship allowance used. */
  allowanceUsed: Scalars['Int']['output'];
  /** The sponsorship window type. */
  window: SponsorshipRateLimitWindow;
};

export type SponsorshipGrant = {
  __typename?: 'SponsorshipGrant';
  amount: NativeAmount;
  grantedAt: Scalars['DateTime']['output'];
  id: Scalars['GrantId']['output'];
};

export type SponsorshipGrantsFilter = {
  linkedToApp?: InputMaybe<Scalars['EvmAddress']['input']>;
  sponsorship?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type SponsorshipGrantsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The filter options. */
  filter: SponsorshipGrantsFilter;
  /** The page size. */
  pageSize?: PageSize;
};

export type SponsorshipGrantsResult = {
  __typename?: 'SponsorshipGrantsResult';
  items: Array<SponsorshipGrant>;
  pageInfo: PaginatedResultInfo;
};

export type SponsorshipLimitExclusionsFilter = {
  /** The sponsorship address. */
  sponsorship: Scalars['EvmAddress']['input'];
};

export enum SponsorshipLimitExclusionsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type SponsorshipLimitExclusionsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The filter options. */
  filter: SponsorshipLimitExclusionsFilter;
  /** The order by criteria. */
  orderBy?: SponsorshipLimitExclusionsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type SponsorshipLimits = {
  __typename?: 'SponsorshipLimits';
  global?: Maybe<SponsorshipRateLimit>;
  user?: Maybe<SponsorshipRateLimit>;
};

export type SponsorshipLimitsExclusionsResult = {
  __typename?: 'SponsorshipLimitsExclusionsResult';
  items: Array<SponsorshipLimitsExempt>;
  pageInfo: PaginatedResultInfo;
};

export type SponsorshipLimitsExempt = {
  __typename?: 'SponsorshipLimitsExempt';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
  label: Scalars['String']['output'];
  sponsorship: Scalars['EvmAddress']['output'];
};

export type SponsorshipMetadata = {
  __typename?: 'SponsorshipMetadata';
  /** An optional description of the Username collection. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
  /** The name of the Sponsorship. */
  name: Scalars['String']['output'];
};

export type SponsorshipRateLimit = {
  __typename?: 'SponsorshipRateLimit';
  limit: Scalars['Int']['output'];
  window: SponsorshipRateLimitWindow;
};

export type SponsorshipRateLimitInput = {
  /** The limit value. */
  limit: Scalars['Int']['input'];
  /** The limit time window. */
  window: SponsorshipRateLimitWindow;
};

export enum SponsorshipRateLimitWindow {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  Week = 'WEEK'
}

export type SponsorshipRateLimitsExempt = {
  /** The exempt address. */
  address: Scalars['EvmAddress']['input'];
  /** The human-readable label for the exempt address. */
  label: Scalars['String']['input'];
};

export type SponsorshipRateLimitsInput = {
  /** The global rate limit. */
  global?: InputMaybe<SponsorshipRateLimitInput>;
  /** The user rate limit. */
  user?: InputMaybe<SponsorshipRateLimitInput>;
};

export type SponsorshipRequest = {
  /** The Sponsorship address. */
  address?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The transaction hash you created the Sponsorship with. */
  txHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type SponsorshipSigner = {
  __typename?: 'SponsorshipSigner';
  address: Scalars['EvmAddress']['output'];
  createdAt: Scalars['DateTime']['output'];
  label: Scalars['String']['output'];
  sponsorship: Scalars['EvmAddress']['output'];
};

export type SponsorshipSignerInput = {
  /** The signer address */
  address: Scalars['EvmAddress']['input'];
  /** The human-readable label for the signer */
  label: Scalars['String']['input'];
};

export type SponsorshipSignersFilter = {
  /** The sponsorship address. */
  sponsorship: Scalars['EvmAddress']['input'];
};

export enum SponsorshipSignersOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type SponsorshipSignersRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The filter options. */
  filter: SponsorshipSignersFilter;
  /** The order by criteria. */
  orderBy?: SponsorshipSignersOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type SponsorshipSignersResult = {
  __typename?: 'SponsorshipSignersResult';
  items: Array<SponsorshipSigner>;
  pageInfo: PaginatedResultInfo;
};

export type SponsorshipsFilter = {
  /** The filter to get Sponsorships managed by address */
  managedBy: ManagedBy;
};

export enum SponsorshipsOrderBy {
  Alphabetical = 'ALPHABETICAL',
  LatestFirst = 'LATEST_FIRST',
  OldestFirst = 'OLDEST_FIRST'
}

export type SponsorshipsRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The filter options. */
  filter: SponsorshipsFilter;
  /** The order by criteria. */
  orderBy?: SponsorshipsOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type SponsorshipsResult = {
  __typename?: 'SponsorshipsResult';
  items: Array<Sponsorship>;
  pageInfo: PaginatedResultInfo;
};

export type StatsReactionRequest = {
  type: PostReactionType;
};

export type StoryMetadata = {
  __typename?: 'StoryMetadata';
  /** The story asset. */
  asset: AnyMedia;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type StringKeyValue = {
  __typename?: 'StringKeyValue';
  key: Scalars['String']['output'];
  string: Scalars['String']['output'];
};

export type SubOperationStatus = {
  __typename?: 'SubOperationStatus';
  operation: TransactionOperation;
  status: IndexingStatus;
};

export type SwitchAccountRequest = {
  account: Scalars['EvmAddress']['input'];
};

export type SwitchAccountResult = AuthenticationTokens | ForbiddenError;

export type TextOnlyMetadata = {
  __typename?: 'TextOnlyMetadata';
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export type ThreeDAsset = {
  __typename?: 'ThreeDAsset';
  /** The 3D format of the asset. */
  format: ThreeDAssetFormat;
  /** The license regulating the use of the 3D asset. */
  license?: Maybe<MetadataLicenseType>;
  /** The URL of the recommended web based 3D player to use to view the 3D asset. */
  playerUrl: Scalars['URI']['output'];
  /** The URI of the 3D asset zip file. */
  uri: Scalars['URI']['output'];
  /** Path in extracted zip. Relative. 3D start point, MUST be 3D file type. */
  zipPath?: Maybe<Scalars['String']['output']>;
};

export enum ThreeDAssetFormat {
  Fbx = 'FBX',
  GLtfGlb = 'G_LTF_GLB',
  Obj = 'OBJ',
  Vrm = 'VRM'
}

export type ThreeDMetadata = {
  __typename?: 'ThreeDMetadata';
  /** The 3D items for the post */
  assets: Array<ThreeDAsset>;
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
};

export enum TimelineEventItemType {
  Comment = 'COMMENT',
  Post = 'POST',
  Quote = 'QUOTE',
  Repost = 'REPOST'
}

export type TimelineFilter = {
  /** The apps to filter by. */
  apps?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The post event types to filter by. */
  eventType?: InputMaybe<Array<TimelineEventItemType>>;
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
  /** The optional metadata filter. */
  metadata?: InputMaybe<PostMetadataFilter>;
};

export type TimelineHighlightsFilter = {
  /** The apps to filter by. */
  apps?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** The feeds to filter by. */
  feeds?: InputMaybe<Array<FeedOneOf>>;
  metadata?: InputMaybe<PostMetadataFilter>;
};

export type TimelineHighlightsRequest = {
  /** The account to get timeline highlights for. */
  account: Scalars['EvmAddress']['input'];
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the timeline. */
  filter?: InputMaybe<TimelineHighlightsFilter>;
  pageSize?: PageSize;
};

export type TimelineItem = {
  __typename?: 'TimelineItem';
  comments: Array<Post>;
  id: Scalars['UUID']['output'];
  primary: Post;
  reposts: Array<Repost>;
};

export type TimelineRequest = {
  /** The account to get timeline for. */
  account: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** An optional filter to apply to the timeline. */
  filter?: InputMaybe<TimelineFilter>;
};

export enum TimezoneId {
  AfricaAbidjan = 'AFRICA_ABIDJAN',
  AfricaAccra = 'AFRICA_ACCRA',
  AfricaAddisAbaba = 'AFRICA_ADDIS_ABABA',
  AfricaAlgiers = 'AFRICA_ALGIERS',
  AfricaAsmera = 'AFRICA_ASMERA',
  AfricaBamako = 'AFRICA_BAMAKO',
  AfricaBangui = 'AFRICA_BANGUI',
  AfricaBanjul = 'AFRICA_BANJUL',
  AfricaBissau = 'AFRICA_BISSAU',
  AfricaBlantyre = 'AFRICA_BLANTYRE',
  AfricaBrazzaville = 'AFRICA_BRAZZAVILLE',
  AfricaBujumbura = 'AFRICA_BUJUMBURA',
  AfricaCairo = 'AFRICA_CAIRO',
  AfricaCasablanca = 'AFRICA_CASABLANCA',
  AfricaCeuta = 'AFRICA_CEUTA',
  AfricaConakry = 'AFRICA_CONAKRY',
  AfricaDakar = 'AFRICA_DAKAR',
  AfricaDarEsSalaam = 'AFRICA_DAR_ES_SALAAM',
  AfricaDjibouti = 'AFRICA_DJIBOUTI',
  AfricaDouala = 'AFRICA_DOUALA',
  AfricaElAaiun = 'AFRICA_EL_AAIUN',
  AfricaFreetown = 'AFRICA_FREETOWN',
  AfricaGaborone = 'AFRICA_GABORONE',
  AfricaHarare = 'AFRICA_HARARE',
  AfricaJohannesburg = 'AFRICA_JOHANNESBURG',
  AfricaJuba = 'AFRICA_JUBA',
  AfricaKampala = 'AFRICA_KAMPALA',
  AfricaKhartoum = 'AFRICA_KHARTOUM',
  AfricaKigali = 'AFRICA_KIGALI',
  AfricaKinshasa = 'AFRICA_KINSHASA',
  AfricaLagos = 'AFRICA_LAGOS',
  AfricaLibreville = 'AFRICA_LIBREVILLE',
  AfricaLome = 'AFRICA_LOME',
  AfricaLuanda = 'AFRICA_LUANDA',
  AfricaLubumbashi = 'AFRICA_LUBUMBASHI',
  AfricaLusaka = 'AFRICA_LUSAKA',
  AfricaMalabo = 'AFRICA_MALABO',
  AfricaMaputo = 'AFRICA_MAPUTO',
  AfricaMaseru = 'AFRICA_MASERU',
  AfricaMbabane = 'AFRICA_MBABANE',
  AfricaMogadishu = 'AFRICA_MOGADISHU',
  AfricaMonrovia = 'AFRICA_MONROVIA',
  AfricaNairobi = 'AFRICA_NAIROBI',
  AfricaNdjamena = 'AFRICA_NDJAMENA',
  AfricaNiamey = 'AFRICA_NIAMEY',
  AfricaNouakchott = 'AFRICA_NOUAKCHOTT',
  AfricaOuagadougou = 'AFRICA_OUAGADOUGOU',
  AfricaPortoNovo = 'AFRICA_PORTO_NOVO',
  AfricaSaoTome = 'AFRICA_SAO_TOME',
  AfricaTripoli = 'AFRICA_TRIPOLI',
  AfricaTunis = 'AFRICA_TUNIS',
  AfricaWindhoek = 'AFRICA_WINDHOEK',
  AmericaAdak = 'AMERICA_ADAK',
  AmericaAnchorage = 'AMERICA_ANCHORAGE',
  AmericaAnguilla = 'AMERICA_ANGUILLA',
  AmericaAntigua = 'AMERICA_ANTIGUA',
  AmericaAraguaina = 'AMERICA_ARAGUAINA',
  AmericaArgentinaLaRioja = 'AMERICA_ARGENTINA_LA_RIOJA',
  AmericaArgentinaRioGallegos = 'AMERICA_ARGENTINA_RIO_GALLEGOS',
  AmericaArgentinaSalta = 'AMERICA_ARGENTINA_SALTA',
  AmericaArgentinaSanJuan = 'AMERICA_ARGENTINA_SAN_JUAN',
  AmericaArgentinaSanLuis = 'AMERICA_ARGENTINA_SAN_LUIS',
  AmericaArgentinaTucuman = 'AMERICA_ARGENTINA_TUCUMAN',
  AmericaArgentinaUshuaia = 'AMERICA_ARGENTINA_USHUAIA',
  AmericaAruba = 'AMERICA_ARUBA',
  AmericaAsuncion = 'AMERICA_ASUNCION',
  AmericaBahia = 'AMERICA_BAHIA',
  AmericaBahiaBanderas = 'AMERICA_BAHIA_BANDERAS',
  AmericaBarbados = 'AMERICA_BARBADOS',
  AmericaBelem = 'AMERICA_BELEM',
  AmericaBelize = 'AMERICA_BELIZE',
  AmericaBlancSablon = 'AMERICA_BLANC_SABLON',
  AmericaBoaVista = 'AMERICA_BOA_VISTA',
  AmericaBogota = 'AMERICA_BOGOTA',
  AmericaBoise = 'AMERICA_BOISE',
  AmericaBuenosAires = 'AMERICA_BUENOS_AIRES',
  AmericaCambridgeBay = 'AMERICA_CAMBRIDGE_BAY',
  AmericaCampoGrande = 'AMERICA_CAMPO_GRANDE',
  AmericaCancun = 'AMERICA_CANCUN',
  AmericaCaracas = 'AMERICA_CARACAS',
  AmericaCatamarca = 'AMERICA_CATAMARCA',
  AmericaCayenne = 'AMERICA_CAYENNE',
  AmericaCayman = 'AMERICA_CAYMAN',
  AmericaChicago = 'AMERICA_CHICAGO',
  AmericaChihuahua = 'AMERICA_CHIHUAHUA',
  AmericaCiudadJuarez = 'AMERICA_CIUDAD_JUAREZ',
  AmericaCoralHarbour = 'AMERICA_CORAL_HARBOUR',
  AmericaCordoba = 'AMERICA_CORDOBA',
  AmericaCostaRica = 'AMERICA_COSTA_RICA',
  AmericaCreston = 'AMERICA_CRESTON',
  AmericaCuiaba = 'AMERICA_CUIABA',
  AmericaCuracao = 'AMERICA_CURACAO',
  AmericaDanmarkshavn = 'AMERICA_DANMARKSHAVN',
  AmericaDawson = 'AMERICA_DAWSON',
  AmericaDawsonCreek = 'AMERICA_DAWSON_CREEK',
  AmericaDenver = 'AMERICA_DENVER',
  AmericaDetroit = 'AMERICA_DETROIT',
  AmericaDominica = 'AMERICA_DOMINICA',
  AmericaEdmonton = 'AMERICA_EDMONTON',
  AmericaEirunepe = 'AMERICA_EIRUNEPE',
  AmericaElSalvador = 'AMERICA_EL_SALVADOR',
  AmericaFortaleza = 'AMERICA_FORTALEZA',
  AmericaFortNelson = 'AMERICA_FORT_NELSON',
  AmericaGlaceBay = 'AMERICA_GLACE_BAY',
  AmericaGodthab = 'AMERICA_GODTHAB',
  AmericaGooseBay = 'AMERICA_GOOSE_BAY',
  AmericaGrandTurk = 'AMERICA_GRAND_TURK',
  AmericaGrenada = 'AMERICA_GRENADA',
  AmericaGuadeloupe = 'AMERICA_GUADELOUPE',
  AmericaGuatemala = 'AMERICA_GUATEMALA',
  AmericaGuayaquil = 'AMERICA_GUAYAQUIL',
  AmericaGuyana = 'AMERICA_GUYANA',
  AmericaHalifax = 'AMERICA_HALIFAX',
  AmericaHavana = 'AMERICA_HAVANA',
  AmericaHermosillo = 'AMERICA_HERMOSILLO',
  AmericaIndianapolis = 'AMERICA_INDIANAPOLIS',
  AmericaIndianaKnox = 'AMERICA_INDIANA_KNOX',
  AmericaIndianaMarengo = 'AMERICA_INDIANA_MARENGO',
  AmericaIndianaPetersburg = 'AMERICA_INDIANA_PETERSBURG',
  AmericaIndianaTellCity = 'AMERICA_INDIANA_TELL_CITY',
  AmericaIndianaVevay = 'AMERICA_INDIANA_VEVAY',
  AmericaIndianaVincennes = 'AMERICA_INDIANA_VINCENNES',
  AmericaIndianaWinamac = 'AMERICA_INDIANA_WINAMAC',
  AmericaInuvik = 'AMERICA_INUVIK',
  AmericaIqaluit = 'AMERICA_IQALUIT',
  AmericaJamaica = 'AMERICA_JAMAICA',
  AmericaJujuy = 'AMERICA_JUJUY',
  AmericaJuneau = 'AMERICA_JUNEAU',
  AmericaKentuckyMonticello = 'AMERICA_KENTUCKY_MONTICELLO',
  AmericaKralendijk = 'AMERICA_KRALENDIJK',
  AmericaLaPaz = 'AMERICA_LA_PAZ',
  AmericaLima = 'AMERICA_LIMA',
  AmericaLosAngeles = 'AMERICA_LOS_ANGELES',
  AmericaLouisville = 'AMERICA_LOUISVILLE',
  AmericaLowerPrinces = 'AMERICA_LOWER_PRINCES',
  AmericaMaceio = 'AMERICA_MACEIO',
  AmericaManagua = 'AMERICA_MANAGUA',
  AmericaManaus = 'AMERICA_MANAUS',
  AmericaMarigot = 'AMERICA_MARIGOT',
  AmericaMartinique = 'AMERICA_MARTINIQUE',
  AmericaMatamoros = 'AMERICA_MATAMOROS',
  AmericaMazatlan = 'AMERICA_MAZATLAN',
  AmericaMendoza = 'AMERICA_MENDOZA',
  AmericaMenominee = 'AMERICA_MENOMINEE',
  AmericaMerida = 'AMERICA_MERIDA',
  AmericaMetlakatla = 'AMERICA_METLAKATLA',
  AmericaMexicoCity = 'AMERICA_MEXICO_CITY',
  AmericaMiquelon = 'AMERICA_MIQUELON',
  AmericaMoncton = 'AMERICA_MONCTON',
  AmericaMonterrey = 'AMERICA_MONTERREY',
  AmericaMontevideo = 'AMERICA_MONTEVIDEO',
  AmericaMontserrat = 'AMERICA_MONTSERRAT',
  AmericaNassau = 'AMERICA_NASSAU',
  AmericaNewYork = 'AMERICA_NEW_YORK',
  AmericaNipigon = 'AMERICA_NIPIGON',
  AmericaNome = 'AMERICA_NOME',
  AmericaNoronha = 'AMERICA_NORONHA',
  AmericaNorthDakotaBeulah = 'AMERICA_NORTH_DAKOTA_BEULAH',
  AmericaNorthDakotaCenter = 'AMERICA_NORTH_DAKOTA_CENTER',
  AmericaNorthDakotaNewSalem = 'AMERICA_NORTH_DAKOTA_NEW_SALEM',
  AmericaOjinaga = 'AMERICA_OJINAGA',
  AmericaPanama = 'AMERICA_PANAMA',
  AmericaPangnirtung = 'AMERICA_PANGNIRTUNG',
  AmericaParamaribo = 'AMERICA_PARAMARIBO',
  AmericaPhoenix = 'AMERICA_PHOENIX',
  AmericaPortoVelho = 'AMERICA_PORTO_VELHO',
  AmericaPortAuPrince = 'AMERICA_PORT_AU_PRINCE',
  AmericaPortOfSpain = 'AMERICA_PORT_OF_SPAIN',
  AmericaPuertoRico = 'AMERICA_PUERTO_RICO',
  AmericaPuntaArenas = 'AMERICA_PUNTA_ARENAS',
  AmericaRainyRiver = 'AMERICA_RAINY_RIVER',
  AmericaRankinInlet = 'AMERICA_RANKIN_INLET',
  AmericaRecife = 'AMERICA_RECIFE',
  AmericaRegina = 'AMERICA_REGINA',
  AmericaResolute = 'AMERICA_RESOLUTE',
  AmericaRioBranco = 'AMERICA_RIO_BRANCO',
  AmericaSantarem = 'AMERICA_SANTAREM',
  AmericaSantaIsabel = 'AMERICA_SANTA_ISABEL',
  AmericaSantiago = 'AMERICA_SANTIAGO',
  AmericaSantoDomingo = 'AMERICA_SANTO_DOMINGO',
  AmericaSaoPaulo = 'AMERICA_SAO_PAULO',
  AmericaScoresbysund = 'AMERICA_SCORESBYSUND',
  AmericaSitka = 'AMERICA_SITKA',
  AmericaStBarthelemy = 'AMERICA_ST_BARTHELEMY',
  AmericaStJohns = 'AMERICA_ST_JOHNS',
  AmericaStKitts = 'AMERICA_ST_KITTS',
  AmericaStLucia = 'AMERICA_ST_LUCIA',
  AmericaStThomas = 'AMERICA_ST_THOMAS',
  AmericaStVincent = 'AMERICA_ST_VINCENT',
  AmericaSwiftCurrent = 'AMERICA_SWIFT_CURRENT',
  AmericaTegucigalpa = 'AMERICA_TEGUCIGALPA',
  AmericaThule = 'AMERICA_THULE',
  AmericaThunderBay = 'AMERICA_THUNDER_BAY',
  AmericaTijuana = 'AMERICA_TIJUANA',
  AmericaToronto = 'AMERICA_TORONTO',
  AmericaTortola = 'AMERICA_TORTOLA',
  AmericaVancouver = 'AMERICA_VANCOUVER',
  AmericaWhitehorse = 'AMERICA_WHITEHORSE',
  AmericaWinnipeg = 'AMERICA_WINNIPEG',
  AmericaYakutat = 'AMERICA_YAKUTAT',
  AmericaYellowknife = 'AMERICA_YELLOWKNIFE',
  AntarcticaCasey = 'ANTARCTICA_CASEY',
  AntarcticaDavis = 'ANTARCTICA_DAVIS',
  AntarcticaDumontDUrville = 'ANTARCTICA_DUMONT_D_URVILLE',
  AntarcticaMacquarie = 'ANTARCTICA_MACQUARIE',
  AntarcticaMawson = 'ANTARCTICA_MAWSON',
  AntarcticaMcMurdo = 'ANTARCTICA_MC_MURDO',
  AntarcticaPalmer = 'ANTARCTICA_PALMER',
  AntarcticaRothera = 'ANTARCTICA_ROTHERA',
  AntarcticaSyowa = 'ANTARCTICA_SYOWA',
  AntarcticaTroll = 'ANTARCTICA_TROLL',
  AntarcticaVostok = 'ANTARCTICA_VOSTOK',
  ArcticLongyearbyen = 'ARCTIC_LONGYEARBYEN',
  AsiaAden = 'ASIA_ADEN',
  AsiaAlmaty = 'ASIA_ALMATY',
  AsiaAmman = 'ASIA_AMMAN',
  AsiaAnadyr = 'ASIA_ANADYR',
  AsiaAqtau = 'ASIA_AQTAU',
  AsiaAqtobe = 'ASIA_AQTOBE',
  AsiaAshgabat = 'ASIA_ASHGABAT',
  AsiaAtyrau = 'ASIA_ATYRAU',
  AsiaBaghdad = 'ASIA_BAGHDAD',
  AsiaBahrain = 'ASIA_BAHRAIN',
  AsiaBaku = 'ASIA_BAKU',
  AsiaBangkok = 'ASIA_BANGKOK',
  AsiaBarnaul = 'ASIA_BARNAUL',
  AsiaBeirut = 'ASIA_BEIRUT',
  AsiaBishkek = 'ASIA_BISHKEK',
  AsiaBrunei = 'ASIA_BRUNEI',
  AsiaCalcutta = 'ASIA_CALCUTTA',
  AsiaChita = 'ASIA_CHITA',
  AsiaChoibalsan = 'ASIA_CHOIBALSAN',
  AsiaColombo = 'ASIA_COLOMBO',
  AsiaDamascus = 'ASIA_DAMASCUS',
  AsiaDhaka = 'ASIA_DHAKA',
  AsiaDili = 'ASIA_DILI',
  AsiaDubai = 'ASIA_DUBAI',
  AsiaDushanbe = 'ASIA_DUSHANBE',
  AsiaFamagusta = 'ASIA_FAMAGUSTA',
  AsiaGaza = 'ASIA_GAZA',
  AsiaHebron = 'ASIA_HEBRON',
  AsiaHongKong = 'ASIA_HONG_KONG',
  AsiaHovd = 'ASIA_HOVD',
  AsiaIrkutsk = 'ASIA_IRKUTSK',
  AsiaJakarta = 'ASIA_JAKARTA',
  AsiaJayapura = 'ASIA_JAYAPURA',
  AsiaJerusalem = 'ASIA_JERUSALEM',
  AsiaKabul = 'ASIA_KABUL',
  AsiaKamchatka = 'ASIA_KAMCHATKA',
  AsiaKarachi = 'ASIA_KARACHI',
  AsiaKatmandu = 'ASIA_KATMANDU',
  AsiaKhandyga = 'ASIA_KHANDYGA',
  AsiaKrasnoyarsk = 'ASIA_KRASNOYARSK',
  AsiaKualaLumpur = 'ASIA_KUALA_LUMPUR',
  AsiaKuching = 'ASIA_KUCHING',
  AsiaKuwait = 'ASIA_KUWAIT',
  AsiaMacau = 'ASIA_MACAU',
  AsiaMagadan = 'ASIA_MAGADAN',
  AsiaMakassar = 'ASIA_MAKASSAR',
  AsiaManila = 'ASIA_MANILA',
  AsiaMuscat = 'ASIA_MUSCAT',
  AsiaNicosia = 'ASIA_NICOSIA',
  AsiaNovokuznetsk = 'ASIA_NOVOKUZNETSK',
  AsiaNovosibirsk = 'ASIA_NOVOSIBIRSK',
  AsiaOmsk = 'ASIA_OMSK',
  AsiaOral = 'ASIA_ORAL',
  AsiaPhnomPenh = 'ASIA_PHNOM_PENH',
  AsiaPontianak = 'ASIA_PONTIANAK',
  AsiaPyongyang = 'ASIA_PYONGYANG',
  AsiaQatar = 'ASIA_QATAR',
  AsiaQostanay = 'ASIA_QOSTANAY',
  AsiaQyzylorda = 'ASIA_QYZYLORDA',
  AsiaRangoon = 'ASIA_RANGOON',
  AsiaRiyadh = 'ASIA_RIYADH',
  AsiaSaigon = 'ASIA_SAIGON',
  AsiaSakhalin = 'ASIA_SAKHALIN',
  AsiaSamarkand = 'ASIA_SAMARKAND',
  AsiaSeoul = 'ASIA_SEOUL',
  AsiaShanghai = 'ASIA_SHANGHAI',
  AsiaSingapore = 'ASIA_SINGAPORE',
  AsiaSrednekolymsk = 'ASIA_SREDNEKOLYMSK',
  AsiaTaipei = 'ASIA_TAIPEI',
  AsiaTashkent = 'ASIA_TASHKENT',
  AsiaTbilisi = 'ASIA_TBILISI',
  AsiaTehran = 'ASIA_TEHRAN',
  AsiaThimphu = 'ASIA_THIMPHU',
  AsiaTokyo = 'ASIA_TOKYO',
  AsiaTomsk = 'ASIA_TOMSK',
  AsiaUlaanbaatar = 'ASIA_ULAANBAATAR',
  AsiaUrumqi = 'ASIA_URUMQI',
  AsiaUstNera = 'ASIA_UST_NERA',
  AsiaVientiane = 'ASIA_VIENTIANE',
  AsiaVladivostok = 'ASIA_VLADIVOSTOK',
  AsiaYakutsk = 'ASIA_YAKUTSK',
  AsiaYekaterinburg = 'ASIA_YEKATERINBURG',
  AsiaYerevan = 'ASIA_YEREVAN',
  AtlanticAzores = 'ATLANTIC_AZORES',
  AtlanticBermuda = 'ATLANTIC_BERMUDA',
  AtlanticCanary = 'ATLANTIC_CANARY',
  AtlanticCapeVerde = 'ATLANTIC_CAPE_VERDE',
  AtlanticFaeroe = 'ATLANTIC_FAEROE',
  AtlanticMadeira = 'ATLANTIC_MADEIRA',
  AtlanticReykjavik = 'ATLANTIC_REYKJAVIK',
  AtlanticSouthGeorgia = 'ATLANTIC_SOUTH_GEORGIA',
  AtlanticStanley = 'ATLANTIC_STANLEY',
  AtlanticStHelena = 'ATLANTIC_ST_HELENA',
  AustraliaAdelaide = 'AUSTRALIA_ADELAIDE',
  AustraliaBrisbane = 'AUSTRALIA_BRISBANE',
  AustraliaBrokenHill = 'AUSTRALIA_BROKEN_HILL',
  AustraliaCurrie = 'AUSTRALIA_CURRIE',
  AustraliaDarwin = 'AUSTRALIA_DARWIN',
  AustraliaEucla = 'AUSTRALIA_EUCLA',
  AustraliaHobart = 'AUSTRALIA_HOBART',
  AustraliaLindeman = 'AUSTRALIA_LINDEMAN',
  AustraliaLordHowe = 'AUSTRALIA_LORD_HOWE',
  AustraliaMelbourne = 'AUSTRALIA_MELBOURNE',
  AustraliaPerth = 'AUSTRALIA_PERTH',
  AustraliaSydney = 'AUSTRALIA_SYDNEY',
  EuropeAmsterdam = 'EUROPE_AMSTERDAM',
  EuropeAndorra = 'EUROPE_ANDORRA',
  EuropeAstrakhan = 'EUROPE_ASTRAKHAN',
  EuropeAthens = 'EUROPE_ATHENS',
  EuropeBelgrade = 'EUROPE_BELGRADE',
  EuropeBerlin = 'EUROPE_BERLIN',
  EuropeBratislava = 'EUROPE_BRATISLAVA',
  EuropeBrussels = 'EUROPE_BRUSSELS',
  EuropeBucharest = 'EUROPE_BUCHAREST',
  EuropeBudapest = 'EUROPE_BUDAPEST',
  EuropeBusingen = 'EUROPE_BUSINGEN',
  EuropeChisinau = 'EUROPE_CHISINAU',
  EuropeCopenhagen = 'EUROPE_COPENHAGEN',
  EuropeDublin = 'EUROPE_DUBLIN',
  EuropeGibraltar = 'EUROPE_GIBRALTAR',
  EuropeGuernsey = 'EUROPE_GUERNSEY',
  EuropeHelsinki = 'EUROPE_HELSINKI',
  EuropeIsleOfMan = 'EUROPE_ISLE_OF_MAN',
  EuropeIstanbul = 'EUROPE_ISTANBUL',
  EuropeJersey = 'EUROPE_JERSEY',
  EuropeKaliningrad = 'EUROPE_KALININGRAD',
  EuropeKiev = 'EUROPE_KIEV',
  EuropeKirov = 'EUROPE_KIROV',
  EuropeLisbon = 'EUROPE_LISBON',
  EuropeLjubljana = 'EUROPE_LJUBLJANA',
  EuropeLondon = 'EUROPE_LONDON',
  EuropeLuxembourg = 'EUROPE_LUXEMBOURG',
  EuropeMadrid = 'EUROPE_MADRID',
  EuropeMalta = 'EUROPE_MALTA',
  EuropeMariehamn = 'EUROPE_MARIEHAMN',
  EuropeMinsk = 'EUROPE_MINSK',
  EuropeMonaco = 'EUROPE_MONACO',
  EuropeMoscow = 'EUROPE_MOSCOW',
  EuropeOslo = 'EUROPE_OSLO',
  EuropeParis = 'EUROPE_PARIS',
  EuropePodgorica = 'EUROPE_PODGORICA',
  EuropePrague = 'EUROPE_PRAGUE',
  EuropeRiga = 'EUROPE_RIGA',
  EuropeRome = 'EUROPE_ROME',
  EuropeSamara = 'EUROPE_SAMARA',
  EuropeSanMarino = 'EUROPE_SAN_MARINO',
  EuropeSarajevo = 'EUROPE_SARAJEVO',
  EuropeSaratov = 'EUROPE_SARATOV',
  EuropeSimferopol = 'EUROPE_SIMFEROPOL',
  EuropeSkopje = 'EUROPE_SKOPJE',
  EuropeSofia = 'EUROPE_SOFIA',
  EuropeStockholm = 'EUROPE_STOCKHOLM',
  EuropeTallinn = 'EUROPE_TALLINN',
  EuropeTirane = 'EUROPE_TIRANE',
  EuropeUlyanovsk = 'EUROPE_ULYANOVSK',
  EuropeUzhgorod = 'EUROPE_UZHGOROD',
  EuropeVaduz = 'EUROPE_VADUZ',
  EuropeVatican = 'EUROPE_VATICAN',
  EuropeVienna = 'EUROPE_VIENNA',
  EuropeVilnius = 'EUROPE_VILNIUS',
  EuropeVolgograd = 'EUROPE_VOLGOGRAD',
  EuropeWarsaw = 'EUROPE_WARSAW',
  EuropeZagreb = 'EUROPE_ZAGREB',
  EuropeZaporozhye = 'EUROPE_ZAPOROZHYE',
  EuropeZurich = 'EUROPE_ZURICH',
  IndianAntananarivo = 'INDIAN_ANTANANARIVO',
  IndianChagos = 'INDIAN_CHAGOS',
  IndianChristmas = 'INDIAN_CHRISTMAS',
  IndianCocos = 'INDIAN_COCOS',
  IndianComoro = 'INDIAN_COMORO',
  IndianKerguelen = 'INDIAN_KERGUELEN',
  IndianMahe = 'INDIAN_MAHE',
  IndianMaldives = 'INDIAN_MALDIVES',
  IndianMauritius = 'INDIAN_MAURITIUS',
  IndianMayotte = 'INDIAN_MAYOTTE',
  IndianReunion = 'INDIAN_REUNION',
  PacificApia = 'PACIFIC_APIA',
  PacificAuckland = 'PACIFIC_AUCKLAND',
  PacificBougainville = 'PACIFIC_BOUGAINVILLE',
  PacificChatham = 'PACIFIC_CHATHAM',
  PacificEaster = 'PACIFIC_EASTER',
  PacificEfate = 'PACIFIC_EFATE',
  PacificEnderbury = 'PACIFIC_ENDERBURY',
  PacificFakaofo = 'PACIFIC_FAKAOFO',
  PacificFiji = 'PACIFIC_FIJI',
  PacificFunafuti = 'PACIFIC_FUNAFUTI',
  PacificGalapagos = 'PACIFIC_GALAPAGOS',
  PacificGambier = 'PACIFIC_GAMBIER',
  PacificGuadalcanal = 'PACIFIC_GUADALCANAL',
  PacificGuam = 'PACIFIC_GUAM',
  PacificHonolulu = 'PACIFIC_HONOLULU',
  PacificJohnston = 'PACIFIC_JOHNSTON',
  PacificKiritimati = 'PACIFIC_KIRITIMATI',
  PacificKosrae = 'PACIFIC_KOSRAE',
  PacificKwajalein = 'PACIFIC_KWAJALEIN',
  PacificMajuro = 'PACIFIC_MAJURO',
  PacificMarquesas = 'PACIFIC_MARQUESAS',
  PacificMidway = 'PACIFIC_MIDWAY',
  PacificNauru = 'PACIFIC_NAURU',
  PacificNiue = 'PACIFIC_NIUE',
  PacificNorfolk = 'PACIFIC_NORFOLK',
  PacificNoumea = 'PACIFIC_NOUMEA',
  PacificPagoPago = 'PACIFIC_PAGO_PAGO',
  PacificPalau = 'PACIFIC_PALAU',
  PacificPitcairn = 'PACIFIC_PITCAIRN',
  PacificPonape = 'PACIFIC_PONAPE',
  PacificPortMoresby = 'PACIFIC_PORT_MORESBY',
  PacificRarotonga = 'PACIFIC_RAROTONGA',
  PacificSaipan = 'PACIFIC_SAIPAN',
  PacificTahiti = 'PACIFIC_TAHITI',
  PacificTarawa = 'PACIFIC_TARAWA',
  PacificTongatapu = 'PACIFIC_TONGATAPU',
  PacificTruk = 'PACIFIC_TRUK',
  PacificWake = 'PACIFIC_WAKE',
  PacificWallis = 'PACIFIC_WALLIS'
}

export type TippingAccountAction = {
  __typename?: 'TippingAccountAction';
  address: Scalars['EvmAddress']['output'];
};

export type TippingAccountActionExecuted = {
  __typename?: 'TippingAccountActionExecuted';
  amount: Erc20Amount;
  executedAt: Scalars['DateTime']['output'];
  executedBy: Account;
};

export type TippingAmountInput = {
  /**
   * The token address.
   * Currently, only ERC20 tokens are supported.
   */
  currency: Scalars['EvmAddress']['input'];
  /**
   * The list of referrers and their cut of the referral share.
   * This is calculated as a percentage of the referral share AFTER the
   * treasury fee is deducted.
   * The tip referral share is capped at 20%.
   */
  referrals?: InputMaybe<Array<ReferralCut>>;
  /**
   * Token value in its main unit (e.g., 1.5 WGHO), NOT in the smallest fraction (e.g.,
   * wei).
   */
  value: Scalars['BigDecimal']['input'];
};

export type TippingPostActionContract = {
  __typename?: 'TippingPostActionContract';
  address: Scalars['EvmAddress']['output'];
};

export type TippingPostActionExecuted = {
  __typename?: 'TippingPostActionExecuted';
  amount: Erc20Amount;
  executedAt: Scalars['DateTime']['output'];
  executedBy: Account;
};

export type TokenAmountInput = {
  /**
   * The token address. To represent the native token, use the
   * 0x000000000000000000000000000000000000800a.
   */
  currency: Scalars['EvmAddress']['input'];
  standard: TokenStandard;
  /** Optional, only for ERC-1155 tokens. */
  typeId?: InputMaybe<Scalars['BigInt']['input']>;
  /**
   * Token value in its main unit (e.g., 1.5 DAI), not in the smallest fraction (e.g.,
   * wei).
   */
  value: Scalars['BigDecimal']['input'];
};

export type TokenGatedFeedRuleConfig = {
  token: TokenAmountInput;
};

export type TokenGatedFollowRuleConfig = {
  token: TokenAmountInput;
};

export type TokenGatedGraphRuleConfig = {
  token: TokenAmountInput;
};

export type TokenGatedGroupRuleConfig = {
  token: TokenAmountInput;
};

export type TokenGatedNamespaceRuleConfig = {
  token: TokenAmountInput;
};

export enum TokenStandard {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type TransactionMetadata = {
  __typename?: 'TransactionMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  /** The Chain Id. */
  chainId: Scalars['ChainId']['output'];
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The transaction hash. */
  txHash: Scalars['String']['output'];
  /** The type of transaction. */
  type: TransactionType;
};

export enum TransactionOperation {
  AccessControlFactoryOwnerAdminDeployment = 'ACCESS_CONTROL_FACTORY_OWNER_ADMIN_DEPLOYMENT',
  AccessControlRoleGranted = 'ACCESS_CONTROL_ROLE_GRANTED',
  AccessControlRoleRevoked = 'ACCESS_CONTROL_ROLE_REVOKED',
  AccountActionConfigured = 'ACCOUNT_ACTION_CONFIGURED',
  AccountActionDisabled = 'ACCOUNT_ACTION_DISABLED',
  AccountActionEnabled = 'ACCOUNT_ACTION_ENABLED',
  AccountActionExecuted = 'ACCOUNT_ACTION_EXECUTED',
  AccountActionReconfigured = 'ACCOUNT_ACTION_RECONFIGURED',
  AccountBlocked = 'ACCOUNT_BLOCKED',
  AccountExtraDataAdded = 'ACCOUNT_EXTRA_DATA_ADDED',
  AccountExtraDataRemoved = 'ACCOUNT_EXTRA_DATA_REMOVED',
  AccountExtraDataUpdated = 'ACCOUNT_EXTRA_DATA_UPDATED',
  AccountFactoryDeployment = 'ACCOUNT_FACTORY_DEPLOYMENT',
  AccountManagerAdded = 'ACCOUNT_MANAGER_ADDED',
  AccountManagerRemoved = 'ACCOUNT_MANAGER_REMOVED',
  AccountManagerUpdated = 'ACCOUNT_MANAGER_UPDATED',
  AccountMetadataUriSet = 'ACCOUNT_METADATA_URI_SET',
  AccountOwnerTransferred = 'ACCOUNT_OWNER_TRANSFERRED',
  AccountUnblocked = 'ACCOUNT_UNBLOCKED',
  ActionMetadataUriSet = 'ACTION_METADATA_URI_SET',
  AppAccessControlAdded = 'APP_ACCESS_CONTROL_ADDED',
  AppAccessControlUpdated = 'APP_ACCESS_CONTROL_UPDATED',
  AppDefaultFeedSet = 'APP_DEFAULT_FEED_SET',
  AppExtraDataAdded = 'APP_EXTRA_DATA_ADDED',
  AppExtraDataRemoved = 'APP_EXTRA_DATA_REMOVED',
  AppExtraDataUpdated = 'APP_EXTRA_DATA_UPDATED',
  AppFactoryDeployment = 'APP_FACTORY_DEPLOYMENT',
  AppFeedAdded = 'APP_FEED_ADDED',
  AppFeedRemoved = 'APP_FEED_REMOVED',
  AppGraphAdded = 'APP_GRAPH_ADDED',
  AppGraphRemoved = 'APP_GRAPH_REMOVED',
  AppGroupAdded = 'APP_GROUP_ADDED',
  AppGroupRemoved = 'APP_GROUP_REMOVED',
  AppMetadataUriSet = 'APP_METADATA_URI_SET',
  AppNamespaceAdded = 'APP_NAMESPACE_ADDED',
  AppNamespaceRemoved = 'APP_NAMESPACE_REMOVED',
  AppPaymasterAdded = 'APP_PAYMASTER_ADDED',
  AppPaymasterRemoved = 'APP_PAYMASTER_REMOVED',
  AppSignerAdded = 'APP_SIGNER_ADDED',
  AppSignerRemoved = 'APP_SIGNER_REMOVED',
  AppSourceStampVerificationSet = 'APP_SOURCE_STAMP_VERIFICATION_SET',
  AppTreasurySet = 'APP_TREASURY_SET',
  FeedAccessControlAdded = 'FEED_ACCESS_CONTROL_ADDED',
  FeedAccessControlUpdated = 'FEED_ACCESS_CONTROL_UPDATED',
  FeedExtraDataAdded = 'FEED_EXTRA_DATA_ADDED',
  FeedExtraDataRemoved = 'FEED_EXTRA_DATA_REMOVED',
  FeedExtraDataUpdated = 'FEED_EXTRA_DATA_UPDATED',
  FeedFactoryDeployment = 'FEED_FACTORY_DEPLOYMENT',
  FeedMetadataUriSet = 'FEED_METADATA_URI_SET',
  FeedPostCreated = 'FEED_POST_CREATED',
  FeedPostDeleted = 'FEED_POST_DELETED',
  FeedPostEdited = 'FEED_POST_EDITED',
  FeedPostExtraDataAdded = 'FEED_POST_EXTRA_DATA_ADDED',
  FeedPostExtraDataRemoved = 'FEED_POST_EXTRA_DATA_REMOVED',
  FeedPostExtraDataUpdated = 'FEED_POST_EXTRA_DATA_UPDATED',
  FeedPostRuleConfigured = 'FEED_POST_RULE_CONFIGURED',
  FeedPostRuleReconfigured = 'FEED_POST_RULE_RECONFIGURED',
  FeedPostRuleSelectorDisabled = 'FEED_POST_RULE_SELECTOR_DISABLED',
  FeedPostRuleSelectorEnabled = 'FEED_POST_RULE_SELECTOR_ENABLED',
  FeedRuleConfigured = 'FEED_RULE_CONFIGURED',
  FeedRuleReconfigured = 'FEED_RULE_RECONFIGURED',
  FeedRuleSelectorDisabled = 'FEED_RULE_SELECTOR_DISABLED',
  FeedRuleSelectorEnabled = 'FEED_RULE_SELECTOR_ENABLED',
  GraphAccessControlAdded = 'GRAPH_ACCESS_CONTROL_ADDED',
  GraphAccessControlUpdated = 'GRAPH_ACCESS_CONTROL_UPDATED',
  GraphExtraDataAdded = 'GRAPH_EXTRA_DATA_ADDED',
  GraphExtraDataRemoved = 'GRAPH_EXTRA_DATA_REMOVED',
  GraphExtraDataUpdated = 'GRAPH_EXTRA_DATA_UPDATED',
  GraphFactoryDeployment = 'GRAPH_FACTORY_DEPLOYMENT',
  GraphFollowed = 'GRAPH_FOLLOWED',
  GraphFollowRuleConfigured = 'GRAPH_FOLLOW_RULE_CONFIGURED',
  GraphFollowRuleReconfigured = 'GRAPH_FOLLOW_RULE_RECONFIGURED',
  GraphFollowRuleSelectorDisabled = 'GRAPH_FOLLOW_RULE_SELECTOR_DISABLED',
  GraphFollowRuleSelectorEnabled = 'GRAPH_FOLLOW_RULE_SELECTOR_ENABLED',
  GraphMetadataUriSet = 'GRAPH_METADATA_URI_SET',
  GraphRuleConfigured = 'GRAPH_RULE_CONFIGURED',
  GraphRuleReconfigured = 'GRAPH_RULE_RECONFIGURED',
  GraphRuleSelectorDisabled = 'GRAPH_RULE_SELECTOR_DISABLED',
  GraphRuleSelectorEnabled = 'GRAPH_RULE_SELECTOR_ENABLED',
  GraphUnfollowed = 'GRAPH_UNFOLLOWED',
  GroupAccessControlAdded = 'GROUP_ACCESS_CONTROL_ADDED',
  GroupAccessControlUpdated = 'GROUP_ACCESS_CONTROL_UPDATED',
  GroupAccountBanned = 'GROUP_ACCOUNT_BANNED',
  GroupAccountUnbanned = 'GROUP_ACCOUNT_UNBANNED',
  GroupExtraDataAdded = 'GROUP_EXTRA_DATA_ADDED',
  GroupExtraDataRemoved = 'GROUP_EXTRA_DATA_REMOVED',
  GroupExtraDataUpdated = 'GROUP_EXTRA_DATA_UPDATED',
  GroupFactoryDeployment = 'GROUP_FACTORY_DEPLOYMENT',
  GroupMembershipApprovalApproved = 'GROUP_MEMBERSHIP_APPROVAL_APPROVED',
  GroupMembershipApprovalRejected = 'GROUP_MEMBERSHIP_APPROVAL_REJECTED',
  GroupMembershipApprovalRequested = 'GROUP_MEMBERSHIP_APPROVAL_REQUESTED',
  GroupMembershipApprovalRequestCancelled = 'GROUP_MEMBERSHIP_APPROVAL_REQUEST_CANCELLED',
  GroupMemberAdded = 'GROUP_MEMBER_ADDED',
  GroupMemberJoined = 'GROUP_MEMBER_JOINED',
  GroupMemberLeft = 'GROUP_MEMBER_LEFT',
  GroupMemberRemoved = 'GROUP_MEMBER_REMOVED',
  GroupMetadataUriSet = 'GROUP_METADATA_URI_SET',
  GroupRuleConfigured = 'GROUP_RULE_CONFIGURED',
  GroupRuleReconfigured = 'GROUP_RULE_RECONFIGURED',
  GroupRuleSelectorDisabled = 'GROUP_RULE_SELECTOR_DISABLED',
  GroupRuleSelectorEnabled = 'GROUP_RULE_SELECTOR_ENABLED',
  NamespaceExtraDataAdded = 'NAMESPACE_EXTRA_DATA_ADDED',
  NamespaceExtraDataRemoved = 'NAMESPACE_EXTRA_DATA_REMOVED',
  NamespaceExtraDataUpdated = 'NAMESPACE_EXTRA_DATA_UPDATED',
  NamespaceFactoryDeployment = 'NAMESPACE_FACTORY_DEPLOYMENT',
  NamespaceMetadataUriSet = 'NAMESPACE_METADATA_URI_SET',
  PostActionConfigured = 'POST_ACTION_CONFIGURED',
  PostActionDisabled = 'POST_ACTION_DISABLED',
  PostActionEnabled = 'POST_ACTION_ENABLED',
  PostActionExecuted = 'POST_ACTION_EXECUTED',
  PostActionReconfigured = 'POST_ACTION_RECONFIGURED',
  SponsorshipAccessControlAdded = 'SPONSORSHIP_ACCESS_CONTROL_ADDED',
  SponsorshipAccessControlUpdated = 'SPONSORSHIP_ACCESS_CONTROL_UPDATED',
  SponsorshipAddedToExclusionList = 'SPONSORSHIP_ADDED_TO_EXCLUSION_LIST',
  SponsorshipFactoryDeployment = 'SPONSORSHIP_FACTORY_DEPLOYMENT',
  SponsorshipFundsSpent = 'SPONSORSHIP_FUNDS_SPENT',
  SponsorshipGrantedFunds = 'SPONSORSHIP_GRANTED_FUNDS',
  SponsorshipGrantRevoked = 'SPONSORSHIP_GRANT_REVOKED',
  SponsorshipMetadataUriSet = 'SPONSORSHIP_METADATA_URI_SET',
  SponsorshipPaused = 'SPONSORSHIP_PAUSED',
  SponsorshipRateLimitsChanged = 'SPONSORSHIP_RATE_LIMITS_CHANGED',
  SponsorshipRemovedFromExclusionList = 'SPONSORSHIP_REMOVED_FROM_EXCLUSION_LIST',
  SponsorshipSignerAdded = 'SPONSORSHIP_SIGNER_ADDED',
  SponsorshipSignerRemoved = 'SPONSORSHIP_SIGNER_REMOVED',
  SponsorshipUnpaused = 'SPONSORSHIP_UNPAUSED',
  UsernameAccessControlAdded = 'USERNAME_ACCESS_CONTROL_ADDED',
  UsernameAccessControlUpdated = 'USERNAME_ACCESS_CONTROL_UPDATED',
  UsernameAssigned = 'USERNAME_ASSIGNED',
  UsernameCreated = 'USERNAME_CREATED',
  UsernameExtraDataAdded = 'USERNAME_EXTRA_DATA_ADDED',
  UsernameExtraDataRemoved = 'USERNAME_EXTRA_DATA_REMOVED',
  UsernameExtraDataUpdated = 'USERNAME_EXTRA_DATA_UPDATED',
  UsernameReleased = 'USERNAME_RELEASED',
  UsernameRemoved = 'USERNAME_REMOVED',
  UsernameReserved = 'USERNAME_RESERVED',
  UsernameReservedCreated = 'USERNAME_RESERVED_CREATED',
  UsernameRuleConfigured = 'USERNAME_RULE_CONFIGURED',
  UsernameRuleReconfigured = 'USERNAME_RULE_RECONFIGURED',
  UsernameRuleSelectorDisabled = 'USERNAME_RULE_SELECTOR_DISABLED',
  UsernameRuleSelectorEnabled = 'USERNAME_RULE_SELECTOR_ENABLED',
  UsernameTransfer = 'USERNAME_TRANSFER',
  UsernameUnassigned = 'USERNAME_UNASSIGNED'
}

export type TransactionStatusRequest = {
  txHash: Scalars['TxHash']['input'];
};

export type TransactionStatusResult = FailedTransactionStatus | FinishedTransactionStatus | NotIndexedYetStatus | PendingTransactionStatus;

export enum TransactionType {
  Erc_20 = 'ERC_20',
  Erc_721 = 'ERC_721',
  Other = 'OTHER'
}

export type TransactionWillFail = {
  __typename?: 'TransactionWillFail';
  reason: Scalars['String']['output'];
};

export type TransferPrimitiveOwnershipRequest = {
  /** The graph/app/sponsor/feed/username/group address to change ownership for */
  address: Scalars['EvmAddress']['input'];
  /** The address of the new owner */
  newOwner: Scalars['EvmAddress']['input'];
};

export type TransferPrimitiveOwnershipResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UnassignUsernameFromAccountRequest = {
  namespace?: Scalars['EvmAddress']['input'];
  /** The processing params for the unassign rules. */
  rulesProcessingParams?: InputMaybe<Array<NamespaceRulesProcessingParams>>;
};

export type UnassignUsernameResponse = {
  __typename?: 'UnassignUsernameResponse';
  hash: Scalars['TxHash']['output'];
};

export type UnassignUsernameToAccountResult = NamespaceOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UnassignUsernameResponse;

export type UnbanGroupAccountsRequest = {
  /** The accounts you want to unban on the group. */
  accounts: Array<Scalars['EvmAddress']['input']>;
  /** The group you want to unban member on. */
  group: Scalars['EvmAddress']['input'];
};

export type UnbanGroupAccountsResponse = {
  __typename?: 'UnbanGroupAccountsResponse';
  hash: Scalars['TxHash']['output'];
};

export type UnbanGroupAccountsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UnbanGroupAccountsResponse;

export type UnblockRequest = {
  /** The account to unblock. */
  account: Scalars['EvmAddress']['input'];
};

export type UnblockResult = AccountUnblockedResponse | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UndoReactionFailure = {
  __typename?: 'UndoReactionFailure';
  reason: Scalars['String']['output'];
};

export type UndoReactionRequest = {
  /** The post to react to. */
  post: Scalars['PostId']['input'];
  /** The reaction to add. */
  reaction: PostReactionType;
};

export type UndoReactionResponse = {
  __typename?: 'UndoReactionResponse';
  success: Scalars['Boolean']['output'];
};

export type UndoReactionResult = UndoReactionFailure | UndoReactionResponse;

export type UndoRecommendedAccount = {
  /** The account to remove as a recommendation. */
  account: Scalars['EvmAddress']['input'];
};

export type UnfollowResponse = {
  __typename?: 'UnfollowResponse';
  hash: Scalars['TxHash']['output'];
};

export type UnfollowResult = AccountFollowOperationValidationFailed | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UnfollowResponse;

export type UnhideManagedAccountRequest = {
  /** The account to unhide. */
  account: Scalars['EvmAddress']['input'];
};

export type UnhideReplyRequest = {
  post: Scalars['PostId']['input'];
};

export type UnknownAccountAction = {
  __typename?: 'UnknownAccountAction';
  address: Scalars['EvmAddress']['output'];
  config: Array<RawKeyValue>;
  metadata?: Maybe<ActionMetadata>;
};

export type UnknownAccountActionExecuted = {
  __typename?: 'UnknownAccountActionExecuted';
  action: UnknownAccountAction;
  executedAt: Scalars['DateTime']['output'];
  executedBy: Account;
  params: Array<RawKeyValue>;
};

export type UnknownAccountRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownActionConfigInput = {
  /** The unknown action's contract address */
  address: Scalars['EvmAddress']['input'];
  /** Optional action configuration params */
  params?: Array<AnyKeyValueInput>;
};

export type UnknownActionExecuteInput = {
  /** The unknown action's contract address */
  address: Scalars['EvmAddress']['input'];
  /** Optional action execution params */
  params?: Array<RawKeyValueInput>;
};

export type UnknownFeedRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  executeOn: Array<FeedRuleExecuteOn>;
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownGraphRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  executeOn: Array<GraphRuleExecuteOn>;
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownGroupRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  executeOn: Array<GroupRuleExecuteOn>;
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownNamespaceRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  executeOn: Array<NamespaceRuleExecuteOn>;
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownPostAction = {
  __typename?: 'UnknownPostAction';
  address: Scalars['EvmAddress']['output'];
  config: Array<RawKeyValue>;
  metadata?: Maybe<ActionMetadata>;
};

export type UnknownPostActionContract = {
  __typename?: 'UnknownPostActionContract';
  address: Scalars['EvmAddress']['output'];
  metadata?: Maybe<ActionMetadata>;
};

export type UnknownPostActionExecuted = {
  __typename?: 'UnknownPostActionExecuted';
  action: UnknownPostAction;
  executedAt: Scalars['DateTime']['output'];
  executedBy: Account;
  params: Array<RawKeyValue>;
};

export type UnknownPostMetadata = {
  __typename?: 'UnknownPostMetadata';
  raw: Scalars['JsonString']['output'];
};

export type UnknownPostRuleConfig = {
  /** The rule contract address. */
  address: Scalars['EvmAddress']['input'];
  executeOn: Array<PostRuleExecuteOn>;
  /** Optional rule configuration parameters */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnknownRuleProcessingParams = {
  /** The rule id */
  id: Scalars['RuleId']['input'];
  /** The rule processing params */
  params?: InputMaybe<Array<AnyKeyValueInput>>;
};

export type UnwrapTokensRequest = {
  amount: Scalars['BigDecimal']['input'];
};

export type UnwrapTokensResult = InsufficientFunds | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateAccountFollowRulesRequest = {
  /** The graph to update account follow rules for. */
  graph?: Scalars['EvmAddress']['input'];
  /** The rules to add */
  toAdd?: AccountRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdateAccountFollowRulesResponse = {
  __typename?: 'UpdateAccountFollowRulesResponse';
  hash: Scalars['TxHash']['output'];
};

export type UpdateAccountFollowRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UpdateAccountFollowRulesResponse;

export type UpdateAccountManagerRequest = {
  /** The address to update as a manager. */
  manager: Scalars['EvmAddress']['input'];
  /** The permissions to update for the account manager. */
  permissions: AccountManagerPermissionsInput;
};

export type UpdateAccountManagerResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateFeedRulesRequest = {
  /** The feed to update rules for */
  feed: Scalars['EvmAddress']['input'];
  /** The rules to add */
  toAdd?: FeedRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdateFeedRulesResponse = {
  __typename?: 'UpdateFeedRulesResponse';
  hash: Scalars['TxHash']['output'];
};

export type UpdateFeedRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UpdateFeedRulesResponse;

export type UpdateGraphRulesRequest = {
  /** The graph to update rules for */
  graph: Scalars['EvmAddress']['input'];
  /** The rules to add */
  toAdd?: GraphRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdateGraphRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateGroupRulesRequest = {
  /** The group to update rules for */
  group: Scalars['EvmAddress']['input'];
  /** The rules to add */
  toAdd?: GroupRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdateGroupRulesResponse = {
  __typename?: 'UpdateGroupRulesResponse';
  hash: Scalars['TxHash']['output'];
};

export type UpdateGroupRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UpdateGroupRulesResponse;

export type UpdateNamespaceRulesRequest = {
  /** The namespace to update rules for */
  namespace: Scalars['EvmAddress']['input'];
  /** The rules to add */
  toAdd?: NamespaceRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdateNamespaceRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdatePostRulesRequest = {
  /** The processing params for the feed rules. */
  feedRulesProcessingParams?: Array<FeedRulesProcessingParams>;
  /** The post to update rules for. */
  post: Scalars['PostId']['input'];
  /** The rules to add */
  toAdd?: PostRulesConfigInput;
  /** The rules to remove */
  toRemove?: Array<Scalars['RuleId']['input']>;
};

export type UpdatePostRulesResponse = {
  __typename?: 'UpdatePostRulesResponse';
  hash: Scalars['TxHash']['output'];
};

export type UpdatePostRulesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail | UpdatePostRulesResponse;

export type UpdateReservedUsernamesRequest = {
  /** The namespace to update reserved usernames for */
  namespace: Scalars['EvmAddress']['input'];
  toRelease?: Array<Scalars['String']['input']>;
  /** Usernames to reserve */
  toReserve?: Array<Scalars['String']['input']>;
};

export type UpdateReservedUsernamesResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateSponsorshipExclusionListRequest = {
  /** The sponsorship to update */
  sponsorship: Scalars['EvmAddress']['input'];
  /** The new entries to add. */
  toAdd?: Array<SponsorshipRateLimitsExempt>;
  /** The entries to remove. */
  toRemove?: Array<Scalars['EvmAddress']['input']>;
};

export type UpdateSponsorshipExclusionListResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateSponsorshipLimitsRequest = {
  /** The new rate limits */
  rateLimits?: InputMaybe<SponsorshipRateLimitsInput>;
  /** The sponsorship to update */
  sponsorship: Scalars['EvmAddress']['input'];
};

export type UpdateSponsorshipLimitsResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type UpdateSponsorshipSignersRequest = {
  /**
   * Indicates whether the Lens API is authorized as the sponsorship signer
   * to sponsor end-user social operations (e.g., posts, comments, follows)
   * performed through the Lens API for apps associated with this sponsorship.
   *
   * If not provided, it won't affect the current configuration.
   */
  allowLensAccess?: InputMaybe<Scalars['Boolean']['input']>;
  /** The sponsorship to update */
  sponsorship: Scalars['EvmAddress']['input'];
  /** The new entries to add. */
  toAdd?: InputMaybe<Array<SponsorshipSignerInput>>;
  /** The entries to remove. */
  toRemove?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
};

export type UpdateSponsorshipSignersResult = SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type Username = {
  __typename?: 'Username';
  /** A unique identifier for the username entry. */
  id: Scalars['ID']['output'];
  /** The address that the username is linked to, if any. */
  linkedTo?: Maybe<Scalars['EvmAddress']['output']>;
  /** The local name of the username (e.g., bob). */
  localName: Scalars['String']['output'];
  /** The address of the namespace that the username is linked to. */
  namespace: Scalars['EvmAddress']['output'];
  operations?: Maybe<LoggedInUsernameOperations>;
  /** The address that owns the username entry. */
  ownedBy: Scalars['EvmAddress']['output'];
  /** The timestamp when the username was created. */
  timestamp: Scalars['DateTime']['output'];
  /** The username value (e.g., lens/bob). */
  value: Scalars['UsernameValue']['output'];
};

export type UsernameInput = {
  /** The local name, should not include the namespace */
  localName: Scalars['String']['input'];
  /** The namespace. Defaults to lens namespace */
  namespace?: Scalars['EvmAddress']['input'];
};

export type UsernameLengthNamespaceRuleConfig = {
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
};

export type UsernameNamespace = {
  __typename?: 'UsernameNamespace';
  /** The address of the namespace. */
  address: Scalars['EvmAddress']['output'];
  collectionMetadata?: Maybe<UsernameNamespaceMetadataStandard>;
  createdAt: Scalars['DateTime']['output'];
  metadata?: Maybe<UsernameNamespaceMetadata>;
  /** The namespace for example `lens` */
  namespace: Scalars['String']['output'];
  operations?: Maybe<LoggedInUsernameNamespaceOperations>;
  owner: Scalars['EvmAddress']['output'];
  rules: NamespaceRules;
  stats: UsernameNamespaceStats;
};

export type UsernameNamespaceChoiceOneOf = {
  custom?: InputMaybe<Scalars['EvmAddress']['input']>;
  globalNamespace?: InputMaybe<Scalars['AlwaysTrue']['input']>;
  none?: InputMaybe<Scalars['AlwaysTrue']['input']>;
};

export type UsernameNamespaceMetadata = {
  __typename?: 'UsernameNamespaceMetadata';
  /** An optional description of the Username collection. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * A unique identifier that in storages like IPFS ensures the uniqueness of the metadata URI.
   * Use a UUID if unsure.
   */
  id: Scalars['String']['output'];
};

export type UsernameNamespaceMetadataStandard = {
  __typename?: 'UsernameNamespaceMetadataStandard';
  /**
   * A URI pointing to a resource with mime type image/* that represents the contract, displayed
   * as a banner image for the contract.
   */
  bannerImage?: Maybe<Scalars['URI']['output']>;
  /**
   * An array of Ethereum addresses representing collaborators (authorized editors) of the
   * contract.
   */
  collaborators: Array<Scalars['EvmAddress']['output']>;
  /** The description of the contract. */
  description?: Maybe<Scalars['String']['output']>;
  /** The external link of the contract. */
  externalLink?: Maybe<Scalars['URI']['output']>;
  /**
   * A URI pointing to a resource with mime type image/* that represents the featured image for
   * the contract, typically used for a highlight section.
   */
  featuredImage?: Maybe<Scalars['URI']['output']>;
  /**
   * A URI pointing to a resource with mime type image/* that represents the contract, typically
   * displayed as a profile picture for the contract.
   */
  image?: Maybe<Scalars['URI']['output']>;
  /** The name of the contract. */
  name: Scalars['String']['output'];
  schema: Scalars['String']['output'];
  /** The symbol of the contract. */
  symbol?: Maybe<Scalars['String']['output']>;
};

export type UsernameNamespaceStats = {
  __typename?: 'UsernameNamespaceStats';
  totalUsernames: Scalars['Int']['output'];
};

export type UsernamePricePerLengthNamespaceRuleConfig = {
  cost: AmountInput;
  costOverrides?: InputMaybe<Array<LengthAmountPair>>;
  recipient: Scalars['EvmAddress']['input'];
};

/** You must provide either an id or a username, not both. */
export type UsernameRequest = {
  /** The username ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** The username namespace and local name. */
  username?: InputMaybe<UsernameInput>;
};

export type UsernameReserved = {
  __typename?: 'UsernameReserved';
  localName: Scalars['String']['output'];
  namespace: Scalars['EvmAddress']['output'];
  ruleId: Scalars['RuleId']['output'];
};

export type UsernameSearchInput = {
  /**
   * The local name to search for
   * Uses fuzzy search on username name
   */
  localNameQuery: Scalars['String']['input'];
  /** The namespaces to search for local name in. Defaults to global namespace */
  namespaces?: Array<Scalars['EvmAddress']['input']>;
};

export type UsernameTaken = {
  __typename?: 'UsernameTaken';
  ownedBy: Scalars['EvmAddress']['output'];
  reason: Scalars['String']['output'];
};

export type UsernamesFilter = {
  /** The optional filter to get usernames linked to an address */
  linkedTo?: InputMaybe<Scalars['EvmAddress']['input']>;
  /**
   * The optional filter to narrow usernames
   * Uses fuzzy search by local name
   */
  localNameQuery?: InputMaybe<Scalars['String']['input']>;
  /** The optional filter to get usernames for a namespace */
  namespace?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** The optional filter to get usernames owned by address */
  owner?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export enum UsernamesOrderBy {
  FirstMinted = 'FIRST_MINTED',
  LastMinted = 'LAST_MINTED'
}

export type UsernamesRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<UsernamesFilter>;
  /** The order by. */
  orderBy?: UsernamesOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type VideoMetadata = {
  __typename?: 'VideoMetadata';
  /** The other attachments you want to include with it. */
  attachments: Array<AnyMedia>;
  /**
   * A bag of attributes that can be used to store any kind of metadata that is not currently
   * supported by the standard. Over time, common attributes will be added to the standard and
   * their usage as arbitrary attributes will be discouraged.
   */
  attributes: Array<MetadataAttribute>;
  content: Scalars['String']['output'];
  /** Specify a content warning. */
  contentWarning?: Maybe<ContentWarning>;
  id: Scalars['MetadataId']['output'];
  locale: Scalars['Locale']['output'];
  /** The main focus of the post. */
  mainContentFocus: MainContentFocus;
  /** An arbitrary list of tags. */
  tags?: Maybe<Array<Scalars['Tag']['output']>>;
  /** The optional video title. */
  title?: Maybe<Scalars['String']['output']>;
  video: MediaVideo;
};

export type WhoExecutedActionOnAccountFilter = {
  anyOf: Array<AccountActionFilter>;
};

export enum WhoExecutedActionOnAccountOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  FirstActioned = 'FIRST_ACTIONED',
  LastActioned = 'LAST_ACTIONED'
}

export type WhoExecutedActionOnAccountRequest = {
  /** The account on which action were executed. */
  account: Scalars['EvmAddress']['input'];
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The optional actions filter */
  filter?: InputMaybe<WhoExecutedActionOnAccountFilter>;
  /** The order by. */
  orderBy?: WhoExecutedActionOnAccountOrderBy;
  /** The page size. */
  pageSize?: PageSize;
};

export type WhoExecutedActionOnPostFilter = {
  anyOf: Array<PostActionFilter>;
};

export enum WhoExecutedActionOnPostOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  FirstActioned = 'FIRST_ACTIONED',
  LastActioned = 'LAST_ACTIONED'
}

export type WhoExecutedActionOnPostRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The optional actions filter */
  filter?: InputMaybe<WhoExecutedActionOnPostFilter>;
  /** The order by. */
  orderBy?: WhoExecutedActionOnPostOrderBy;
  /** The page size. */
  pageSize?: PageSize;
  /** The post on which actions were executed. */
  post: Scalars['PostId']['input'];
};

export enum WhoReferencedPostOrderBy {
  AccountScore = 'ACCOUNT_SCORE',
  MostRecent = 'MOST_RECENT',
  Oldest = 'OLDEST'
}

export type WhoReferencedPostRequest = {
  /** The cursor. */
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: WhoReferencedPostOrderBy;
  /** The page size. */
  pageSize?: PageSize;
  /** The post id to get who referenced. */
  post: Scalars['PostId']['input'];
  /** The types of references to get. */
  referenceTypes: Array<PostReferenceType>;
};

export type WidthBasedTransform = {
  width: Scalars['Int']['input'];
};

export type WithdrawRequest = {
  erc20?: InputMaybe<AmountInput>;
  native?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type WithdrawResult = InsufficientFunds | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

export type WrapTokensRequest = {
  amount: Scalars['BigDecimal']['input'];
};

export type WrapTokensResult = InsufficientFunds | SelfFundedTransactionRequest | SponsoredTransactionRequest | TransactionWillFail;

/** The signature was not signed by the expected signer. */
export type WrongSignerError = {
  __typename?: 'WrongSignerError';
  reason: Scalars['String']['output'];
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export type AccountManagerPermissionsFragment = { __typename?: 'AccountManagerPermissions', canExecuteTransactions: boolean, canSetMetadataUri: boolean, canTransferNative: boolean, canTransferTokens: boolean } & { ' $fragmentName'?: 'AccountManagerPermissionsFragment' };

export type AccountFieldsFragment = { __typename?: 'Account', owner: any, address: any, createdAt: any, rules: { __typename?: 'AccountFollowRules', anyOf: Array<(
      { __typename?: 'AccountFollowRule' }
      & { ' $fragmentRefs'?: { 'AccountFollowRuleFieldsFragment': AccountFollowRuleFieldsFragment } }
    )>, required: Array<(
      { __typename?: 'AccountFollowRule' }
      & { ' $fragmentRefs'?: { 'AccountFollowRuleFieldsFragment': AccountFollowRuleFieldsFragment } }
    )> }, metadata?: (
    { __typename?: 'AccountMetadata' }
    & { ' $fragmentRefs'?: { 'AccountMetadataFieldsFragment': AccountMetadataFieldsFragment } }
  ) | null, username?: (
    { __typename?: 'Username' }
    & { ' $fragmentRefs'?: { 'UsernameFieldsFragment': UsernameFieldsFragment } }
  ) | null, operations?: (
    { __typename?: 'LoggedInAccountOperations' }
    & { ' $fragmentRefs'?: { 'LoggedInAccountOperationsFieldsFragment': LoggedInAccountOperationsFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'AccountFieldsFragment' };

export type AccountFollowRuleFieldsFragment = { __typename?: 'AccountFollowRule', id: any, type: AccountFollowRuleType, address: any, config: Array<(
    { __typename?: 'AddressKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_AddressKeyValue_Fragment': AnyKeyValueFields_AddressKeyValue_Fragment } }
  ) | (
    { __typename?: 'ArrayKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_ArrayKeyValue_Fragment': AnyKeyValueFields_ArrayKeyValue_Fragment } }
  ) | (
    { __typename?: 'BigDecimalKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_BigDecimalKeyValue_Fragment': AnyKeyValueFields_BigDecimalKeyValue_Fragment } }
  ) | (
    { __typename?: 'BooleanKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_BooleanKeyValue_Fragment': AnyKeyValueFields_BooleanKeyValue_Fragment } }
  ) | (
    { __typename?: 'DictionaryKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_DictionaryKeyValue_Fragment': AnyKeyValueFields_DictionaryKeyValue_Fragment } }
  ) | (
    { __typename?: 'IntKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_IntKeyValue_Fragment': AnyKeyValueFields_IntKeyValue_Fragment } }
  ) | (
    { __typename?: 'IntNullableKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_IntNullableKeyValue_Fragment': AnyKeyValueFields_IntNullableKeyValue_Fragment } }
  ) | (
    { __typename?: 'RawKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_RawKeyValue_Fragment': AnyKeyValueFields_RawKeyValue_Fragment } }
  ) | (
    { __typename?: 'StringKeyValue' }
    & { ' $fragmentRefs'?: { 'AnyKeyValueFields_StringKeyValue_Fragment': AnyKeyValueFields_StringKeyValue_Fragment } }
  )> } & { ' $fragmentName'?: 'AccountFollowRuleFieldsFragment' };

export type AccountMetadataFieldsFragment = { __typename?: 'AccountMetadata', id: string, name?: string | null, bio?: string | null, picture?: any | null, coverPicture?: any | null, attributes: Array<(
    { __typename?: 'MetadataAttribute' }
    & { ' $fragmentRefs'?: { 'MetadataAttributeFieldsFragment': MetadataAttributeFieldsFragment } }
  )> } & { ' $fragmentName'?: 'AccountMetadataFieldsFragment' };

export type LoggedInAccountOperationsFieldsFragment = { __typename?: 'LoggedInAccountOperations', id: string, isFollowedByMe: boolean, isFollowingMe: boolean, isMutedByMe: boolean, isBlockedByMe: boolean } & { ' $fragmentName'?: 'LoggedInAccountOperationsFieldsFragment' };

export type UsernameFieldsFragment = { __typename?: 'Username', namespace: any, localName: string, linkedTo?: any | null, value: any } & { ' $fragmentName'?: 'UsernameFieldsFragment' };

type AnyKeyValueFields_AddressKeyValue_Fragment = { __typename?: 'AddressKeyValue', key: string, address: any } & { ' $fragmentName'?: 'AnyKeyValueFields_AddressKeyValue_Fragment' };

type AnyKeyValueFields_ArrayKeyValue_Fragment = { __typename?: 'ArrayKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_ArrayKeyValue_Fragment' };

type AnyKeyValueFields_BigDecimalKeyValue_Fragment = { __typename?: 'BigDecimalKeyValue', key: string, bigDecimal: any } & { ' $fragmentName'?: 'AnyKeyValueFields_BigDecimalKeyValue_Fragment' };

type AnyKeyValueFields_BooleanKeyValue_Fragment = { __typename?: 'BooleanKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_BooleanKeyValue_Fragment' };

type AnyKeyValueFields_DictionaryKeyValue_Fragment = { __typename?: 'DictionaryKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_DictionaryKeyValue_Fragment' };

type AnyKeyValueFields_IntKeyValue_Fragment = { __typename?: 'IntKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_IntKeyValue_Fragment' };

type AnyKeyValueFields_IntNullableKeyValue_Fragment = { __typename?: 'IntNullableKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_IntNullableKeyValue_Fragment' };

type AnyKeyValueFields_RawKeyValue_Fragment = { __typename?: 'RawKeyValue' } & { ' $fragmentName'?: 'AnyKeyValueFields_RawKeyValue_Fragment' };

type AnyKeyValueFields_StringKeyValue_Fragment = { __typename?: 'StringKeyValue', key: string, string: string } & { ' $fragmentName'?: 'AnyKeyValueFields_StringKeyValue_Fragment' };

export type AnyKeyValueFieldsFragment = AnyKeyValueFields_AddressKeyValue_Fragment | AnyKeyValueFields_ArrayKeyValue_Fragment | AnyKeyValueFields_BigDecimalKeyValue_Fragment | AnyKeyValueFields_BooleanKeyValue_Fragment | AnyKeyValueFields_DictionaryKeyValue_Fragment | AnyKeyValueFields_IntKeyValue_Fragment | AnyKeyValueFields_IntNullableKeyValue_Fragment | AnyKeyValueFields_RawKeyValue_Fragment | AnyKeyValueFields_StringKeyValue_Fragment;

export type AppFieldsFragment = { __typename?: 'App', address: any, defaultFeedAddress?: any | null, graphAddress?: any | null, namespaceAddress?: any | null, sponsorshipAddress?: any | null, treasuryAddress?: any | null, createdAt: any, metadata?: { __typename?: 'AppMetadata', description?: string | null, developer: string, logo?: any | null, name: string, platforms: Array<AppPlatform>, privacyPolicy?: any | null, termsOfService?: any | null, url: any } | null } & { ' $fragmentName'?: 'AppFieldsFragment' };

export type BooleanValueFieldsFragment = { __typename?: 'BooleanValue', onChain: boolean, optimistic: boolean } & { ' $fragmentName'?: 'BooleanValueFieldsFragment' };

export type Erc20AmountFieldsFragment = { __typename?: 'Erc20Amount', value: any, asset: (
    { __typename?: 'Erc20' }
    & { ' $fragmentRefs'?: { 'Erc20FieldsFragment': Erc20FieldsFragment } }
  ) } & { ' $fragmentName'?: 'Erc20AmountFieldsFragment' };

export type Erc20FieldsFragment = { __typename?: 'Erc20', decimals: number, name: string, symbol: string, contract: { __typename?: 'NetworkAddress', address: any, chainId: number } } & { ' $fragmentName'?: 'Erc20FieldsFragment' };

export type MetadataAttributeFieldsFragment = { __typename?: 'MetadataAttribute', type: MetadataAttributeType, key: string, value: string } & { ' $fragmentName'?: 'MetadataAttributeFieldsFragment' };

export type NetworkAddressFieldsFragment = { __typename?: 'NetworkAddress', address: any, chainId: number } & { ' $fragmentName'?: 'NetworkAddressFieldsFragment' };

export type CommentNotificationFieldsFragment = { __typename: 'CommentNotification', id: any, comment: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ) } & { ' $fragmentName'?: 'CommentNotificationFieldsFragment' };

export type FollowNotificationFieldsFragment = { __typename: 'FollowNotification', id: any, followers: Array<{ __typename?: 'NotificationAccountFollow', account: (
      { __typename?: 'Account' }
      & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
    ) }> } & { ' $fragmentName'?: 'FollowNotificationFieldsFragment' };

export type MentionNotificationFieldsFragment = { __typename: 'MentionNotification', id: any, post: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ) } & { ' $fragmentName'?: 'MentionNotificationFieldsFragment' };

export type QuoteNotificationFieldsFragment = { __typename: 'QuoteNotification', id: any, quote: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ) } & { ' $fragmentName'?: 'QuoteNotificationFieldsFragment' };

export type ReactionNotificationFieldsFragment = { __typename: 'ReactionNotification', id: any, post: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ), reactions: Array<{ __typename?: 'NotificationAccountPostReaction', account: (
      { __typename?: 'Account' }
      & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
    ) }> } & { ' $fragmentName'?: 'ReactionNotificationFieldsFragment' };

export type RepostNotificationFieldsFragment = { __typename: 'RepostNotification', id: any, post: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ), reposts: Array<{ __typename?: 'NotificationAccountRepost', repostedAt: any, account: (
      { __typename?: 'Account' }
      & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
    ) }> } & { ' $fragmentName'?: 'RepostNotificationFieldsFragment' };

export type PayToCollectConfigFieldsFragment = { __typename?: 'PayToCollectConfig', referralShare?: number | null, recipients: Array<{ __typename?: 'RecipientPercent', address: any, percent: number }>, amount: (
    { __typename?: 'Erc20Amount' }
    & { ' $fragmentRefs'?: { 'Erc20AmountFieldsFragment': Erc20AmountFieldsFragment } }
  ) } & { ' $fragmentName'?: 'PayToCollectConfigFieldsFragment' };

export type SimpleCollectActionFieldsFragment = { __typename?: 'SimpleCollectAction', address: any, collectLimit?: number | null, isImmutable: boolean, endsAt?: any | null, payToCollect?: (
    { __typename?: 'PayToCollectConfig' }
    & { ' $fragmentRefs'?: { 'PayToCollectConfigFieldsFragment': PayToCollectConfigFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'SimpleCollectActionFieldsFragment' };

export type UnknownPostActionFieldsFragment = { __typename: 'UnknownPostAction' } & { ' $fragmentName'?: 'UnknownPostActionFieldsFragment' };

export type LoggedInPostOperationsFieldsFragment = { __typename?: 'LoggedInPostOperations', id: string, hasBookmarked: boolean, hasReacted: boolean, hasSimpleCollected: boolean, hasTipped: boolean, isNotInterested: boolean, simpleCollectCount: number, postTipCount: number, hasCommented: (
    { __typename?: 'BooleanValue' }
    & { ' $fragmentRefs'?: { 'BooleanValueFieldsFragment': BooleanValueFieldsFragment } }
  ), hasQuoted: (
    { __typename?: 'BooleanValue' }
    & { ' $fragmentRefs'?: { 'BooleanValueFieldsFragment': BooleanValueFieldsFragment } }
  ), hasReposted: (
    { __typename?: 'BooleanValue' }
    & { ' $fragmentRefs'?: { 'BooleanValueFieldsFragment': BooleanValueFieldsFragment } }
  ), canRepost: { __typename: 'PostOperationValidationFailed' } | { __typename: 'PostOperationValidationPassed' } | { __typename: 'PostOperationValidationUnknown' }, canQuote: { __typename: 'PostOperationValidationFailed' } | { __typename: 'PostOperationValidationPassed' } | { __typename: 'PostOperationValidationUnknown' }, canComment: { __typename: 'PostOperationValidationFailed' } | { __typename: 'PostOperationValidationPassed' } | { __typename: 'PostOperationValidationUnknown' } } & { ' $fragmentName'?: 'LoggedInPostOperationsFieldsFragment' };

export type MediaAudioFieldsFragment = { __typename?: 'MediaAudio', artist?: string | null, item: any, cover?: any | null, license?: MetadataLicenseType | null } & { ' $fragmentName'?: 'MediaAudioFieldsFragment' };

type MediaFields_MediaAudio_Fragment = (
  { __typename?: 'MediaAudio' }
  & { ' $fragmentRefs'?: { 'MediaAudioFieldsFragment': MediaAudioFieldsFragment } }
) & { ' $fragmentName'?: 'MediaFields_MediaAudio_Fragment' };

type MediaFields_MediaImage_Fragment = (
  { __typename?: 'MediaImage' }
  & { ' $fragmentRefs'?: { 'MediaImageFieldsFragment': MediaImageFieldsFragment } }
) & { ' $fragmentName'?: 'MediaFields_MediaImage_Fragment' };

type MediaFields_MediaVideo_Fragment = (
  { __typename?: 'MediaVideo' }
  & { ' $fragmentRefs'?: { 'MediaVideoFieldsFragment': MediaVideoFieldsFragment } }
) & { ' $fragmentName'?: 'MediaFields_MediaVideo_Fragment' };

export type MediaFieldsFragment = MediaFields_MediaAudio_Fragment | MediaFields_MediaImage_Fragment | MediaFields_MediaVideo_Fragment;

export type MediaImageFieldsFragment = { __typename?: 'MediaImage', altTag?: string | null, item: any, license?: MetadataLicenseType | null, attributes: Array<(
    { __typename?: 'MetadataAttribute' }
    & { ' $fragmentRefs'?: { 'MetadataAttributeFieldsFragment': MetadataAttributeFieldsFragment } }
  )> } & { ' $fragmentName'?: 'MediaImageFieldsFragment' };

export type MediaVideoFieldsFragment = { __typename?: 'MediaVideo', altTag?: string | null, cover?: any | null, duration?: number | null, item: any, license?: MetadataLicenseType | null, attributes: Array<(
    { __typename?: 'MetadataAttribute' }
    & { ' $fragmentRefs'?: { 'MetadataAttributeFieldsFragment': MetadataAttributeFieldsFragment } }
  )> } & { ' $fragmentName'?: 'MediaVideoFieldsFragment' };

export type VideoMetadataFieldsFragment = { __typename: 'VideoMetadata', id: any, title?: string | null, content: string, tags?: Array<any> | null, attributes: Array<(
    { __typename?: 'MetadataAttribute' }
    & { ' $fragmentRefs'?: { 'MetadataAttributeFieldsFragment': MetadataAttributeFieldsFragment } }
  )>, attachments: Array<(
    { __typename?: 'MediaAudio' }
    & { ' $fragmentRefs'?: { 'MediaFields_MediaAudio_Fragment': MediaFields_MediaAudio_Fragment } }
  ) | (
    { __typename?: 'MediaImage' }
    & { ' $fragmentRefs'?: { 'MediaFields_MediaImage_Fragment': MediaFields_MediaImage_Fragment } }
  ) | (
    { __typename?: 'MediaVideo' }
    & { ' $fragmentRefs'?: { 'MediaFields_MediaVideo_Fragment': MediaFields_MediaVideo_Fragment } }
  )>, video: (
    { __typename?: 'MediaVideo' }
    & { ' $fragmentRefs'?: { 'MediaVideoFieldsFragment': MediaVideoFieldsFragment } }
  ) } & { ' $fragmentName'?: 'VideoMetadataFieldsFragment' };

type PostActionFields_SimpleCollectAction_Fragment = (
  { __typename?: 'SimpleCollectAction' }
  & { ' $fragmentRefs'?: { 'SimpleCollectActionFieldsFragment': SimpleCollectActionFieldsFragment } }
) & { ' $fragmentName'?: 'PostActionFields_SimpleCollectAction_Fragment' };

type PostActionFields_UnknownPostAction_Fragment = (
  { __typename?: 'UnknownPostAction' }
  & { ' $fragmentRefs'?: { 'UnknownPostActionFieldsFragment': UnknownPostActionFieldsFragment } }
) & { ' $fragmentName'?: 'PostActionFields_UnknownPostAction_Fragment' };

export type PostActionFieldsFragment = PostActionFields_SimpleCollectAction_Fragment | PostActionFields_UnknownPostAction_Fragment;

export type PostBaseFieldsFragment = { __typename: 'Post', id: any, slug: any, isEdited: boolean, isDeleted: boolean, timestamp: any, author: (
    { __typename?: 'Account' }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ), feed: { __typename?: 'PostFeedInfo', group?: { __typename?: 'PostGroupInfo', address: any, metadata?: { __typename?: 'GroupMetadata', name: string, description?: string | null, icon?: any | null, coverPicture?: any | null } | null } | null }, app?: (
    { __typename?: 'App' }
    & { ' $fragmentRefs'?: { 'AppFieldsFragment': AppFieldsFragment } }
  ) | null, metadata: (
    { __typename?: 'ArticleMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_ArticleMetadata_Fragment': PostMetadataFields_ArticleMetadata_Fragment } }
  ) | (
    { __typename?: 'AudioMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_AudioMetadata_Fragment': PostMetadataFields_AudioMetadata_Fragment } }
  ) | (
    { __typename?: 'CheckingInMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_CheckingInMetadata_Fragment': PostMetadataFields_CheckingInMetadata_Fragment } }
  ) | (
    { __typename?: 'EmbedMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_EmbedMetadata_Fragment': PostMetadataFields_EmbedMetadata_Fragment } }
  ) | (
    { __typename?: 'EventMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_EventMetadata_Fragment': PostMetadataFields_EventMetadata_Fragment } }
  ) | (
    { __typename?: 'ImageMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_ImageMetadata_Fragment': PostMetadataFields_ImageMetadata_Fragment } }
  ) | (
    { __typename?: 'LinkMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_LinkMetadata_Fragment': PostMetadataFields_LinkMetadata_Fragment } }
  ) | (
    { __typename?: 'LivestreamMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_LivestreamMetadata_Fragment': PostMetadataFields_LivestreamMetadata_Fragment } }
  ) | (
    { __typename?: 'MintMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_MintMetadata_Fragment': PostMetadataFields_MintMetadata_Fragment } }
  ) | (
    { __typename?: 'SpaceMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_SpaceMetadata_Fragment': PostMetadataFields_SpaceMetadata_Fragment } }
  ) | (
    { __typename?: 'StoryMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_StoryMetadata_Fragment': PostMetadataFields_StoryMetadata_Fragment } }
  ) | (
    { __typename?: 'TextOnlyMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_TextOnlyMetadata_Fragment': PostMetadataFields_TextOnlyMetadata_Fragment } }
  ) | (
    { __typename?: 'ThreeDMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_ThreeDMetadata_Fragment': PostMetadataFields_ThreeDMetadata_Fragment } }
  ) | (
    { __typename?: 'TransactionMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_TransactionMetadata_Fragment': PostMetadataFields_TransactionMetadata_Fragment } }
  ) | (
    { __typename?: 'UnknownPostMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_UnknownPostMetadata_Fragment': PostMetadataFields_UnknownPostMetadata_Fragment } }
  ) | (
    { __typename?: 'VideoMetadata' }
    & { ' $fragmentRefs'?: { 'PostMetadataFields_VideoMetadata_Fragment': PostMetadataFields_VideoMetadata_Fragment } }
  ), actions: Array<(
    { __typename?: 'SimpleCollectAction' }
    & { ' $fragmentRefs'?: { 'PostActionFields_SimpleCollectAction_Fragment': PostActionFields_SimpleCollectAction_Fragment } }
  ) | (
    { __typename?: 'UnknownPostAction' }
    & { ' $fragmentRefs'?: { 'PostActionFields_UnknownPostAction_Fragment': PostActionFields_UnknownPostAction_Fragment } }
  )>, stats: (
    { __typename?: 'PostStats' }
    & { ' $fragmentRefs'?: { 'PostStatsFieldsFragment': PostStatsFieldsFragment } }
  ), operations?: (
    { __typename?: 'LoggedInPostOperations' }
    & { ' $fragmentRefs'?: { 'LoggedInPostOperationsFieldsFragment': LoggedInPostOperationsFieldsFragment } }
  ) | null } & { ' $fragmentName'?: 'PostBaseFieldsFragment' };

export type PostFieldsFragment = (
  { __typename?: 'Post', root?: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostBaseFieldsFragment': PostBaseFieldsFragment } }
  ) | null, commentOn?: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostBaseFieldsFragment': PostBaseFieldsFragment } }
  ) | null, quoteOf?: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostBaseFieldsFragment': PostBaseFieldsFragment } }
  ) | null }
  & { ' $fragmentRefs'?: { 'PostBaseFieldsFragment': PostBaseFieldsFragment } }
) & { ' $fragmentName'?: 'PostFieldsFragment' };

type PostMetadataFields_ArticleMetadata_Fragment = { __typename: 'ArticleMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_ArticleMetadata_Fragment' };

type PostMetadataFields_AudioMetadata_Fragment = { __typename: 'AudioMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_AudioMetadata_Fragment' };

type PostMetadataFields_CheckingInMetadata_Fragment = { __typename: 'CheckingInMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_CheckingInMetadata_Fragment' };

type PostMetadataFields_EmbedMetadata_Fragment = { __typename: 'EmbedMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_EmbedMetadata_Fragment' };

type PostMetadataFields_EventMetadata_Fragment = { __typename: 'EventMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_EventMetadata_Fragment' };

type PostMetadataFields_ImageMetadata_Fragment = { __typename: 'ImageMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_ImageMetadata_Fragment' };

type PostMetadataFields_LinkMetadata_Fragment = { __typename: 'LinkMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_LinkMetadata_Fragment' };

type PostMetadataFields_LivestreamMetadata_Fragment = { __typename: 'LivestreamMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_LivestreamMetadata_Fragment' };

type PostMetadataFields_MintMetadata_Fragment = { __typename: 'MintMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_MintMetadata_Fragment' };

type PostMetadataFields_SpaceMetadata_Fragment = { __typename: 'SpaceMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_SpaceMetadata_Fragment' };

type PostMetadataFields_StoryMetadata_Fragment = { __typename: 'StoryMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_StoryMetadata_Fragment' };

type PostMetadataFields_TextOnlyMetadata_Fragment = { __typename: 'TextOnlyMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_TextOnlyMetadata_Fragment' };

type PostMetadataFields_ThreeDMetadata_Fragment = { __typename: 'ThreeDMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_ThreeDMetadata_Fragment' };

type PostMetadataFields_TransactionMetadata_Fragment = { __typename: 'TransactionMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_TransactionMetadata_Fragment' };

type PostMetadataFields_UnknownPostMetadata_Fragment = { __typename: 'UnknownPostMetadata' } & { ' $fragmentName'?: 'PostMetadataFields_UnknownPostMetadata_Fragment' };

type PostMetadataFields_VideoMetadata_Fragment = (
  { __typename: 'VideoMetadata' }
  & { ' $fragmentRefs'?: { 'VideoMetadataFieldsFragment': VideoMetadataFieldsFragment } }
) & { ' $fragmentName'?: 'PostMetadataFields_VideoMetadata_Fragment' };

export type PostMetadataFieldsFragment = PostMetadataFields_ArticleMetadata_Fragment | PostMetadataFields_AudioMetadata_Fragment | PostMetadataFields_CheckingInMetadata_Fragment | PostMetadataFields_EmbedMetadata_Fragment | PostMetadataFields_EventMetadata_Fragment | PostMetadataFields_ImageMetadata_Fragment | PostMetadataFields_LinkMetadata_Fragment | PostMetadataFields_LivestreamMetadata_Fragment | PostMetadataFields_MintMetadata_Fragment | PostMetadataFields_SpaceMetadata_Fragment | PostMetadataFields_StoryMetadata_Fragment | PostMetadataFields_TextOnlyMetadata_Fragment | PostMetadataFields_ThreeDMetadata_Fragment | PostMetadataFields_TransactionMetadata_Fragment | PostMetadataFields_UnknownPostMetadata_Fragment | PostMetadataFields_VideoMetadata_Fragment;

export type PostStatsFieldsFragment = { __typename?: 'PostStats', bookmarks: number, collects: number, comments: number, quotes: number, reactions: number, reposts: number } & { ' $fragmentName'?: 'PostStatsFieldsFragment' };

export type RepostFieldsFragment = { __typename: 'Repost', id: any, isDeleted: boolean, timestamp: any, author: (
    { __typename?: 'Account' }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ), repostOf: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ) } & { ' $fragmentName'?: 'RepostFieldsFragment' };

export type SelfFundedTransactionRequestFieldsFragment = { __typename?: 'SelfFundedTransactionRequest', reason: string, raw: { __typename?: 'Eip1559TransactionRequest', chainId: number, data: any, from: any, gasLimit: number, maxFeePerGas: any, maxPriorityFeePerGas: any, nonce: number, to: any, type: number, value: any } } & { ' $fragmentName'?: 'SelfFundedTransactionRequestFieldsFragment' };

export type SponsoredTransactionRequestFieldsFragment = { __typename?: 'SponsoredTransactionRequest', reason: string, raw: { __typename?: 'Eip712TransactionRequest', chainId: number, data: any, from: any, gasLimit: number, maxFeePerGas: any, maxPriorityFeePerGas: any, nonce: number, to: any, type: number, value: any, customData: { __typename?: 'Eip712Meta', customSignature?: any | null, factoryDeps: Array<any>, gasPerPubdata: any, paymasterParams?: { __typename?: 'PaymasterParams', paymaster: any, paymasterInput: any } | null } } } & { ' $fragmentName'?: 'SponsoredTransactionRequestFieldsFragment' };

export type CreateAccountWithUsernameMutationVariables = Exact<{
  request: CreateAccountWithUsernameRequest;
}>;


export type CreateAccountWithUsernameMutation = { __typename?: 'Mutation', createAccountWithUsername: { __typename?: 'CreateAccountResponse', hash: any } | { __typename?: 'NamespaceOperationValidationFailed', reason: string } | { __typename?: 'SelfFundedTransactionRequest', reason: string } | { __typename?: 'SponsoredTransactionRequest', reason: string } | { __typename?: 'TransactionWillFail', reason: string } | { __typename?: 'UsernameTaken', reason: string } };

export type AuthenticateMutationVariables = Exact<{
  request: SignedAuthChallenge;
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticate: { __typename: 'AuthenticationTokens', accessToken: any, refreshToken: any, idToken: any } | { __typename: 'ExpiredChallengeError', reason: string } | { __typename: 'ForbiddenError', reason: string } | { __typename: 'WrongSignerError', reason: string } };

export type ChallengeMutationVariables = Exact<{
  request: ChallengeRequest;
}>;


export type ChallengeMutation = { __typename?: 'Mutation', challenge: { __typename?: 'AuthenticationChallenge', id: any, text: string } };

export type RefreshMutationVariables = Exact<{
  request: RefreshRequest;
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename: 'AuthenticationTokens', accessToken: any, refreshToken: any, idToken: any } | { __typename: 'ForbiddenError', reason: string } };

export type AddReactionMutationVariables = Exact<{
  request: AddReactionRequest;
}>;


export type AddReactionMutation = { __typename?: 'Mutation', addReaction: { __typename?: 'AddReactionFailure', reason: string } | { __typename?: 'AddReactionResponse', success: boolean } };

export type BookmarkPostMutationVariables = Exact<{
  request: BookmarkPostRequest;
}>;


export type BookmarkPostMutation = { __typename?: 'Mutation', bookmarkPost: any };

export type CreatePostMutationVariables = Exact<{
  request: CreatePostRequest;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', post: { __typename?: 'PostOperationValidationFailed' } | { __typename?: 'PostResponse', hash: any } | (
    { __typename?: 'SelfFundedTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SelfFundedTransactionRequestFieldsFragment': SelfFundedTransactionRequestFieldsFragment } }
  ) | (
    { __typename?: 'SponsoredTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SponsoredTransactionRequestFieldsFragment': SponsoredTransactionRequestFieldsFragment } }
  ) | { __typename?: 'TransactionWillFail', reason: string } };

export type DeletePostMutationVariables = Exact<{
  request: DeletePostRequest;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'DeletePostResponse', hash: any } | (
    { __typename?: 'SelfFundedTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SelfFundedTransactionRequestFieldsFragment': SelfFundedTransactionRequestFieldsFragment } }
  ) | (
    { __typename?: 'SponsoredTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SponsoredTransactionRequestFieldsFragment': SponsoredTransactionRequestFieldsFragment } }
  ) | { __typename?: 'TransactionWillFail', reason: string } };

export type EditPostMutationVariables = Exact<{
  request: EditPostRequest;
}>;


export type EditPostMutation = { __typename?: 'Mutation', editPost: { __typename?: 'PostOperationValidationFailed' } | { __typename?: 'PostResponse', hash: any } | (
    { __typename?: 'SelfFundedTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SelfFundedTransactionRequestFieldsFragment': SelfFundedTransactionRequestFieldsFragment } }
  ) | (
    { __typename?: 'SponsoredTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SponsoredTransactionRequestFieldsFragment': SponsoredTransactionRequestFieldsFragment } }
  ) | { __typename?: 'TransactionWillFail', reason: string } };

export type ReportPostMutationVariables = Exact<{
  request: ReportPostRequest;
}>;


export type ReportPostMutation = { __typename?: 'Mutation', reportPost: any };

export type RepostMutationVariables = Exact<{
  request: CreateRepostRequest;
}>;


export type RepostMutation = { __typename?: 'Mutation', repost: { __typename?: 'PostOperationValidationFailed' } | { __typename?: 'PostResponse', hash: any } | (
    { __typename?: 'SelfFundedTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SelfFundedTransactionRequestFieldsFragment': SelfFundedTransactionRequestFieldsFragment } }
  ) | (
    { __typename?: 'SponsoredTransactionRequest' }
    & { ' $fragmentRefs'?: { 'SponsoredTransactionRequestFieldsFragment': SponsoredTransactionRequestFieldsFragment } }
  ) | { __typename?: 'TransactionWillFail', reason: string } };

export type UndoBookmarkPostMutationVariables = Exact<{
  request: BookmarkPostRequest;
}>;


export type UndoBookmarkPostMutation = { __typename?: 'Mutation', undoBookmarkPost: any };

export type UndoReactionMutationVariables = Exact<{
  request: UndoReactionRequest;
}>;


export type UndoReactionMutation = { __typename?: 'Mutation', undoReaction: { __typename?: 'UndoReactionFailure', reason: string } | { __typename?: 'UndoReactionResponse', success: boolean } };

export type AccountManagersQueryVariables = Exact<{
  request: AccountManagersRequest;
}>;


export type AccountManagersQuery = { __typename?: 'Query', accountManagers: { __typename?: 'PaginatedAccountManagersResult', items: Array<{ __typename?: 'AccountManager', manager: any, isLensManager: boolean, addedAt: any, permissions: (
        { __typename?: 'AccountManagerPermissions' }
        & { ' $fragmentRefs'?: { 'AccountManagerPermissionsFragment': AccountManagerPermissionsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type AccountStatsQueryVariables = Exact<{
  request: AccountStatsRequest;
}>;


export type AccountStatsQuery = { __typename?: 'Query', accountStats: { __typename?: 'AccountStats', feedStats: { __typename?: 'AccountFeedsStats', posts: number, comments: number, reposts: number, quotes: number, reacted: number, reactions: number, collects: number }, graphFollowStats: { __typename?: 'AccountGraphsFollowStats', followers: number, following: number } } };

export type AccountQueryVariables = Exact<{
  request: AccountRequest;
}>;


export type AccountQuery = { __typename?: 'Query', account?: (
    { __typename?: 'Account' }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ) | null };

export type AccountsAvailableQueryVariables = Exact<{
  accountsAvailableRequest: AccountsAvailableRequest;
  lastLoggedInAccountRequest: LastLoggedInAccountRequest;
}>;


export type AccountsAvailableQuery = { __typename?: 'Query', lastLoggedInAccount?: (
    { __typename?: 'Account' }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ) | null, accountsAvailable: { __typename?: 'PaginatedAccountsAvailableResult', items: Array<{ __typename: 'AccountManaged', account: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) } | { __typename: 'AccountOwned', account: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type AccountsBlockedQueryVariables = Exact<{
  request: AccountsBlockedRequest;
}>;


export type AccountsBlockedQuery = { __typename?: 'Query', accountsBlocked: { __typename?: 'PaginatedAccountsBlockedResult', items: Array<{ __typename?: 'AccountBlocked', blockedAt: any, account: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type AccountsQueryVariables = Exact<{
  request: AccountsRequest;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: { __typename?: 'PaginatedAccountsResult', items: Array<(
      { __typename?: 'Account' }
      & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
    )>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type AuthenticatedSessionsQueryVariables = Exact<{
  request: AuthenticatedSessionsRequest;
}>;


export type AuthenticatedSessionsQuery = { __typename?: 'Query', authenticatedSessions: { __typename?: 'PaginatedActiveAuthenticationsResult', items: Array<{ __typename?: 'AuthenticatedSession', authenticationId: any, app: any, browser?: string | null, device?: string | null, os?: string | null, origin?: any | null, signer: any, createdAt: any, updatedAt: any }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type FollowersYouKnowQueryVariables = Exact<{
  request: FollowersYouKnowRequest;
}>;


export type FollowersYouKnowQuery = { __typename?: 'Query', followersYouKnow: { __typename?: 'PaginatedFollowersResult', items: Array<{ __typename?: 'Follower', followedOn: any, follower: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type FollowersQueryVariables = Exact<{
  request: FollowersRequest;
}>;


export type FollowersQuery = { __typename?: 'Query', followers: { __typename?: 'PaginatedFollowersResult', items: Array<{ __typename?: 'Follower', followedOn: any, follower: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type FollowingQueryVariables = Exact<{
  request: FollowingRequest;
}>;


export type FollowingQuery = { __typename?: 'Query', following: { __typename?: 'PaginatedFollowingResult', items: Array<{ __typename?: 'Following', followedOn: any, following: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type LastLoggedInAccountQueryVariables = Exact<{
  request: LastLoggedInAccountRequest;
}>;


export type LastLoggedInAccountQuery = { __typename?: 'Query', lastLoggedInAccount?: { __typename?: 'Account', address: any, owner: any, score: number, metadata?: (
      { __typename?: 'AccountMetadata' }
      & { ' $fragmentRefs'?: { 'AccountMetadataFieldsFragment': AccountMetadataFieldsFragment } }
    ) | null, username?: (
      { __typename?: 'Username' }
      & { ' $fragmentRefs'?: { 'UsernameFieldsFragment': UsernameFieldsFragment } }
    ) | null, operations?: (
      { __typename?: 'LoggedInAccountOperations' }
      & { ' $fragmentRefs'?: { 'LoggedInAccountOperationsFieldsFragment': LoggedInAccountOperationsFieldsFragment } }
    ) | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResult', isSignless: boolean, isSponsored: boolean, appLoggedIn: any, loggedInAs: { __typename?: 'AccountManaged', addedAt: any, account: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) } | { __typename?: 'AccountOwned', addedAt: any, account: (
        { __typename?: 'Account' }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }, limit: { __typename?: 'SponsorshipAllowance', window: SponsorshipRateLimitWindow, allowanceLeft: number, allowanceUsed: number, allowance: number } } };

export type NotificationsQueryVariables = Exact<{
  request: NotificationRequest;
}>;


export type NotificationsQuery = { __typename?: 'Query', notifications: { __typename?: 'PaginatedNotificationResult', items: Array<{ __typename?: 'AccountActionExecutedNotification' } | (
      { __typename?: 'CommentNotification' }
      & { ' $fragmentRefs'?: { 'CommentNotificationFieldsFragment': CommentNotificationFieldsFragment } }
    ) | (
      { __typename?: 'FollowNotification' }
      & { ' $fragmentRefs'?: { 'FollowNotificationFieldsFragment': FollowNotificationFieldsFragment } }
    ) | { __typename?: 'GroupMembershipRequestApprovedNotification' } | { __typename?: 'GroupMembershipRequestRejectedNotification' } | (
      { __typename?: 'MentionNotification' }
      & { ' $fragmentRefs'?: { 'MentionNotificationFieldsFragment': MentionNotificationFieldsFragment } }
    ) | { __typename?: 'PostActionExecutedNotification' } | (
      { __typename?: 'QuoteNotification' }
      & { ' $fragmentRefs'?: { 'QuoteNotificationFieldsFragment': QuoteNotificationFieldsFragment } }
    ) | (
      { __typename?: 'ReactionNotification' }
      & { ' $fragmentRefs'?: { 'ReactionNotificationFieldsFragment': ReactionNotificationFieldsFragment } }
    ) | (
      { __typename?: 'RepostNotification' }
      & { ' $fragmentRefs'?: { 'RepostNotificationFieldsFragment': RepostNotificationFieldsFragment } }
    )>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type UsernamesQueryVariables = Exact<{
  request: UsernamesRequest;
}>;


export type UsernamesQuery = { __typename?: 'Query', usernames: { __typename?: 'PaginatedUsernamesResult', items: Array<(
      { __typename?: 'Username' }
      & { ' $fragmentRefs'?: { 'UsernameFieldsFragment': UsernameFieldsFragment } }
    )>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type MlPostsExploreQueryVariables = Exact<{
  request: PostsExploreRequest;
}>;


export type MlPostsExploreQuery = { __typename?: 'Query', mlPostsExplore: { __typename?: 'PaginatedPostsResult', items: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
    )>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type PostReferencesQueryVariables = Exact<{
  request: PostReferencesRequest;
}>;


export type PostReferencesQuery = { __typename?: 'Query', postReferences: { __typename?: 'PaginatedAnyPostsResult', items: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
    ) | { __typename?: 'Repost' }>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type PostQueryVariables = Exact<{
  request: PostRequest;
}>;


export type PostQuery = { __typename?: 'Query', post?: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
  ) | { __typename?: 'Repost' } | null };

export type PostsQueryVariables = Exact<{
  request: PostsRequest;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedAnyPostsResult', items: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
    ) | (
      { __typename?: 'Repost' }
      & { ' $fragmentRefs'?: { 'RepostFieldsFragment': RepostFieldsFragment } }
    )>, pageInfo: { __typename?: 'PaginatedResultInfo', next?: any | null } } };

export type SearchQueryVariables = Exact<{
  postsRequest: PostsRequest;
  accountsRequest: AccountsRequest;
}>;


export type SearchQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedAnyPostsResult', items: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFieldsFragment': PostFieldsFragment } }
    ) | (
      { __typename?: 'Repost' }
      & { ' $fragmentRefs'?: { 'RepostFieldsFragment': RepostFieldsFragment } }
    )> }, accounts: { __typename?: 'PaginatedAccountsResult', items: Array<(
      { __typename?: 'Account' }
      & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
    )> } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const AccountManagerPermissionsFragmentDoc = new TypedDocumentString(`
    fragment AccountManagerPermissions on AccountManagerPermissions {
  canExecuteTransactions
  canSetMetadataUri
  canTransferNative
  canTransferTokens
}
    `, {"fragmentName":"AccountManagerPermissions"}) as unknown as TypedDocumentString<AccountManagerPermissionsFragment, unknown>;
export const NetworkAddressFieldsFragmentDoc = new TypedDocumentString(`
    fragment NetworkAddressFields on NetworkAddress {
  address
  chainId
}
    `, {"fragmentName":"NetworkAddressFields"}) as unknown as TypedDocumentString<NetworkAddressFieldsFragment, unknown>;
export const AnyKeyValueFieldsFragmentDoc = new TypedDocumentString(`
    fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
    `, {"fragmentName":"AnyKeyValueFields"}) as unknown as TypedDocumentString<AnyKeyValueFieldsFragment, unknown>;
export const AccountFollowRuleFieldsFragmentDoc = new TypedDocumentString(`
    fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
    fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}`, {"fragmentName":"AccountFollowRuleFields"}) as unknown as TypedDocumentString<AccountFollowRuleFieldsFragment, unknown>;
export const MetadataAttributeFieldsFragmentDoc = new TypedDocumentString(`
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
    `, {"fragmentName":"MetadataAttributeFields"}) as unknown as TypedDocumentString<MetadataAttributeFieldsFragment, unknown>;
export const AccountMetadataFieldsFragmentDoc = new TypedDocumentString(`
    fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`, {"fragmentName":"AccountMetadataFields"}) as unknown as TypedDocumentString<AccountMetadataFieldsFragment, unknown>;
export const UsernameFieldsFragmentDoc = new TypedDocumentString(`
    fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
    `, {"fragmentName":"UsernameFields"}) as unknown as TypedDocumentString<UsernameFieldsFragment, unknown>;
export const LoggedInAccountOperationsFieldsFragmentDoc = new TypedDocumentString(`
    fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
    `, {"fragmentName":"LoggedInAccountOperationsFields"}) as unknown as TypedDocumentString<LoggedInAccountOperationsFieldsFragment, unknown>;
export const AccountFieldsFragmentDoc = new TypedDocumentString(`
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
    fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`, {"fragmentName":"AccountFields"}) as unknown as TypedDocumentString<AccountFieldsFragment, unknown>;
export const AppFieldsFragmentDoc = new TypedDocumentString(`
    fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
    `, {"fragmentName":"AppFields"}) as unknown as TypedDocumentString<AppFieldsFragment, unknown>;
export const MediaVideoFieldsFragmentDoc = new TypedDocumentString(`
    fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`, {"fragmentName":"MediaVideoFields"}) as unknown as TypedDocumentString<MediaVideoFieldsFragment, unknown>;
export const MediaImageFieldsFragmentDoc = new TypedDocumentString(`
    fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`, {"fragmentName":"MediaImageFields"}) as unknown as TypedDocumentString<MediaImageFieldsFragment, unknown>;
export const MediaAudioFieldsFragmentDoc = new TypedDocumentString(`
    fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
    `, {"fragmentName":"MediaAudioFields"}) as unknown as TypedDocumentString<MediaAudioFieldsFragment, unknown>;
export const MediaFieldsFragmentDoc = new TypedDocumentString(`
    fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}`, {"fragmentName":"MediaFields"}) as unknown as TypedDocumentString<MediaFieldsFragment, unknown>;
export const VideoMetadataFieldsFragmentDoc = new TypedDocumentString(`
    fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}`, {"fragmentName":"VideoMetadataFields"}) as unknown as TypedDocumentString<VideoMetadataFieldsFragment, unknown>;
export const PostMetadataFieldsFragmentDoc = new TypedDocumentString(`
    fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
    fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}`, {"fragmentName":"PostMetadataFields"}) as unknown as TypedDocumentString<PostMetadataFieldsFragment, unknown>;
export const Erc20FieldsFragmentDoc = new TypedDocumentString(`
    fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
    `, {"fragmentName":"Erc20Fields"}) as unknown as TypedDocumentString<Erc20FieldsFragment, unknown>;
export const Erc20AmountFieldsFragmentDoc = new TypedDocumentString(`
    fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
    fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}`, {"fragmentName":"Erc20AmountFields"}) as unknown as TypedDocumentString<Erc20AmountFieldsFragment, unknown>;
export const PayToCollectConfigFieldsFragmentDoc = new TypedDocumentString(`
    fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
    fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}`, {"fragmentName":"PayToCollectConfigFields"}) as unknown as TypedDocumentString<PayToCollectConfigFieldsFragment, unknown>;
export const SimpleCollectActionFieldsFragmentDoc = new TypedDocumentString(`
    fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
    fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}`, {"fragmentName":"SimpleCollectActionFields"}) as unknown as TypedDocumentString<SimpleCollectActionFieldsFragment, unknown>;
export const UnknownPostActionFieldsFragmentDoc = new TypedDocumentString(`
    fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
    `, {"fragmentName":"UnknownPostActionFields"}) as unknown as TypedDocumentString<UnknownPostActionFieldsFragment, unknown>;
export const PostActionFieldsFragmentDoc = new TypedDocumentString(`
    fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
    fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}`, {"fragmentName":"PostActionFields"}) as unknown as TypedDocumentString<PostActionFieldsFragment, unknown>;
export const PostStatsFieldsFragmentDoc = new TypedDocumentString(`
    fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}
    `, {"fragmentName":"PostStatsFields"}) as unknown as TypedDocumentString<PostStatsFieldsFragment, unknown>;
export const BooleanValueFieldsFragmentDoc = new TypedDocumentString(`
    fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
    `, {"fragmentName":"BooleanValueFields"}) as unknown as TypedDocumentString<BooleanValueFieldsFragment, unknown>;
export const LoggedInPostOperationsFieldsFragmentDoc = new TypedDocumentString(`
    fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
    fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}`, {"fragmentName":"LoggedInPostOperationsFields"}) as unknown as TypedDocumentString<LoggedInPostOperationsFieldsFragment, unknown>;
export const PostBaseFieldsFragmentDoc = new TypedDocumentString(`
    fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"PostBaseFields"}) as unknown as TypedDocumentString<PostBaseFieldsFragment, unknown>;
export const PostFieldsFragmentDoc = new TypedDocumentString(`
    fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"PostFields"}) as unknown as TypedDocumentString<PostFieldsFragment, unknown>;
export const CommentNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment CommentNotificationFields on CommentNotification {
  __typename
  id
  comment {
    ...PostFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"CommentNotificationFields"}) as unknown as TypedDocumentString<CommentNotificationFieldsFragment, unknown>;
export const FollowNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment FollowNotificationFields on FollowNotification {
  __typename
  id
  followers {
    account {
      ...AccountFields
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`, {"fragmentName":"FollowNotificationFields"}) as unknown as TypedDocumentString<FollowNotificationFieldsFragment, unknown>;
export const MentionNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment MentionNotificationFields on MentionNotification {
  __typename
  id
  post {
    ...PostFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"MentionNotificationFields"}) as unknown as TypedDocumentString<MentionNotificationFieldsFragment, unknown>;
export const QuoteNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment QuoteNotificationFields on QuoteNotification {
  __typename
  id
  quote {
    ...PostFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"QuoteNotificationFields"}) as unknown as TypedDocumentString<QuoteNotificationFieldsFragment, unknown>;
export const ReactionNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment ReactionNotificationFields on ReactionNotification {
  __typename
  id
  post {
    ...PostFields
  }
  reactions {
    account {
      ...AccountFields
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"ReactionNotificationFields"}) as unknown as TypedDocumentString<ReactionNotificationFieldsFragment, unknown>;
export const RepostNotificationFieldsFragmentDoc = new TypedDocumentString(`
    fragment RepostNotificationFields on RepostNotification {
  __typename
  id
  post {
    ...PostFields
  }
  reposts {
    account {
      ...AccountFields
    }
    repostedAt
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"RepostNotificationFields"}) as unknown as TypedDocumentString<RepostNotificationFieldsFragment, unknown>;
export const RepostFieldsFragmentDoc = new TypedDocumentString(`
    fragment RepostFields on Repost {
  __typename
  id
  author {
    ...AccountFields
  }
  isDeleted
  timestamp
  repostOf {
    ...PostFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`, {"fragmentName":"RepostFields"}) as unknown as TypedDocumentString<RepostFieldsFragment, unknown>;
export const SelfFundedTransactionRequestFieldsFragmentDoc = new TypedDocumentString(`
    fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
  }
}
    `, {"fragmentName":"SelfFundedTransactionRequestFields"}) as unknown as TypedDocumentString<SelfFundedTransactionRequestFieldsFragment, unknown>;
export const SponsoredTransactionRequestFieldsFragmentDoc = new TypedDocumentString(`
    fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
    customData {
      customSignature
      factoryDeps
      gasPerPubdata
      paymasterParams {
        paymaster
        paymasterInput
      }
    }
  }
}
    `, {"fragmentName":"SponsoredTransactionRequestFields"}) as unknown as TypedDocumentString<SponsoredTransactionRequestFieldsFragment, unknown>;
export const CreateAccountWithUsernameDocument = new TypedDocumentString(`
    mutation CreateAccountWithUsername($request: CreateAccountWithUsernameRequest!) {
  createAccountWithUsername(request: $request) {
    ... on UsernameTaken {
      reason
    }
    ... on CreateAccountResponse {
      hash
    }
    ... on NamespaceOperationValidationFailed {
      reason
    }
    ... on SelfFundedTransactionRequest {
      reason
    }
    ... on SponsoredTransactionRequest {
      reason
    }
    ... on TransactionWillFail {
      reason
    }
  }
}
    `) as unknown as TypedDocumentString<CreateAccountWithUsernameMutation, CreateAccountWithUsernameMutationVariables>;
export const AuthenticateDocument = new TypedDocumentString(`
    mutation Authenticate($request: SignedAuthChallenge!) {
  authenticate(request: $request) {
    ... on AuthenticationTokens {
      __typename
      accessToken
      refreshToken
      idToken
    }
    ... on ExpiredChallengeError {
      __typename
      reason
    }
    ... on ForbiddenError {
      __typename
      reason
    }
    ... on WrongSignerError {
      __typename
      reason
    }
  }
}
    `) as unknown as TypedDocumentString<AuthenticateMutation, AuthenticateMutationVariables>;
export const ChallengeDocument = new TypedDocumentString(`
    mutation Challenge($request: ChallengeRequest!) {
  challenge(request: $request) {
    id
    text
  }
}
    `) as unknown as TypedDocumentString<ChallengeMutation, ChallengeMutationVariables>;
export const RefreshDocument = new TypedDocumentString(`
    mutation Refresh($request: RefreshRequest!) {
  refresh(request: $request) {
    ... on AuthenticationTokens {
      __typename
      accessToken
      refreshToken
      idToken
    }
    ... on ForbiddenError {
      __typename
      reason
    }
  }
}
    `) as unknown as TypedDocumentString<RefreshMutation, RefreshMutationVariables>;
export const AddReactionDocument = new TypedDocumentString(`
    mutation AddReaction($request: AddReactionRequest!) {
  addReaction(request: $request) {
    ... on AddReactionResponse {
      success
    }
    ... on AddReactionFailure {
      reason
    }
  }
}
    `) as unknown as TypedDocumentString<AddReactionMutation, AddReactionMutationVariables>;
export const BookmarkPostDocument = new TypedDocumentString(`
    mutation BookmarkPost($request: BookmarkPostRequest!) {
  bookmarkPost(request: $request)
}
    `) as unknown as TypedDocumentString<BookmarkPostMutation, BookmarkPostMutationVariables>;
export const CreatePostDocument = new TypedDocumentString(`
    mutation CreatePost($request: CreatePostRequest!) {
  post(request: $request) {
    ... on PostResponse {
      hash
    }
    ... on SelfFundedTransactionRequest {
      ...SelfFundedTransactionRequestFields
    }
    ... on SponsoredTransactionRequest {
      ...SponsoredTransactionRequestFields
    }
    ... on TransactionWillFail {
      reason
    }
  }
}
    fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
  }
}
fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
    customData {
      customSignature
      factoryDeps
      gasPerPubdata
      paymasterParams {
        paymaster
        paymasterInput
      }
    }
  }
}`) as unknown as TypedDocumentString<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = new TypedDocumentString(`
    mutation DeletePost($request: DeletePostRequest!) {
  deletePost(request: $request) {
    ... on DeletePostResponse {
      hash
    }
    ... on SelfFundedTransactionRequest {
      ...SelfFundedTransactionRequestFields
    }
    ... on SponsoredTransactionRequest {
      ...SponsoredTransactionRequestFields
    }
    ... on TransactionWillFail {
      reason
    }
  }
}
    fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
  }
}
fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
    customData {
      customSignature
      factoryDeps
      gasPerPubdata
      paymasterParams {
        paymaster
        paymasterInput
      }
    }
  }
}`) as unknown as TypedDocumentString<DeletePostMutation, DeletePostMutationVariables>;
export const EditPostDocument = new TypedDocumentString(`
    mutation EditPost($request: EditPostRequest!) {
  editPost(request: $request) {
    ... on PostResponse {
      hash
    }
    ... on SelfFundedTransactionRequest {
      ...SelfFundedTransactionRequestFields
    }
    ... on SponsoredTransactionRequest {
      ...SponsoredTransactionRequestFields
    }
    ... on TransactionWillFail {
      reason
    }
  }
}
    fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
  }
}
fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
    customData {
      customSignature
      factoryDeps
      gasPerPubdata
      paymasterParams {
        paymaster
        paymasterInput
      }
    }
  }
}`) as unknown as TypedDocumentString<EditPostMutation, EditPostMutationVariables>;
export const ReportPostDocument = new TypedDocumentString(`
    mutation ReportPost($request: ReportPostRequest!) {
  reportPost(request: $request)
}
    `) as unknown as TypedDocumentString<ReportPostMutation, ReportPostMutationVariables>;
export const RepostDocument = new TypedDocumentString(`
    mutation Repost($request: CreateRepostRequest!) {
  repost(request: $request) {
    ... on PostResponse {
      hash
    }
    ... on SelfFundedTransactionRequest {
      ...SelfFundedTransactionRequestFields
    }
    ... on SponsoredTransactionRequest {
      ...SponsoredTransactionRequestFields
    }
    ... on TransactionWillFail {
      reason
    }
  }
}
    fragment SelfFundedTransactionRequestFields on SelfFundedTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
  }
}
fragment SponsoredTransactionRequestFields on SponsoredTransactionRequest {
  reason
  raw {
    chainId
    data
    from
    gasLimit
    maxFeePerGas
    maxPriorityFeePerGas
    nonce
    to
    type
    value
    customData {
      customSignature
      factoryDeps
      gasPerPubdata
      paymasterParams {
        paymaster
        paymasterInput
      }
    }
  }
}`) as unknown as TypedDocumentString<RepostMutation, RepostMutationVariables>;
export const UndoBookmarkPostDocument = new TypedDocumentString(`
    mutation UndoBookmarkPost($request: BookmarkPostRequest!) {
  undoBookmarkPost(request: $request)
}
    `) as unknown as TypedDocumentString<UndoBookmarkPostMutation, UndoBookmarkPostMutationVariables>;
export const UndoReactionDocument = new TypedDocumentString(`
    mutation UndoReaction($request: UndoReactionRequest!) {
  undoReaction(request: $request) {
    ... on UndoReactionResponse {
      success
    }
    ... on UndoReactionFailure {
      reason
    }
  }
}
    `) as unknown as TypedDocumentString<UndoReactionMutation, UndoReactionMutationVariables>;
export const AccountManagersDocument = new TypedDocumentString(`
    query AccountManagers($request: AccountManagersRequest!) {
  accountManagers(request: $request) {
    items {
      manager
      isLensManager
      permissions {
        ...AccountManagerPermissions
      }
      addedAt
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountManagerPermissions on AccountManagerPermissions {
  canExecuteTransactions
  canSetMetadataUri
  canTransferNative
  canTransferTokens
}`) as unknown as TypedDocumentString<AccountManagersQuery, AccountManagersQueryVariables>;
export const AccountStatsDocument = new TypedDocumentString(`
    query AccountStats($request: AccountStatsRequest!) {
  accountStats(request: $request) {
    feedStats {
      posts
      comments
      reposts
      quotes
      reacted
      reactions
      collects
    }
    graphFollowStats {
      followers
      following
    }
  }
}
    `) as unknown as TypedDocumentString<AccountStatsQuery, AccountStatsQueryVariables>;
export const AccountDocument = new TypedDocumentString(`
    query Account($request: AccountRequest!) {
  account(request: $request) {
    ...AccountFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<AccountQuery, AccountQueryVariables>;
export const AccountsAvailableDocument = new TypedDocumentString(`
    query AccountsAvailable($accountsAvailableRequest: AccountsAvailableRequest!, $lastLoggedInAccountRequest: LastLoggedInAccountRequest!) {
  lastLoggedInAccount(request: $lastLoggedInAccountRequest) {
    ...AccountFields
  }
  accountsAvailable(request: $accountsAvailableRequest) {
    items {
      ... on AccountManaged {
        __typename
        account {
          ...AccountFields
        }
      }
      ... on AccountOwned {
        __typename
        account {
          ...AccountFields
        }
      }
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<AccountsAvailableQuery, AccountsAvailableQueryVariables>;
export const AccountsBlockedDocument = new TypedDocumentString(`
    query AccountsBlocked($request: AccountsBlockedRequest!) {
  accountsBlocked(request: $request) {
    items {
      account {
        ...AccountFields
      }
      blockedAt
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<AccountsBlockedQuery, AccountsBlockedQueryVariables>;
export const AccountsDocument = new TypedDocumentString(`
    query Accounts($request: AccountsRequest!) {
  accounts(request: $request) {
    items {
      ...AccountFields
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<AccountsQuery, AccountsQueryVariables>;
export const AuthenticatedSessionsDocument = new TypedDocumentString(`
    query AuthenticatedSessions($request: AuthenticatedSessionsRequest!) {
  authenticatedSessions(request: $request) {
    items {
      authenticationId
      app
      browser
      device
      os
      origin
      signer
      createdAt
      updatedAt
    }
    pageInfo {
      next
    }
  }
}
    `) as unknown as TypedDocumentString<AuthenticatedSessionsQuery, AuthenticatedSessionsQueryVariables>;
export const FollowersYouKnowDocument = new TypedDocumentString(`
    query FollowersYouKnow($request: FollowersYouKnowRequest!) {
  followersYouKnow(request: $request) {
    items {
      follower {
        ...AccountFields
      }
      followedOn
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<FollowersYouKnowQuery, FollowersYouKnowQueryVariables>;
export const FollowersDocument = new TypedDocumentString(`
    query Followers($request: FollowersRequest!) {
  followers(request: $request) {
    items {
      follower {
        ...AccountFields
      }
      followedOn
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<FollowersQuery, FollowersQueryVariables>;
export const FollowingDocument = new TypedDocumentString(`
    query Following($request: FollowingRequest!) {
  following(request: $request) {
    items {
      following {
        ...AccountFields
      }
      followedOn
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<FollowingQuery, FollowingQueryVariables>;
export const LastLoggedInAccountDocument = new TypedDocumentString(`
    query LastLoggedInAccount($request: LastLoggedInAccountRequest!) {
  lastLoggedInAccount(request: $request) {
    address
    owner
    score
    metadata {
      ...AccountMetadataFields
    }
    username {
      ...UsernameFields
    }
    operations {
      ...LoggedInAccountOperationsFields
    }
  }
}
    fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<LastLoggedInAccountQuery, LastLoggedInAccountQueryVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    loggedInAs {
      ... on AccountManaged {
        account {
          ...AccountFields
        }
        addedAt
      }
      ... on AccountOwned {
        account {
          ...AccountFields
        }
        addedAt
      }
    }
    isSignless
    isSponsored
    appLoggedIn
    limit {
      window
      allowanceLeft
      allowanceUsed
      allowance
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}`) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const NotificationsDocument = new TypedDocumentString(`
    query Notifications($request: NotificationRequest!) {
  notifications(request: $request) {
    items {
      ... on CommentNotification {
        ...CommentNotificationFields
      }
      ... on FollowNotification {
        ...FollowNotificationFields
      }
      ... on MentionNotification {
        ...MentionNotificationFields
      }
      ... on QuoteNotification {
        ...QuoteNotificationFields
      }
      ... on ReactionNotification {
        ...ReactionNotificationFields
      }
      ... on RepostNotification {
        ...RepostNotificationFields
      }
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment CommentNotificationFields on CommentNotification {
  __typename
  id
  comment {
    ...PostFields
  }
}
fragment FollowNotificationFields on FollowNotification {
  __typename
  id
  followers {
    account {
      ...AccountFields
    }
  }
}
fragment MentionNotificationFields on MentionNotification {
  __typename
  id
  post {
    ...PostFields
  }
}
fragment QuoteNotificationFields on QuoteNotification {
  __typename
  id
  quote {
    ...PostFields
  }
}
fragment ReactionNotificationFields on ReactionNotification {
  __typename
  id
  post {
    ...PostFields
  }
  reactions {
    account {
      ...AccountFields
    }
  }
}
fragment RepostNotificationFields on RepostNotification {
  __typename
  id
  post {
    ...PostFields
  }
  reposts {
    account {
      ...AccountFields
    }
    repostedAt
  }
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`) as unknown as TypedDocumentString<NotificationsQuery, NotificationsQueryVariables>;
export const UsernamesDocument = new TypedDocumentString(`
    query Usernames($request: UsernamesRequest!) {
  usernames(request: $request) {
    items {
      ...UsernameFields
    }
    pageInfo {
      next
    }
  }
}
    fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}`) as unknown as TypedDocumentString<UsernamesQuery, UsernamesQueryVariables>;
export const MlPostsExploreDocument = new TypedDocumentString(`
    query MLPostsExplore($request: PostsExploreRequest!) {
  mlPostsExplore(request: $request) {
    items {
      ... on Post {
        ...PostFields
      }
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`) as unknown as TypedDocumentString<MlPostsExploreQuery, MlPostsExploreQueryVariables>;
export const PostReferencesDocument = new TypedDocumentString(`
    query PostReferences($request: PostReferencesRequest!) {
  postReferences(request: $request) {
    items {
      ...PostFields
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`) as unknown as TypedDocumentString<PostReferencesQuery, PostReferencesQueryVariables>;
export const PostDocument = new TypedDocumentString(`
    query Post($request: PostRequest!) {
  post(request: $request) {
    ...PostFields
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}`) as unknown as TypedDocumentString<PostQuery, PostQueryVariables>;
export const PostsDocument = new TypedDocumentString(`
    query Posts($request: PostsRequest!) {
  posts(request: $request) {
    items {
      ... on Post {
        ...PostFields
      }
      ... on Repost {
        ...RepostFields
      }
    }
    pageInfo {
      next
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}
fragment RepostFields on Repost {
  __typename
  id
  author {
    ...AccountFields
  }
  isDeleted
  timestamp
  repostOf {
    ...PostFields
  }
}`) as unknown as TypedDocumentString<PostsQuery, PostsQueryVariables>;
export const SearchDocument = new TypedDocumentString(`
    query Search($postsRequest: PostsRequest!, $accountsRequest: AccountsRequest!) {
  posts(request: $postsRequest) {
    items {
      ... on Post {
        ...PostFields
      }
      ... on Repost {
        ...RepostFields
      }
    }
  }
  accounts(request: $accountsRequest) {
    items {
      ...AccountFields
    }
  }
}
    fragment AccountFields on Account {
  owner
  address
  createdAt
  rules {
    anyOf {
      ...AccountFollowRuleFields
    }
    required {
      ...AccountFollowRuleFields
    }
  }
  metadata {
    ...AccountMetadataFields
  }
  username(request: {autoResolve: true}) {
    ...UsernameFields
  }
  operations {
    ...LoggedInAccountOperationsFields
  }
}
fragment AccountFollowRuleFields on AccountFollowRule {
  id
  type
  address
  config {
    ...AnyKeyValueFields
  }
}
fragment AccountMetadataFields on AccountMetadata {
  id
  name
  bio
  picture
  coverPicture
  attributes {
    ...MetadataAttributeFields
  }
}
fragment LoggedInAccountOperationsFields on LoggedInAccountOperations {
  id
  isFollowedByMe
  isFollowingMe
  isMutedByMe
  isBlockedByMe
}
fragment UsernameFields on Username {
  namespace
  localName
  linkedTo
  value
}
fragment AnyKeyValueFields on AnyKeyValue {
  ... on AddressKeyValue {
    key
    address
  }
  ... on BigDecimalKeyValue {
    key
    bigDecimal
  }
  ... on StringKeyValue {
    key
    string
  }
}
fragment AppFields on App {
  address
  defaultFeedAddress
  graphAddress
  namespaceAddress
  sponsorshipAddress
  treasuryAddress
  createdAt
  metadata {
    description
    developer
    logo
    name
    platforms
    privacyPolicy
    termsOfService
    url
  }
}
fragment BooleanValueFields on BooleanValue {
  onChain
  optimistic
}
fragment Erc20AmountFields on Erc20Amount {
  asset {
    ...Erc20Fields
  }
  value
}
fragment Erc20Fields on Erc20 {
  contract {
    address
    chainId
  }
  decimals
  name
  symbol
}
fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
}
fragment PayToCollectConfigFields on PayToCollectConfig {
  referralShare
  recipients {
    address
    percent
  }
  amount {
    ...Erc20AmountFields
  }
}
fragment SimpleCollectActionFields on SimpleCollectAction {
  address
  collectLimit
  isImmutable
  endsAt
  payToCollect {
    ...PayToCollectConfigFields
  }
}
fragment UnknownPostActionFields on UnknownPostAction {
  __typename
}
fragment LoggedInPostOperationsFields on LoggedInPostOperations {
  id
  hasBookmarked
  hasReacted
  hasSimpleCollected
  hasTipped
  isNotInterested
  hasCommented {
    ...BooleanValueFields
  }
  hasQuoted {
    ...BooleanValueFields
  }
  hasReposted {
    ...BooleanValueFields
  }
  canRepost {
    __typename
  }
  canQuote {
    __typename
  }
  canComment {
    __typename
  }
  simpleCollectCount
  postTipCount
}
fragment MediaAudioFields on MediaAudio {
  artist
  item
  cover
  license
}
fragment MediaFields on AnyMedia {
  ... on MediaVideo {
    ...MediaVideoFields
  }
  ... on MediaImage {
    ...MediaImageFields
  }
  ... on MediaAudio {
    ...MediaAudioFields
  }
}
fragment MediaImageFields on MediaImage {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  item
  license
}
fragment MediaVideoFields on MediaVideo {
  altTag
  attributes {
    ...MetadataAttributeFields
  }
  cover
  duration
  item
  license
}
fragment VideoMetadataFields on VideoMetadata {
  __typename
  id
  title
  content
  tags
  attributes {
    ...MetadataAttributeFields
  }
  attachments {
    ...MediaFields
  }
  video {
    ...MediaVideoFields
  }
}
fragment PostActionFields on PostAction {
  ... on SimpleCollectAction {
    ...SimpleCollectActionFields
  }
  ... on UnknownPostAction {
    ...UnknownPostActionFields
  }
}
fragment PostBaseFields on Post {
  __typename
  id
  slug
  isEdited
  isDeleted
  timestamp
  author {
    ...AccountFields
  }
  feed {
    group {
      address
      metadata {
        name
        description
        icon
        coverPicture
      }
    }
  }
  app {
    ...AppFields
  }
  metadata {
    ...PostMetadataFields
  }
  actions {
    ...PostActionFields
  }
  stats {
    ...PostStatsFields
  }
  operations {
    ...LoggedInPostOperationsFields
  }
}
fragment PostFields on Post {
  ...PostBaseFields
  root {
    ...PostBaseFields
  }
  commentOn {
    ...PostBaseFields
  }
  quoteOf {
    ...PostBaseFields
  }
}
fragment PostMetadataFields on PostMetadata {
  __typename
  ... on VideoMetadata {
    ...VideoMetadataFields
  }
}
fragment PostStatsFields on PostStats {
  bookmarks
  collects
  comments
  quotes
  reactions
  reposts
}
fragment RepostFields on Repost {
  __typename
  id
  author {
    ...AccountFields
  }
  isDeleted
  timestamp
  repostOf {
    ...PostFields
  }
}`) as unknown as TypedDocumentString<SearchQuery, SearchQueryVariables>;