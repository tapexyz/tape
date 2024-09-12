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
 */
const documents = {
    "fragment AmountFields on Amount {\n  asset {\n    ...Erc20Fields\n  }\n  value\n}": types.AmountFieldsFragmentDoc,
    "fragment AnyPublicationMetadataFields on PublicationMetadata {\n  ... on VideoMetadataV3 {\n    ...VideoMetadataV3Fields\n  }\n  ... on AudioMetadataV3 {\n    ...AudioMetadataV3Fields\n  }\n  ... on ImageMetadataV3 {\n    ...ImageMetadataV3Fields\n  }\n  ... on LinkMetadataV3 {\n    ...LinkMetadataV3Fields\n  }\n  ... on LiveStreamMetadataV3 {\n    ...LiveStreamMetadataV3Fields\n  }\n  ... on MintMetadataV3 {\n    ...MintMetadataV3Fields\n  }\n  ... on TextOnlyMetadataV3 {\n    ...TextOnlyMetadataV3Fields\n  }\n}": types.AnyPublicationMetadataFieldsFragmentDoc,
    "fragment CommentBaseFields on Comment {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n  root {\n    ...PostFields\n  }\n}": types.CommentBaseFieldsFragmentDoc,
    "fragment CommentFields on Comment {\n  ...CommentBaseFields\n  commentOn {\n    ...PrimaryPublicationFields\n  }\n}": types.CommentFieldsFragmentDoc,
    "fragment Erc20Fields on Asset {\n  ... on Erc20 {\n    name\n    symbol\n    decimals\n    contract {\n      ...NetworkAddressFields\n    }\n  }\n}": types.Erc20FieldsFragmentDoc,
    "fragment FiatAmountFields on FiatAmount {\n  asset {\n    name\n    symbol\n    decimals\n  }\n  value\n}": types.FiatAmountFieldsFragmentDoc,
    "fragment FollowModuleFields on FollowModule {\n  ... on FeeFollowModuleSettings {\n    type\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    recipient\n  }\n  ... on RevertFollowModuleSettings {\n    type\n  }\n  ... on UnknownFollowModuleSettings {\n    type\n  }\n}": types.FollowModuleFieldsFragmentDoc,
    "fragment HandleInfoFields on HandleInfo {\n  id\n  fullHandle\n  localName\n  ownedBy\n}": types.HandleInfoFieldsFragmentDoc,
    "fragment ImageSetFields on ImageSet {\n  raw {\n    uri\n  }\n  optimized {\n    uri\n  }\n}": types.ImageSetFieldsFragmentDoc,
    "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}": types.MetadataAttributeFieldsFragmentDoc,
    "fragment MirrorFields on Mirror {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  mirrorOn {\n    ...PrimaryPublicationFields\n  }\n}": types.MirrorFieldsFragmentDoc,
    "fragment NetworkAddressFields on NetworkAddress {\n  address\n  chainId\n}": types.NetworkAddressFieldsFragmentDoc,
    "fragment OpenActionModulesFields on OpenActionModule {\n  ... on SimpleCollectOpenActionSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    followerOnly\n    recipient\n    referralFee\n    collectNft\n    endsAt\n  }\n  ... on MultirecipientFeeCollectOpenActionSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    referralFee\n    followerOnly\n    collectNft\n    endsAt\n    recipients {\n      recipient\n      split\n    }\n  }\n  ... on LegacyMultirecipientFeeCollectModuleSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    collectNft\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    referralFee\n    followerOnly\n    endsAt\n    recipients {\n      recipient\n      split\n    }\n  }\n  ... on LegacySimpleCollectModuleSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    collectNft\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    followerOnly\n    recipient\n    referralFee\n    endsAt\n  }\n  ... on LegacyFreeCollectModuleSettings {\n    type\n  }\n  ... on LegacyFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyLimitedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyLimitedTimedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyRevertCollectModuleSettings {\n    type\n  }\n  ... on LegacyTimedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyERC4626FeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyAaveFeeCollectModuleSettings {\n    type\n  }\n  ... on UnknownOpenActionModuleSettings {\n    type\n    collectNft\n    initializeResultData\n    initializeCalldata\n    contract {\n      ...NetworkAddressFields\n    }\n    openActionModuleReturnData\n  }\n}": types.OpenActionModulesFieldsFragmentDoc,
    "fragment PostFields on Post {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n}": types.PostFieldsFragmentDoc,
    "fragment PrimaryPublicationFields on PrimaryPublication {\n  ... on Post {\n    ...PostFields\n  }\n  ... on Comment {\n    ...CommentBaseFields\n  }\n  ... on Quote {\n    ...QuoteBaseFields\n  }\n}": types.PrimaryPublicationFieldsFragmentDoc,
    "fragment ProfileFields on Profile {\n  id\n  ownedBy {\n    ...NetworkAddressFields\n  }\n  signless\n  sponsor\n  createdAt\n  stats {\n    ...ProfileStatsFields\n  }\n  operations {\n    ...ProfileOperationsFields\n  }\n  interests\n  guardian {\n    protected\n    cooldownEndsOn\n  }\n  invitedBy {\n    id\n  }\n  onchainIdentity {\n    proofOfHumanity\n    ens {\n      name\n    }\n    sybilDotOrg {\n      verified\n      source {\n        twitter {\n          handle\n        }\n      }\n    }\n    worldcoin {\n      isHuman\n    }\n  }\n  followNftAddress {\n    address\n    chainId\n  }\n  metadata {\n    ...ProfileMetadataFields\n  }\n  followModule {\n    ...FollowModuleFields\n  }\n  handle {\n    ...HandleInfoFields\n  }\n}": types.ProfileFieldsFragmentDoc,
    "fragment ProfileMetadataFields on ProfileMetadata {\n  displayName\n  bio\n  rawURI\n  picture {\n    ... on ImageSet {\n      ...ImageSetFields\n    }\n    ... on NftImage {\n      image {\n        ...ImageSetFields\n      }\n    }\n  }\n  coverPicture {\n    ...ImageSetFields\n  }\n  attributes {\n    ...MetadataAttributeFields\n  }\n}": types.ProfileMetadataFieldsFragmentDoc,
    "fragment ProfileOperationsFields on ProfileOperations {\n  id\n  isBlockedByMe {\n    value\n  }\n  isFollowedByMe {\n    value\n  }\n  isFollowingMe {\n    value\n  }\n  canBlock\n  canUnblock\n  canFollow\n  canUnfollow\n}": types.ProfileOperationsFieldsFragmentDoc,
    "fragment ProfileStatsFields on ProfileStats {\n  id\n  followers\n  following\n  comments\n  posts\n  mirrors\n  quotes\n  publications\n  reactions\n  reacted\n  countOpenActions\n  lensClassifierScore\n}": types.ProfileStatsFieldsFragmentDoc,
    "fragment PublicationOperationFields on PublicationOperations {\n  isNotInterested\n  hasBookmarked\n  hasReported\n  canAct\n  hasActed {\n    value\n    isFinalisedOnchain\n  }\n  actedOn {\n    ... on KnownCollectOpenActionResult {\n      type\n    }\n    ... on UnknownOpenActionResult {\n      address\n      category\n      initReturnData\n    }\n  }\n  hasReacted(request: {type: UPVOTE})\n  canComment\n  canMirror\n  hasMirrored\n  canDecrypt {\n    result\n    reasons\n    extraDetails\n  }\n}": types.PublicationOperationFieldsFragmentDoc,
    "fragment PublicationStatsFields on PublicationStats {\n  id\n  comments\n  mirrors\n  quotes\n  reactions(request: {type: UPVOTE})\n  countOpenActions\n}": types.PublicationStatsFieldsFragmentDoc,
    "fragment QuoteBaseFields on Quote {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n}": types.QuoteBaseFieldsFragmentDoc,
    "fragment QuoteFields on Quote {\n  ...QuoteBaseFields\n  quoteOn {\n    ...PrimaryPublicationFields\n  }\n}": types.QuoteFieldsFragmentDoc,
    "fragment AudioMetadataV3Fields on AudioMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  asset {\n    ...PublicationMetadataMediaAudioFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  title\n  content\n}": types.AudioMetadataV3FieldsFragmentDoc,
    "fragment ImageMetadataV3Fields on ImageMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  asset {\n    ...PublicationMetadataMediaImageFields\n  }\n  title\n  content\n}": types.ImageMetadataV3FieldsFragmentDoc,
    "fragment LinkMetadataV3Fields on LinkMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  sharingLink\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  content\n}": types.LinkMetadataV3FieldsFragmentDoc,
    "fragment LiveStreamMetadataV3Fields on LiveStreamMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  startsAt\n  endsAt\n  playbackURL\n  liveURL\n  checkLiveAPI\n  title\n  content\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n}": types.LiveStreamMetadataV3FieldsFragmentDoc,
    "fragment MintMetadataV3Fields on MintMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  mintLink\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  content\n}": types.MintMetadataV3FieldsFragmentDoc,
    "fragment TextOnlyMetadataV3Fields on TextOnlyMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  content\n}": types.TextOnlyMetadataV3FieldsFragmentDoc,
    "fragment VideoMetadataV3Fields on VideoMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  asset {\n    ...PublicationMetadataMediaVideoFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  title\n  content\n  isShortVideo\n}": types.VideoMetadataV3FieldsFragmentDoc,
    "fragment PublicationMetadataMediaAudioFields on PublicationMetadataMediaAudio {\n  audio {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  cover {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  duration\n}": types.PublicationMetadataMediaAudioFieldsFragmentDoc,
    "fragment PublicationMetadataMediaFields on PublicationMetadataMedia {\n  ... on PublicationMetadataMediaVideo {\n    ...PublicationMetadataMediaVideoFields\n  }\n  ... on PublicationMetadataMediaImage {\n    ...PublicationMetadataMediaImageFields\n  }\n  ... on PublicationMetadataMediaAudio {\n    ...PublicationMetadataMediaAudioFields\n  }\n}": types.PublicationMetadataMediaFieldsFragmentDoc,
    "fragment PublicationMetadataMediaImageFields on PublicationMetadataMediaImage {\n  image {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n}": types.PublicationMetadataMediaImageFieldsFragmentDoc,
    "fragment PublicationMetadataMediaVideoFields on PublicationMetadataMediaVideo {\n  video {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  cover {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  duration\n}": types.PublicationMetadataMediaVideoFieldsFragmentDoc,
    "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    accessToken\n    refreshToken\n    identityToken\n  }\n}": types.AuthenticateDocument,
    "mutation BroadcastOnchain($request: BroadcastRequest!) {\n  broadcastOnchain(request: $request) {\n    ... on RelaySuccess {\n      __typename\n      txHash\n      txId\n    }\n    ... on RelayError {\n      __typename\n      reason\n    }\n  }\n}\n\nmutation BroadcastOnMomoka($request: BroadcastRequest!) {\n  broadcastOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on RelayError {\n      __typename\n      reason\n    }\n  }\n}": types.BroadcastOnchainDocument,
    "mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {\n  createMomokaCommentTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Comment {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        actionModules\n        actionModulesInitDatas\n        contentURI\n        deadline\n        nonce\n        pointedProfileId\n        pointedPubId\n        profileId\n        referenceModule\n        referenceModuleData\n        referenceModuleInitData\n        referrerProfileIds\n        referrerPubIds\n      }\n    }\n  }\n}": types.CreateMomokaCommentTypedDataDocument,
    "mutation CreateMomokaMirrorTypedData($request: MomokaMirrorRequest!) {\n  createMomokaMirrorTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Mirror {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        metadataURI\n        deadline\n        profileId\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n      }\n    }\n  }\n}": types.CreateMomokaMirrorTypedDataDocument,
    "mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {\n  createMomokaPostTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Post {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}": types.CreateMomokaPostTypedDataDocument,
    "mutation PostOnMomoka($request: MomokaPostRequest!) {\n  postOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation CommentOnMomoka($request: MomokaCommentRequest!) {\n  commentOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation QuoteOnMomoka($request: MomokaQuoteRequest!) {\n  quoteOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation MirrorOnMomoka($request: MomokaMirrorRequest!) {\n  mirrorOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.PostOnMomokaDocument,
    "mutation CreateChangeProfileManagersTypedData($options: TypedDataOptions, $request: ChangeProfileManagersRequest!) {\n  createChangeProfileManagersTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        ChangeDelegatedExecutorsConfig {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        delegatorProfileId\n        delegatedExecutors\n        approvals\n        configNumber\n        switchToGivenConfig\n      }\n    }\n  }\n}": types.CreateChangeProfileManagersTypedDataDocument,
    "mutation CreateOnchainCommentTypedData($options: TypedDataOptions, $request: OnchainCommentRequest!) {\n  createOnchainCommentTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Comment {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}": types.CreateOnchainCommentTypedDataDocument,
    "mutation CreateOnchainMirrorTypedData($options: TypedDataOptions, $request: OnchainMirrorRequest!) {\n  createOnchainMirrorTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        Mirror {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        metadataURI\n        deadline\n        profileId\n        metadataURI\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n      }\n    }\n  }\n}": types.CreateOnchainMirrorTypedDataDocument,
    "mutation CreateOnchainPostTypedData($options: TypedDataOptions, $request: OnchainPostRequest!) {\n  createOnchainPostTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Post {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}": types.CreateOnchainPostTypedDataDocument,
    "mutation CreateOnchainSetProfileMetadataTypedData($options: TypedDataOptions, $request: OnchainSetProfileMetadataRequest!) {\n  createOnchainSetProfileMetadataTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        SetProfileMetadataURI {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        metadataURI\n      }\n    }\n  }\n}": types.CreateOnchainSetProfileMetadataTypedDataDocument,
    "mutation PostOnchain($request: OnchainPostRequest!) {\n  postOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation QuoteOnchain($request: OnchainQuoteRequest!) {\n  quoteOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation CommentOnchain($request: OnchainCommentRequest!) {\n  commentOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation MirrorOnchain($request: OnchainMirrorRequest!) {\n  mirrorOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.PostOnchainDocument,
    "mutation AddProfileInterests($request: ProfileInterestsRequest!) {\n  addProfileInterests(request: $request)\n}": types.AddProfileInterestsDocument,
    "mutation CreateBlockProfilesTypedData($options: TypedDataOptions, $request: BlockRequest!) {\n  createBlockProfilesTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      value {\n        nonce\n        deadline\n        byProfileId\n        idsOfProfilesToSetBlockStatus\n        blockStatus\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        SetBlockStatus {\n          name\n          type\n        }\n      }\n    }\n  }\n}\n\nmutation Block($request: BlockRequest!) {\n  block(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateBlockProfilesTypedDataDocument,
    "mutation CreateProfileWithHandle($request: CreateProfileWithHandleRequest!) {\n  createProfileWithHandle(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on CreateProfileWithHandleErrorResult {\n      reason\n    }\n  }\n}": types.CreateProfileWithHandleDocument,
    "mutation CreateFollowTypedData($options: TypedDataOptions, $request: FollowRequest!) {\n  createFollowTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        Follow {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        followerProfileId\n        idsOfProfilesToFollow\n        followTokenIds\n        datas\n      }\n    }\n  }\n}\n\nmutation Follow($request: FollowLensManagerRequest!) {\n  follow(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateFollowTypedDataDocument,
    "mutation CreateLinkHandleToProfileTypedData($options: TypedDataOptions, $request: LinkHandleToProfileRequest!) {\n  createLinkHandleToProfileTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Link {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        handleId\n      }\n    }\n  }\n}\n\nmutation LinkHandleToProfile($request: LinkHandleToProfileRequest!) {\n  linkHandleToProfile(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateLinkHandleToProfileTypedDataDocument,
    "mutation RemoveProfileInterests($request: ProfileInterestsRequest!) {\n  removeProfileInterests(request: $request)\n}": types.RemoveProfileInterestsDocument,
    "mutation CreateSetFollowModuleTypedData($options: TypedDataOptions, $request: SetFollowModuleRequest!) {\n  createSetFollowModuleTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        SetFollowModule {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        followModule\n        followModuleInitData\n      }\n    }\n  }\n}\n\nmutation SetFollowModule($request: SetFollowModuleRequest!) {\n  setFollowModule(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateSetFollowModuleTypedDataDocument,
    "mutation SetProfileMetadata($request: OnchainSetProfileMetadataRequest!) {\n  setProfileMetadata(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.SetProfileMetadataDocument,
    "mutation CreateUnblockProfilesTypedData($options: TypedDataOptions, $request: UnblockRequest!) {\n  createUnblockProfilesTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        SetBlockStatus {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        byProfileId\n        idsOfProfilesToSetBlockStatus\n        blockStatus\n      }\n    }\n  }\n}\n\nmutation Unblock($request: UnblockRequest!) {\n  unblock(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateUnblockProfilesTypedDataDocument,
    "mutation CreateUnfollowTypedData($options: TypedDataOptions, $request: UnfollowRequest!) {\n  createUnfollowTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      types {\n        Unfollow {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        unfollowerProfileId\n        idsOfProfilesToUnfollow\n      }\n    }\n  }\n}\n\nmutation Unfollow($request: UnfollowRequest!) {\n  unfollow(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateUnfollowTypedDataDocument,
    "mutation CreateUnlinkHandleFromProfileTypedData($options: TypedDataOptions, $request: UnlinkHandleFromProfileRequest!) {\n  createUnlinkHandleFromProfileTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Unlink {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        handleId\n      }\n    }\n  }\n}\n\nmutation UnlinkHandleFromProfile($request: UnlinkHandleFromProfileRequest!) {\n  unlinkHandleFromProfile(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateUnlinkHandleFromProfileTypedDataDocument,
    "mutation CreateActOnOpenActionTypedData($options: TypedDataOptions, $request: ActOnOpenActionRequest!) {\n  createActOnOpenActionTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      types {\n        Act {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        publicationActedProfileId\n        publicationActedId\n        actorProfileId\n        referrerProfileIds\n        referrerPubIds\n        actionModuleAddress\n        actionModuleData\n      }\n    }\n  }\n}\n\nmutation ActOnOpenAction($request: ActOnOpenActionLensManagerRequest!) {\n  actOnOpenAction(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateActOnOpenActionTypedDataDocument,
    "mutation AddPublicationBookmark($request: PublicationBookmarkRequest!) {\n  addPublicationBookmark(request: $request)\n}": types.AddPublicationBookmarkDocument,
    "mutation AddPublicationNotInterested($request: PublicationNotInterestedRequest!) {\n  addPublicationNotInterested(request: $request)\n}": types.AddPublicationNotInterestedDocument,
    "mutation AddReaction($request: ReactionRequest!) {\n  addReaction(request: $request)\n}": types.AddReactionDocument,
    "mutation HidePublication($request: HidePublicationRequest!) {\n  hidePublication(request: $request)\n}": types.HidePublicationDocument,
    "mutation CreateLegacyCollectTypedData($options: TypedDataOptions, $request: LegacyCollectRequest!) {\n  createLegacyCollectTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        CollectLegacy {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        publicationCollectedProfileId\n        publicationCollectedId\n        collectorProfileId\n        referrerProfileId\n        referrerPubId\n        collectModuleData\n      }\n    }\n  }\n}\n\nmutation LegacyCollect($request: LegacyCollectRequest!) {\n  legacyCollect(request: $request) {\n    ... on RelaySuccess {\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}": types.CreateLegacyCollectTypedDataDocument,
    "mutation RemovePublicationBookmark($request: PublicationBookmarkRequest!) {\n  removePublicationBookmark(request: $request)\n}": types.RemovePublicationBookmarkDocument,
    "mutation RemoveReaction($request: ReactionRequest!) {\n  removeReaction(request: $request)\n}": types.RemoveReactionDocument,
    "mutation ReportProfile($request: ReportProfileRequest!) {\n  reportProfile(request: $request)\n}": types.ReportProfileDocument,
    "mutation ReportPublication($request: ReportPublicationRequest!) {\n  reportPublication(request: $request)\n}": types.ReportPublicationDocument,
    "mutation UndoPublicationNotInterested($request: PublicationNotInterestedRequest!) {\n  undoPublicationNotInterested(request: $request)\n}": types.UndoPublicationNotInterestedDocument,
    "query ApprovedAuthentications($request: ApprovedAuthenticationRequest!) {\n  approvedAuthentications(request: $request) {\n    items {\n      authorizationId\n      browser\n      device\n      os\n      origin\n      expiresAt\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.ApprovedAuthenticationsDocument,
    "query ApprovedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {\n  approvedModuleAllowanceAmount(request: $request) {\n    allowance {\n      value\n      asset {\n        ...Erc20Fields\n      }\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    moduleContract {\n      ...NetworkAddressFields\n    }\n    moduleName\n  }\n}": types.ApprovedModuleAllowanceAmountDocument,
    "query Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}": types.ChallengeDocument,
    "query CurrentProfile($request: ProfileRequest!) {\n  profile(request: $request) {\n    ...ProfileFields\n  }\n  userSigNonces {\n    lensHubOnchainSigNonce\n  }\n}": types.CurrentProfileDocument,
    "query ExplorePublications($request: ExplorePublicationRequest!) {\n  explorePublications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.ExplorePublicationsDocument,
    "query FeedHighlights($request: FeedHighlightsRequest!) {\n  feedHighlights(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FeedHighlightsDocument,
    "query Followers($request: FollowersRequest!) {\n  followers(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowersDocument,
    "query Following($request: FollowingRequest!) {\n  following(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FollowingDocument,
    "query GenerateLensAPIRelayAddress {\n  generateLensAPIRelayAddress\n}": types.GenerateLensApiRelayAddressDocument,
    "query GenerateModuleCurrencyApprovalData($request: GenerateModuleCurrencyApprovalDataRequest!) {\n  generateModuleCurrencyApprovalData(request: $request) {\n    to\n    from\n    data\n  }\n}": types.GenerateModuleCurrencyApprovalDataDocument,
    "query HandleToAddress($request: HandleToAddressRequest!) {\n  handleToAddress(request: $request)\n}": types.HandleToAddressDocument,
    "query HasPublicationIndexed($request: PublicationRequest!) {\n  publication(request: $request) {\n    ... on Post {\n      id\n    }\n    ... on Comment {\n      id\n    }\n    ... on Mirror {\n      id\n    }\n    ... on Quote {\n      id\n    }\n  }\n}": types.HasPublicationIndexedDocument,
    "query LatestNotificationId($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on ReactionNotification {\n        id\n      }\n      ... on CommentNotification {\n        id\n      }\n      ... on MirrorNotification {\n        id\n      }\n      ... on QuoteNotification {\n        id\n      }\n      ... on ActedNotification {\n        id\n      }\n      ... on FollowNotification {\n        id\n      }\n      ... on MentionNotification {\n        id\n      }\n    }\n  }\n}": types.LatestNotificationIdDocument,
    "query LensTransactionStatus($request: LensTransactionStatusRequest!) {\n  lensTransactionStatus(request: $request) {\n    status\n    txHash\n    reason\n    extraInfo\n  }\n}": types.LensTransactionStatusDocument,
    "query ModuleMetadata($request: ModuleMetadataRequest!) {\n  moduleMetadata(request: $request) {\n    metadata {\n      attributes {\n        key\n        type\n        value\n      }\n      authors\n      description\n      initializeCalldataABI\n      initializeResultDataABI\n      name\n      processCalldataABI\n      title\n    }\n    moduleType\n    signlessApproved\n    sponsoredApproved\n    verified\n  }\n}": types.ModuleMetadataDocument,
    "query MutualFollowers($request: MutualFollowersRequest!) {\n  mutualFollowers(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.MutualFollowersDocument,
    "query Notifications($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on ReactionNotification {\n        id\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n        reactions {\n          profile {\n            ...ProfileFields\n          }\n        }\n      }\n      ... on CommentNotification {\n        id\n        comment {\n          ...CommentFields\n        }\n      }\n      ... on MirrorNotification {\n        id\n        mirrors {\n          mirrorId\n          profile {\n            ...ProfileFields\n          }\n        }\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n      }\n      ... on QuoteNotification {\n        id\n        quote {\n          ...QuoteFields\n        }\n      }\n      ... on ActedNotification {\n        id\n        actions {\n          actedAt\n          by {\n            ...ProfileFields\n          }\n        }\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Mirror {\n            ...MirrorFields\n          }\n        }\n      }\n      ... on FollowNotification {\n        id\n        followers {\n          ...ProfileFields\n        }\n      }\n      ... on MentionNotification {\n        id\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.NotificationsDocument,
    "query OwnedHandles($request: OwnedHandlesRequest!) {\n  ownedHandles(request: $request) {\n    items {\n      id\n      linkedTo {\n        nftTokenId\n        contract {\n          address\n        }\n      }\n      fullHandle\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.OwnedHandlesDocument,
    "query Profile($request: ProfileRequest!) {\n  profile(request: $request) {\n    ...ProfileFields\n  }\n}": types.ProfileDocument,
    "query Feed($request: FeedRequest!) {\n  feed(request: $request) {\n    items {\n      root {\n        ... on Post {\n          ...PostFields\n        }\n        ... on Comment {\n          ...CommentFields\n        }\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.FeedDocument,
    "query ProfileFollowModule($request: ProfileRequest!) {\n  profile(request: $request) {\n    followModule {\n      ...FollowModuleFields\n    }\n  }\n}": types.ProfileFollowModuleDocument,
    "query ProfileInterestsOptions($request: ProfileRequest!) {\n  profileInterestsOptions\n  profile(request: $request) {\n    id\n    interests\n  }\n}": types.ProfileInterestsOptionsDocument,
    "query ProfileManagers($request: ProfileManagersRequest!) {\n  profileManagers(request: $request) {\n    items {\n      address\n      isLensManager\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.ProfileManagersDocument,
    "query Profiles($request: ProfilesRequest!) {\n  profiles(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.ProfilesDocument,
    "query ProfilesManaged($request: ProfilesManagedRequest!, $lastLoggedInProfileRequest: LastLoggedInProfileRequest!) {\n  profilesManaged(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n  lastLoggedInProfile(request: $lastLoggedInProfileRequest) {\n    ...ProfileFields\n  }\n}": types.ProfilesManagedDocument,
    "query Publication($request: PublicationRequest!) {\n  publication(request: $request) {\n    ... on Post {\n      ...PostFields\n    }\n    ... on Comment {\n      ...CommentFields\n    }\n    ... on Mirror {\n      ...MirrorFields\n    }\n    ... on Quote {\n      ...QuoteFields\n    }\n  }\n}": types.PublicationDocument,
    "query PublicationBookmarks($request: PublicationBookmarksRequest!) {\n  publicationBookmarks(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.PublicationBookmarksDocument,
    "query Publications($request: PublicationsRequest!) {\n  publications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.PublicationsDocument,
    "query RevenueFromPublication($request: RevenueFromPublicationRequest!) {\n  revenueFromPublication(request: $request) {\n    publication {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    revenue {\n      total {\n        ...AmountFields\n      }\n    }\n  }\n}": types.RevenueFromPublicationDocument,
    "query RevenueFromPublications($request: RevenueFromPublicationsRequest!) {\n  revenueFromPublications(request: $request) {\n    items {\n      publication {\n        ... on Post {\n          ...PostFields\n        }\n        ... on Comment {\n          ...CommentFields\n        }\n        ... on Mirror {\n          ...MirrorFields\n        }\n        ... on Quote {\n          ...QuoteFields\n        }\n      }\n      revenue {\n        total {\n          ...AmountFields\n        }\n      }\n    }\n  }\n}": types.RevenueFromPublicationsDocument,
    "mutation RevokeAuthentication($request: RevokeAuthenticationRequest!) {\n  revokeAuthentication(request: $request)\n}": types.RevokeAuthenticationDocument,
    "query SearchProfiles($request: ProfileSearchRequest!) {\n  searchProfiles(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.SearchProfilesDocument,
    "query SearchPublications($request: PublicationSearchRequest!) {\n  searchPublications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.SearchPublicationsDocument,
    "query TxIdToTxHash($for: TxId!) {\n  txIdToTxHash(for: $for)\n}": types.TxIdToTxHashDocument,
    "query WhoActedOnPublication($request: WhoActedOnPublicationRequest!) {\n  whoActedOnPublication(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.WhoActedOnPublicationDocument,
    "query WhoHaveBlocked($request: WhoHaveBlockedRequest!) {\n  whoHaveBlocked(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.WhoHaveBlockedDocument,
    "query WhoReactedPublication($request: WhoReactedPublicationRequest!) {\n  whoReactedPublication(request: $request) {\n    items {\n      profile {\n        ...ProfileFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}": types.WhoReactedPublicationDocument,
    "subscription AuthorizationRecordRevokedSubscription($authorizationId: UUID!) {\n  authorizationRecordRevoked(authorizationId: $authorizationId)\n}": types.AuthorizationRecordRevokedSubscriptionDocument,
    "subscription NewNotificationSubscription($for: ProfileId!) {\n  newNotification(for: $for) {\n    ... on ReactionNotification {\n      id\n    }\n    ... on CommentNotification {\n      id\n    }\n    ... on MirrorNotification {\n      id\n    }\n    ... on QuoteNotification {\n      id\n    }\n    ... on ActedNotification {\n      id\n    }\n    ... on FollowNotification {\n      id\n    }\n    ... on MentionNotification {\n      id\n    }\n  }\n}": types.NewNotificationSubscriptionDocument,
    "subscription UserSigNoncesSubscription($address: EvmAddress!) {\n  userSigNonces(address: $address) {\n    lensHubOnchainSigNonce\n  }\n}": types.UserSigNoncesSubscriptionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AmountFields on Amount {\n  asset {\n    ...Erc20Fields\n  }\n  value\n}"): typeof import('./graphql').AmountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AnyPublicationMetadataFields on PublicationMetadata {\n  ... on VideoMetadataV3 {\n    ...VideoMetadataV3Fields\n  }\n  ... on AudioMetadataV3 {\n    ...AudioMetadataV3Fields\n  }\n  ... on ImageMetadataV3 {\n    ...ImageMetadataV3Fields\n  }\n  ... on LinkMetadataV3 {\n    ...LinkMetadataV3Fields\n  }\n  ... on LiveStreamMetadataV3 {\n    ...LiveStreamMetadataV3Fields\n  }\n  ... on MintMetadataV3 {\n    ...MintMetadataV3Fields\n  }\n  ... on TextOnlyMetadataV3 {\n    ...TextOnlyMetadataV3Fields\n  }\n}"): typeof import('./graphql').AnyPublicationMetadataFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CommentBaseFields on Comment {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n  root {\n    ...PostFields\n  }\n}"): typeof import('./graphql').CommentBaseFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment CommentFields on Comment {\n  ...CommentBaseFields\n  commentOn {\n    ...PrimaryPublicationFields\n  }\n}"): typeof import('./graphql').CommentFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Erc20Fields on Asset {\n  ... on Erc20 {\n    name\n    symbol\n    decimals\n    contract {\n      ...NetworkAddressFields\n    }\n  }\n}"): typeof import('./graphql').Erc20FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FiatAmountFields on FiatAmount {\n  asset {\n    name\n    symbol\n    decimals\n  }\n  value\n}"): typeof import('./graphql').FiatAmountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment FollowModuleFields on FollowModule {\n  ... on FeeFollowModuleSettings {\n    type\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    recipient\n  }\n  ... on RevertFollowModuleSettings {\n    type\n  }\n  ... on UnknownFollowModuleSettings {\n    type\n  }\n}"): typeof import('./graphql').FollowModuleFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment HandleInfoFields on HandleInfo {\n  id\n  fullHandle\n  localName\n  ownedBy\n}"): typeof import('./graphql').HandleInfoFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ImageSetFields on ImageSet {\n  raw {\n    uri\n  }\n  optimized {\n    uri\n  }\n}"): typeof import('./graphql').ImageSetFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MetadataAttributeFields on MetadataAttribute {\n  type\n  key\n  value\n}"): typeof import('./graphql').MetadataAttributeFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MirrorFields on Mirror {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  mirrorOn {\n    ...PrimaryPublicationFields\n  }\n}"): typeof import('./graphql').MirrorFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment NetworkAddressFields on NetworkAddress {\n  address\n  chainId\n}"): typeof import('./graphql').NetworkAddressFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment OpenActionModulesFields on OpenActionModule {\n  ... on SimpleCollectOpenActionSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    followerOnly\n    recipient\n    referralFee\n    collectNft\n    endsAt\n  }\n  ... on MultirecipientFeeCollectOpenActionSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    referralFee\n    followerOnly\n    collectNft\n    endsAt\n    recipients {\n      recipient\n      split\n    }\n  }\n  ... on LegacyMultirecipientFeeCollectModuleSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    collectNft\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    referralFee\n    followerOnly\n    endsAt\n    recipients {\n      recipient\n      split\n    }\n  }\n  ... on LegacySimpleCollectModuleSettings {\n    type\n    contract {\n      ...NetworkAddressFields\n    }\n    collectNft\n    amount {\n      ...AmountFields\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    collectLimit\n    followerOnly\n    recipient\n    referralFee\n    endsAt\n  }\n  ... on LegacyFreeCollectModuleSettings {\n    type\n  }\n  ... on LegacyFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyLimitedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyLimitedTimedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyRevertCollectModuleSettings {\n    type\n  }\n  ... on LegacyTimedFeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyERC4626FeeCollectModuleSettings {\n    type\n  }\n  ... on LegacyAaveFeeCollectModuleSettings {\n    type\n  }\n  ... on UnknownOpenActionModuleSettings {\n    type\n    collectNft\n    initializeResultData\n    initializeCalldata\n    contract {\n      ...NetworkAddressFields\n    }\n    openActionModuleReturnData\n  }\n}"): typeof import('./graphql').OpenActionModulesFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PostFields on Post {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n}"): typeof import('./graphql').PostFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PrimaryPublicationFields on PrimaryPublication {\n  ... on Post {\n    ...PostFields\n  }\n  ... on Comment {\n    ...CommentBaseFields\n  }\n  ... on Quote {\n    ...QuoteBaseFields\n  }\n}"): typeof import('./graphql').PrimaryPublicationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProfileFields on Profile {\n  id\n  ownedBy {\n    ...NetworkAddressFields\n  }\n  signless\n  sponsor\n  createdAt\n  stats {\n    ...ProfileStatsFields\n  }\n  operations {\n    ...ProfileOperationsFields\n  }\n  interests\n  guardian {\n    protected\n    cooldownEndsOn\n  }\n  invitedBy {\n    id\n  }\n  onchainIdentity {\n    proofOfHumanity\n    ens {\n      name\n    }\n    sybilDotOrg {\n      verified\n      source {\n        twitter {\n          handle\n        }\n      }\n    }\n    worldcoin {\n      isHuman\n    }\n  }\n  followNftAddress {\n    address\n    chainId\n  }\n  metadata {\n    ...ProfileMetadataFields\n  }\n  followModule {\n    ...FollowModuleFields\n  }\n  handle {\n    ...HandleInfoFields\n  }\n}"): typeof import('./graphql').ProfileFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProfileMetadataFields on ProfileMetadata {\n  displayName\n  bio\n  rawURI\n  picture {\n    ... on ImageSet {\n      ...ImageSetFields\n    }\n    ... on NftImage {\n      image {\n        ...ImageSetFields\n      }\n    }\n  }\n  coverPicture {\n    ...ImageSetFields\n  }\n  attributes {\n    ...MetadataAttributeFields\n  }\n}"): typeof import('./graphql').ProfileMetadataFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProfileOperationsFields on ProfileOperations {\n  id\n  isBlockedByMe {\n    value\n  }\n  isFollowedByMe {\n    value\n  }\n  isFollowingMe {\n    value\n  }\n  canBlock\n  canUnblock\n  canFollow\n  canUnfollow\n}"): typeof import('./graphql').ProfileOperationsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ProfileStatsFields on ProfileStats {\n  id\n  followers\n  following\n  comments\n  posts\n  mirrors\n  quotes\n  publications\n  reactions\n  reacted\n  countOpenActions\n  lensClassifierScore\n}"): typeof import('./graphql').ProfileStatsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationOperationFields on PublicationOperations {\n  isNotInterested\n  hasBookmarked\n  hasReported\n  canAct\n  hasActed {\n    value\n    isFinalisedOnchain\n  }\n  actedOn {\n    ... on KnownCollectOpenActionResult {\n      type\n    }\n    ... on UnknownOpenActionResult {\n      address\n      category\n      initReturnData\n    }\n  }\n  hasReacted(request: {type: UPVOTE})\n  canComment\n  canMirror\n  hasMirrored\n  canDecrypt {\n    result\n    reasons\n    extraDetails\n  }\n}"): typeof import('./graphql').PublicationOperationFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationStatsFields on PublicationStats {\n  id\n  comments\n  mirrors\n  quotes\n  reactions(request: {type: UPVOTE})\n  countOpenActions\n}"): typeof import('./graphql').PublicationStatsFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment QuoteBaseFields on Quote {\n  id\n  publishedOn {\n    id\n  }\n  isHidden\n  momoka {\n    proof\n  }\n  txHash\n  createdAt\n  by {\n    ...ProfileFields\n  }\n  stats {\n    ...PublicationStatsFields\n  }\n  operations {\n    ...PublicationOperationFields\n  }\n  metadata {\n    ...AnyPublicationMetadataFields\n  }\n  openActionModules {\n    ...OpenActionModulesFields\n  }\n}"): typeof import('./graphql').QuoteBaseFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment QuoteFields on Quote {\n  ...QuoteBaseFields\n  quoteOn {\n    ...PrimaryPublicationFields\n  }\n}"): typeof import('./graphql').QuoteFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AudioMetadataV3Fields on AudioMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  asset {\n    ...PublicationMetadataMediaAudioFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  title\n  content\n}"): typeof import('./graphql').AudioMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ImageMetadataV3Fields on ImageMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  asset {\n    ...PublicationMetadataMediaImageFields\n  }\n  title\n  content\n}"): typeof import('./graphql').ImageMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LinkMetadataV3Fields on LinkMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  sharingLink\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  content\n}"): typeof import('./graphql').LinkMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LiveStreamMetadataV3Fields on LiveStreamMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  startsAt\n  endsAt\n  playbackURL\n  liveURL\n  checkLiveAPI\n  title\n  content\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n}"): typeof import('./graphql').LiveStreamMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment MintMetadataV3Fields on MintMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  mintLink\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  content\n}"): typeof import('./graphql').MintMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TextOnlyMetadataV3Fields on TextOnlyMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  content\n}"): typeof import('./graphql').TextOnlyMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment VideoMetadataV3Fields on VideoMetadataV3 {\n  __typename\n  id\n  rawURI\n  tags\n  contentWarning\n  attributes {\n    ...MetadataAttributeFields\n  }\n  asset {\n    ...PublicationMetadataMediaVideoFields\n  }\n  attachments {\n    ...PublicationMetadataMediaFields\n  }\n  title\n  content\n  isShortVideo\n}"): typeof import('./graphql').VideoMetadataV3FieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationMetadataMediaAudioFields on PublicationMetadataMediaAudio {\n  audio {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  cover {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  duration\n}"): typeof import('./graphql').PublicationMetadataMediaAudioFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationMetadataMediaFields on PublicationMetadataMedia {\n  ... on PublicationMetadataMediaVideo {\n    ...PublicationMetadataMediaVideoFields\n  }\n  ... on PublicationMetadataMediaImage {\n    ...PublicationMetadataMediaImageFields\n  }\n  ... on PublicationMetadataMediaAudio {\n    ...PublicationMetadataMediaAudioFields\n  }\n}"): typeof import('./graphql').PublicationMetadataMediaFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationMetadataMediaImageFields on PublicationMetadataMediaImage {\n  image {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n}"): typeof import('./graphql').PublicationMetadataMediaImageFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment PublicationMetadataMediaVideoFields on PublicationMetadataMediaVideo {\n  video {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  cover {\n    raw {\n      uri\n    }\n    optimized {\n      uri\n    }\n  }\n  duration\n}"): typeof import('./graphql').PublicationMetadataMediaVideoFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Authenticate($request: SignedAuthChallenge!) {\n  authenticate(request: $request) {\n    accessToken\n    refreshToken\n    identityToken\n  }\n}"): typeof import('./graphql').AuthenticateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation BroadcastOnchain($request: BroadcastRequest!) {\n  broadcastOnchain(request: $request) {\n    ... on RelaySuccess {\n      __typename\n      txHash\n      txId\n    }\n    ... on RelayError {\n      __typename\n      reason\n    }\n  }\n}\n\nmutation BroadcastOnMomoka($request: BroadcastRequest!) {\n  broadcastOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on RelayError {\n      __typename\n      reason\n    }\n  }\n}"): typeof import('./graphql').BroadcastOnchainDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {\n  createMomokaCommentTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Comment {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        actionModules\n        actionModulesInitDatas\n        contentURI\n        deadline\n        nonce\n        pointedProfileId\n        pointedPubId\n        profileId\n        referenceModule\n        referenceModuleData\n        referenceModuleInitData\n        referrerProfileIds\n        referrerPubIds\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateMomokaCommentTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateMomokaMirrorTypedData($request: MomokaMirrorRequest!) {\n  createMomokaMirrorTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Mirror {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        metadataURI\n        deadline\n        profileId\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateMomokaMirrorTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {\n  createMomokaPostTypedData(request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Post {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateMomokaPostTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PostOnMomoka($request: MomokaPostRequest!) {\n  postOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation CommentOnMomoka($request: MomokaCommentRequest!) {\n  commentOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation QuoteOnMomoka($request: MomokaQuoteRequest!) {\n  quoteOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation MirrorOnMomoka($request: MomokaMirrorRequest!) {\n  mirrorOnMomoka(request: $request) {\n    ... on CreateMomokaPublicationResult {\n      id\n      proof\n      momokaId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').PostOnMomokaDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateChangeProfileManagersTypedData($options: TypedDataOptions, $request: ChangeProfileManagersRequest!) {\n  createChangeProfileManagersTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        ChangeDelegatedExecutorsConfig {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        delegatorProfileId\n        delegatedExecutors\n        approvals\n        configNumber\n        switchToGivenConfig\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateChangeProfileManagersTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateOnchainCommentTypedData($options: TypedDataOptions, $request: OnchainCommentRequest!) {\n  createOnchainCommentTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Comment {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateOnchainCommentTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateOnchainMirrorTypedData($options: TypedDataOptions, $request: OnchainMirrorRequest!) {\n  createOnchainMirrorTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        Mirror {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        metadataURI\n        deadline\n        profileId\n        metadataURI\n        pointedProfileId\n        pointedPubId\n        referrerProfileIds\n        referrerPubIds\n        referenceModuleData\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateOnchainMirrorTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateOnchainPostTypedData($options: TypedDataOptions, $request: OnchainPostRequest!) {\n  createOnchainPostTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Post {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        contentURI\n        actionModules\n        actionModulesInitDatas\n        referenceModule\n        referenceModuleInitData\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateOnchainPostTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateOnchainSetProfileMetadataTypedData($options: TypedDataOptions, $request: OnchainSetProfileMetadataRequest!) {\n  createOnchainSetProfileMetadataTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        SetProfileMetadataURI {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        metadataURI\n      }\n    }\n  }\n}"): typeof import('./graphql').CreateOnchainSetProfileMetadataTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation PostOnchain($request: OnchainPostRequest!) {\n  postOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation QuoteOnchain($request: OnchainQuoteRequest!) {\n  quoteOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation CommentOnchain($request: OnchainCommentRequest!) {\n  commentOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}\n\nmutation MirrorOnchain($request: OnchainMirrorRequest!) {\n  mirrorOnchain(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').PostOnchainDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddProfileInterests($request: ProfileInterestsRequest!) {\n  addProfileInterests(request: $request)\n}"): typeof import('./graphql').AddProfileInterestsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateBlockProfilesTypedData($options: TypedDataOptions, $request: BlockRequest!) {\n  createBlockProfilesTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      value {\n        nonce\n        deadline\n        byProfileId\n        idsOfProfilesToSetBlockStatus\n        blockStatus\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        SetBlockStatus {\n          name\n          type\n        }\n      }\n    }\n  }\n}\n\nmutation Block($request: BlockRequest!) {\n  block(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateBlockProfilesTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateProfileWithHandle($request: CreateProfileWithHandleRequest!) {\n  createProfileWithHandle(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on CreateProfileWithHandleErrorResult {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateProfileWithHandleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFollowTypedData($options: TypedDataOptions, $request: FollowRequest!) {\n  createFollowTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      types {\n        Follow {\n          name\n          type\n        }\n      }\n      value {\n        nonce\n        deadline\n        followerProfileId\n        idsOfProfilesToFollow\n        followTokenIds\n        datas\n      }\n    }\n  }\n}\n\nmutation Follow($request: FollowLensManagerRequest!) {\n  follow(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateFollowTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLinkHandleToProfileTypedData($options: TypedDataOptions, $request: LinkHandleToProfileRequest!) {\n  createLinkHandleToProfileTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Link {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        handleId\n      }\n    }\n  }\n}\n\nmutation LinkHandleToProfile($request: LinkHandleToProfileRequest!) {\n  linkHandleToProfile(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateLinkHandleToProfileTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveProfileInterests($request: ProfileInterestsRequest!) {\n  removeProfileInterests(request: $request)\n}"): typeof import('./graphql').RemoveProfileInterestsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateSetFollowModuleTypedData($options: TypedDataOptions, $request: SetFollowModuleRequest!) {\n  createSetFollowModuleTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        SetFollowModule {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        followModule\n        followModuleInitData\n      }\n    }\n  }\n}\n\nmutation SetFollowModule($request: SetFollowModuleRequest!) {\n  setFollowModule(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateSetFollowModuleTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SetProfileMetadata($request: OnchainSetProfileMetadataRequest!) {\n  setProfileMetadata(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').SetProfileMetadataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUnblockProfilesTypedData($options: TypedDataOptions, $request: UnblockRequest!) {\n  createUnblockProfilesTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        SetBlockStatus {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        byProfileId\n        idsOfProfilesToSetBlockStatus\n        blockStatus\n      }\n    }\n  }\n}\n\nmutation Unblock($request: UnblockRequest!) {\n  unblock(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateUnblockProfilesTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUnfollowTypedData($options: TypedDataOptions, $request: UnfollowRequest!) {\n  createUnfollowTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      types {\n        Unfollow {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        unfollowerProfileId\n        idsOfProfilesToUnfollow\n      }\n    }\n  }\n}\n\nmutation Unfollow($request: UnfollowRequest!) {\n  unfollow(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateUnfollowTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUnlinkHandleFromProfileTypedData($options: TypedDataOptions, $request: UnlinkHandleFromProfileRequest!) {\n  createUnlinkHandleFromProfileTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        Unlink {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        profileId\n        handleId\n      }\n    }\n  }\n}\n\nmutation UnlinkHandleFromProfile($request: UnlinkHandleFromProfileRequest!) {\n  unlinkHandleFromProfile(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateUnlinkHandleFromProfileTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateActOnOpenActionTypedData($options: TypedDataOptions, $request: ActOnOpenActionRequest!) {\n  createActOnOpenActionTypedData(options: $options, request: $request) {\n    expiresAt\n    id\n    typedData {\n      types {\n        Act {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        publicationActedProfileId\n        publicationActedId\n        actorProfileId\n        referrerProfileIds\n        referrerPubIds\n        actionModuleAddress\n        actionModuleData\n      }\n    }\n  }\n}\n\nmutation ActOnOpenAction($request: ActOnOpenActionLensManagerRequest!) {\n  actOnOpenAction(request: $request) {\n    ... on RelaySuccess {\n      txHash\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateActOnOpenActionTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddPublicationBookmark($request: PublicationBookmarkRequest!) {\n  addPublicationBookmark(request: $request)\n}"): typeof import('./graphql').AddPublicationBookmarkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddPublicationNotInterested($request: PublicationNotInterestedRequest!) {\n  addPublicationNotInterested(request: $request)\n}"): typeof import('./graphql').AddPublicationNotInterestedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddReaction($request: ReactionRequest!) {\n  addReaction(request: $request)\n}"): typeof import('./graphql').AddReactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation HidePublication($request: HidePublicationRequest!) {\n  hidePublication(request: $request)\n}"): typeof import('./graphql').HidePublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLegacyCollectTypedData($options: TypedDataOptions, $request: LegacyCollectRequest!) {\n  createLegacyCollectTypedData(options: $options, request: $request) {\n    id\n    expiresAt\n    typedData {\n      types {\n        CollectLegacy {\n          name\n          type\n        }\n      }\n      domain {\n        name\n        chainId\n        version\n        verifyingContract\n      }\n      value {\n        nonce\n        deadline\n        publicationCollectedProfileId\n        publicationCollectedId\n        collectorProfileId\n        referrerProfileId\n        referrerPubId\n        collectModuleData\n      }\n    }\n  }\n}\n\nmutation LegacyCollect($request: LegacyCollectRequest!) {\n  legacyCollect(request: $request) {\n    ... on RelaySuccess {\n      txId\n    }\n    ... on LensProfileManagerRelayError {\n      reason\n    }\n  }\n}"): typeof import('./graphql').CreateLegacyCollectTypedDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemovePublicationBookmark($request: PublicationBookmarkRequest!) {\n  removePublicationBookmark(request: $request)\n}"): typeof import('./graphql').RemovePublicationBookmarkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveReaction($request: ReactionRequest!) {\n  removeReaction(request: $request)\n}"): typeof import('./graphql').RemoveReactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ReportProfile($request: ReportProfileRequest!) {\n  reportProfile(request: $request)\n}"): typeof import('./graphql').ReportProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ReportPublication($request: ReportPublicationRequest!) {\n  reportPublication(request: $request)\n}"): typeof import('./graphql').ReportPublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UndoPublicationNotInterested($request: PublicationNotInterestedRequest!) {\n  undoPublicationNotInterested(request: $request)\n}"): typeof import('./graphql').UndoPublicationNotInterestedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ApprovedAuthentications($request: ApprovedAuthenticationRequest!) {\n  approvedAuthentications(request: $request) {\n    items {\n      authorizationId\n      browser\n      device\n      os\n      origin\n      expiresAt\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').ApprovedAuthenticationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ApprovedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {\n  approvedModuleAllowanceAmount(request: $request) {\n    allowance {\n      value\n      asset {\n        ...Erc20Fields\n      }\n      asFiat(request: {for: USD}) {\n        ...FiatAmountFields\n      }\n    }\n    moduleContract {\n      ...NetworkAddressFields\n    }\n    moduleName\n  }\n}"): typeof import('./graphql').ApprovedModuleAllowanceAmountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Challenge($request: ChallengeRequest!) {\n  challenge(request: $request) {\n    id\n    text\n  }\n}"): typeof import('./graphql').ChallengeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CurrentProfile($request: ProfileRequest!) {\n  profile(request: $request) {\n    ...ProfileFields\n  }\n  userSigNonces {\n    lensHubOnchainSigNonce\n  }\n}"): typeof import('./graphql').CurrentProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ExplorePublications($request: ExplorePublicationRequest!) {\n  explorePublications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').ExplorePublicationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FeedHighlights($request: FeedHighlightsRequest!) {\n  feedHighlights(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FeedHighlightsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Followers($request: FollowersRequest!) {\n  followers(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FollowersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Following($request: FollowingRequest!) {\n  following(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FollowingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GenerateLensAPIRelayAddress {\n  generateLensAPIRelayAddress\n}"): typeof import('./graphql').GenerateLensApiRelayAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GenerateModuleCurrencyApprovalData($request: GenerateModuleCurrencyApprovalDataRequest!) {\n  generateModuleCurrencyApprovalData(request: $request) {\n    to\n    from\n    data\n  }\n}"): typeof import('./graphql').GenerateModuleCurrencyApprovalDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query HandleToAddress($request: HandleToAddressRequest!) {\n  handleToAddress(request: $request)\n}"): typeof import('./graphql').HandleToAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query HasPublicationIndexed($request: PublicationRequest!) {\n  publication(request: $request) {\n    ... on Post {\n      id\n    }\n    ... on Comment {\n      id\n    }\n    ... on Mirror {\n      id\n    }\n    ... on Quote {\n      id\n    }\n  }\n}"): typeof import('./graphql').HasPublicationIndexedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query LatestNotificationId($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on ReactionNotification {\n        id\n      }\n      ... on CommentNotification {\n        id\n      }\n      ... on MirrorNotification {\n        id\n      }\n      ... on QuoteNotification {\n        id\n      }\n      ... on ActedNotification {\n        id\n      }\n      ... on FollowNotification {\n        id\n      }\n      ... on MentionNotification {\n        id\n      }\n    }\n  }\n}"): typeof import('./graphql').LatestNotificationIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query LensTransactionStatus($request: LensTransactionStatusRequest!) {\n  lensTransactionStatus(request: $request) {\n    status\n    txHash\n    reason\n    extraInfo\n  }\n}"): typeof import('./graphql').LensTransactionStatusDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ModuleMetadata($request: ModuleMetadataRequest!) {\n  moduleMetadata(request: $request) {\n    metadata {\n      attributes {\n        key\n        type\n        value\n      }\n      authors\n      description\n      initializeCalldataABI\n      initializeResultDataABI\n      name\n      processCalldataABI\n      title\n    }\n    moduleType\n    signlessApproved\n    sponsoredApproved\n    verified\n  }\n}"): typeof import('./graphql').ModuleMetadataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MutualFollowers($request: MutualFollowersRequest!) {\n  mutualFollowers(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').MutualFollowersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Notifications($request: NotificationRequest!) {\n  notifications(request: $request) {\n    items {\n      ... on ReactionNotification {\n        id\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n        reactions {\n          profile {\n            ...ProfileFields\n          }\n        }\n      }\n      ... on CommentNotification {\n        id\n        comment {\n          ...CommentFields\n        }\n      }\n      ... on MirrorNotification {\n        id\n        mirrors {\n          mirrorId\n          profile {\n            ...ProfileFields\n          }\n        }\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n      }\n      ... on QuoteNotification {\n        id\n        quote {\n          ...QuoteFields\n        }\n      }\n      ... on ActedNotification {\n        id\n        actions {\n          actedAt\n          by {\n            ...ProfileFields\n          }\n        }\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Mirror {\n            ...MirrorFields\n          }\n        }\n      }\n      ... on FollowNotification {\n        id\n        followers {\n          ...ProfileFields\n        }\n      }\n      ... on MentionNotification {\n        id\n        publication {\n          ... on Post {\n            ...PostFields\n          }\n          ... on Comment {\n            ...CommentFields\n          }\n          ... on Quote {\n            ...QuoteFields\n          }\n        }\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').NotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query OwnedHandles($request: OwnedHandlesRequest!) {\n  ownedHandles(request: $request) {\n    items {\n      id\n      linkedTo {\n        nftTokenId\n        contract {\n          address\n        }\n      }\n      fullHandle\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').OwnedHandlesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Profile($request: ProfileRequest!) {\n  profile(request: $request) {\n    ...ProfileFields\n  }\n}"): typeof import('./graphql').ProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Feed($request: FeedRequest!) {\n  feed(request: $request) {\n    items {\n      root {\n        ... on Post {\n          ...PostFields\n        }\n        ... on Comment {\n          ...CommentFields\n        }\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').FeedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProfileFollowModule($request: ProfileRequest!) {\n  profile(request: $request) {\n    followModule {\n      ...FollowModuleFields\n    }\n  }\n}"): typeof import('./graphql').ProfileFollowModuleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProfileInterestsOptions($request: ProfileRequest!) {\n  profileInterestsOptions\n  profile(request: $request) {\n    id\n    interests\n  }\n}"): typeof import('./graphql').ProfileInterestsOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProfileManagers($request: ProfileManagersRequest!) {\n  profileManagers(request: $request) {\n    items {\n      address\n      isLensManager\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').ProfileManagersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Profiles($request: ProfilesRequest!) {\n  profiles(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').ProfilesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ProfilesManaged($request: ProfilesManagedRequest!, $lastLoggedInProfileRequest: LastLoggedInProfileRequest!) {\n  profilesManaged(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n  lastLoggedInProfile(request: $lastLoggedInProfileRequest) {\n    ...ProfileFields\n  }\n}"): typeof import('./graphql').ProfilesManagedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Publication($request: PublicationRequest!) {\n  publication(request: $request) {\n    ... on Post {\n      ...PostFields\n    }\n    ... on Comment {\n      ...CommentFields\n    }\n    ... on Mirror {\n      ...MirrorFields\n    }\n    ... on Quote {\n      ...QuoteFields\n    }\n  }\n}"): typeof import('./graphql').PublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicationBookmarks($request: PublicationBookmarksRequest!) {\n  publicationBookmarks(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').PublicationBookmarksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Publications($request: PublicationsRequest!) {\n  publications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').PublicationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RevenueFromPublication($request: RevenueFromPublicationRequest!) {\n  revenueFromPublication(request: $request) {\n    publication {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Mirror {\n        ...MirrorFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    revenue {\n      total {\n        ...AmountFields\n      }\n    }\n  }\n}"): typeof import('./graphql').RevenueFromPublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RevenueFromPublications($request: RevenueFromPublicationsRequest!) {\n  revenueFromPublications(request: $request) {\n    items {\n      publication {\n        ... on Post {\n          ...PostFields\n        }\n        ... on Comment {\n          ...CommentFields\n        }\n        ... on Mirror {\n          ...MirrorFields\n        }\n        ... on Quote {\n          ...QuoteFields\n        }\n      }\n      revenue {\n        total {\n          ...AmountFields\n        }\n      }\n    }\n  }\n}"): typeof import('./graphql').RevenueFromPublicationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RevokeAuthentication($request: RevokeAuthenticationRequest!) {\n  revokeAuthentication(request: $request)\n}"): typeof import('./graphql').RevokeAuthenticationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchProfiles($request: ProfileSearchRequest!) {\n  searchProfiles(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').SearchProfilesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchPublications($request: PublicationSearchRequest!) {\n  searchPublications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n      }\n      ... on Comment {\n        ...CommentFields\n      }\n      ... on Quote {\n        ...QuoteFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').SearchPublicationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TxIdToTxHash($for: TxId!) {\n  txIdToTxHash(for: $for)\n}"): typeof import('./graphql').TxIdToTxHashDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query WhoActedOnPublication($request: WhoActedOnPublicationRequest!) {\n  whoActedOnPublication(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').WhoActedOnPublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query WhoHaveBlocked($request: WhoHaveBlockedRequest!) {\n  whoHaveBlocked(request: $request) {\n    items {\n      ...ProfileFields\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').WhoHaveBlockedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query WhoReactedPublication($request: WhoReactedPublicationRequest!) {\n  whoReactedPublication(request: $request) {\n    items {\n      profile {\n        ...ProfileFields\n      }\n    }\n    pageInfo {\n      next\n    }\n  }\n}"): typeof import('./graphql').WhoReactedPublicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription AuthorizationRecordRevokedSubscription($authorizationId: UUID!) {\n  authorizationRecordRevoked(authorizationId: $authorizationId)\n}"): typeof import('./graphql').AuthorizationRecordRevokedSubscriptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription NewNotificationSubscription($for: ProfileId!) {\n  newNotification(for: $for) {\n    ... on ReactionNotification {\n      id\n    }\n    ... on CommentNotification {\n      id\n    }\n    ... on MirrorNotification {\n      id\n    }\n    ... on QuoteNotification {\n      id\n    }\n    ... on ActedNotification {\n      id\n    }\n    ... on FollowNotification {\n      id\n    }\n    ... on MentionNotification {\n      id\n    }\n  }\n}"): typeof import('./graphql').NewNotificationSubscriptionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription UserSigNoncesSubscription($address: EvmAddress!) {\n  userSigNonces(address: $address) {\n    lensHubOnchainSigNonce\n  }\n}"): typeof import('./graphql').UserSigNoncesSubscriptionDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
