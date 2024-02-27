import { CustomFiltersType } from '@tape.xyz/lens'
import LensEndpoint from '@tape.xyz/lens/endpoints'

export const TAPE_APP_NAME = 'Tape'
export const TAPE_APP_DESCRIPTION = 'Talk, Amplify, Post, Explore'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
export const IS_MAINNET = LENS_ENV === 'mainnet'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const STATIC_ASSETS = 'https://static.tape.xyz'
export const TAPE_WEBSITE_URL = IS_MAINNET
  ? 'https://tape.xyz'
  : 'https://testnet.tape.xyz'
export const FALLBACK_THUMBNAIL_URL = `${STATIC_ASSETS}/images/fallback-thumbnail.webp`
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/images/fallback-cover.svg`
export const OG_IMAGE = `${STATIC_ASSETS}/brand/og.png`
export const LENS_IMAGEKIT_SNAPSHOT_URL = 'https://ik.imagekit.io/lenstube'

// infinite scroll
export const INFINITE_SCROLL_ROOT_MARGIN = '800px'

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: 'tr:w-60,h-60',
  AVATAR_LG: 'tr:w-300,h-300',
  THUMBNAIL: 'tr:w-720,h-404',
  THUMBNAIL_V: 'tr:w-404,h-720',
  SQUARE: 'tr:w-200,h-200'
}

// lens
export const MAINNET_API_URL = LensEndpoint.Mainnet
export const TESTNET_API_URL = LensEndpoint.Staging
export const LENS_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL

// api urls
export const TAPE_EMBED_URL = IS_MAINNET
  ? 'https://embed.tape.xyz'
  : 'https://embed-testnet.tape.xyz'
export const TAPE_API_URL = IS_PRODUCTION
  ? 'https://api.tape.xyz'
  : 'http://localhost:4000'

// tape addresses
export const TAPE_SIGNUP_PROXY_ADDRESS = IS_MAINNET
  ? '0xD0f6d9676d36F5f4AF5765fCb78c388B51577327'
  : '0xb9F635c498CdC2dBf95B3A916b007fD16c5506ED'

// lens addresses
export const LENS_PERMISSIONLESS_CREATOR_ADDRESS = IS_MAINNET
  ? '0x0b5e6100243f793e480DE6088dE6bA70aA9f3872'
  : '0xCb4FB63c3f13CB83cCD6F10E9e5F29eC250329Cc'
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0xC1E77eE73403B8a7478884915aA599932A677870'
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TESTNET_ALLOWED_TOKENS = [
  {
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    decimals: 18,
    name: 'Wrapped Matic',
    symbol: 'WMATIC'
  },
  {
    address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    decimals: 18,
    name: 'DAI Stablecoin',
    symbol: 'DAI'
  },
  {
    address: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23',
    decimals: 18,
    name: 'USD Coin',
    symbol: 'USDC'
  }
]

// polygon
export const POLYGON_RPC_URL = IS_MAINNET
  ? 'https://rpc.ankr.com/polygon'
  : 'https://rpc.ankr.com/polygon_mumbai'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const ETHERSCAN_URL = IS_MAINNET
  ? 'https://etherscan.io'
  : 'https://goerli.etherscan.io'
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 6000 : 0 // in MB
export const IPFS_GATEWAY_URL = 'https://gw.ipfs-lens.dev/ipfs'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'

// walletconnect
export const WC_PROJECT_ID = 'bf790b6b57570b99567abd1677b7415d'
export const EXPLORER_RECOMMENDED_WALLET_IDS = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
  'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // zerion
  '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // rainbow
  'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a', // uniswap
  '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927' // ledger live
]

// livepeer
export const LIVEPEER_STUDIO_API_KEY = IS_PRODUCTION
  ? 'ade26a09-c774-4898-a269-883551f1c5df'
  : ''

// workers
export const WORKER_LIVEPEER_VIEWS_URL = `${TAPE_API_URL}/views`
export const WORKER_IRYS_METADATA_UPLOAD_URL = `${TAPE_API_URL}/metadata`
export const WORKER_LOGTAIL_INGEST_URL = `${TAPE_API_URL}/tail`
export const WORKER_STS_TOKEN_URL = `${TAPE_API_URL}/sts`
export const WORKER_RECS_URL = `${TAPE_API_URL}/recommendations`
export const WORKER_DID_URL = `${TAPE_API_URL}/did`
export const WORKER_TOWER_URL = `${TAPE_API_URL}/tower`
export const WORKER_OEMBED_URL = `${TAPE_API_URL}/oembed`
export const WORKER_VERIFIED_URL = `${TAPE_API_URL}/verified`
export const WORKER_TOGGLES_URL = `${TAPE_API_URL}/toggles`
export const WORKER_ALLOWED_TOKENS_URL = `${TAPE_API_URL}/allowed-tokens`

// irys
export const IRYS_NODE_URL = IS_MAINNET
  ? 'https://node1.irys.xyz'
  : 'https://devnet.irys.xyz'
export const IRYS_CURRENCY = 'matic'
export const ARWEAVE_GATEWAY_URL = 'https://gateway.irys.xyz'
export const IRYS_CONNECT_MESSAGE = 'Estimating video upload cost...'
export const REQUESTING_SIGNATURE_MESSAGE = 'Requesting signature...'
export const MOONPAY_URL = IS_MAINNET
  ? 'https://buy.moonpay.com'
  : 'https://buy-sandbox.moonpay.com'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED = 'Login to continue'

// App Ids
export const TAPE_APP_ID = 'tape'
export const LENSTUBE_APP_ID = 'lenstube'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'
export const ALLOWED_APP_IDS = [
  LENSTUBE_APP_ID
  // 'lenster',
  // 'orb',
  // 'hey',
  // 'buttrfly',
  // 'lensplay',
  // 'diversehq'
]

// official
export const TAPE_X_HANDLE = 'tapexyz'
export const TAPE_GITHUB_HANDLE = 'tapexyz'
export const TAPE_LOGO = `${STATIC_ASSETS}/brand/logo.svg`
export const TAPE_STATUS_PAGE = 'https://status.tape.xyz'
export const TAPE_FEEDBACK_URL = 'https://feedback.tape.xyz'

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : []
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS] : []
export const TAPE_ADMIN_ADDRESS = '0xB89560D7b33ea8d787EaaEfbcE1268f8991Db9E1'

// lens
export const LENS_CUSTOM_FILTERS = [CustomFiltersType.Gardeners]
export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/quicktime',
  'video/mov'
]
export const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/mp3',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/vnd.wave',
  'audio/webm'
]
export const ALLOWED_UPLOAD_MIME_TYPES = [
  ...ALLOWED_AUDIO_MIME_TYPES,
  ...ALLOWED_VIDEO_MIME_TYPES
]

export const LENS_NAMESPACE_PREFIX = IS_MAINNET ? 'lens/' : 'test/'
export const LEGACY_LENS_HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test'

// other apps
export const HEY_WEBSITE_URL = IS_MAINNET
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz'

// banners
export const SHOW_GITCOIN_BANNER = false
export const GITCOIN_LIVE_ROUND = 20

// open actions
export const ZORA_MAINNET_CHAINS = ['eth', 'oeth', 'base', 'zora']
export const FEATURED_ZORA_COLLECTS = [
  'https://zora.co/collect/zora:0x4e18d1be29f54d6c11935939e36c9988897c145e',
  'https://zora.co/collect/eth:0x5ec5a9b979a7fd4835a7ce9bdf3090209ec0fc8a/1',
  'https://zora.co/collect/eth:0x0bc2a24ce568dad89691116d5b34deb6c203f342/193',
  'https://zora.co/collect/eth:0x7ad18982781ae3d68d1c964f61b872fb2f899021',
  'https://zora.co/collect/zora:0xc8b408c889baeed2704168de3b3b8795158ca187',
  'https://zora.co/collect/zora:0xd4889d519b1ab9b2fa8634e0271118de480f6d32',
  'https://zora.co/collect/zora:0xab821ed94191628354078bcbb206512914eb42e1'
]
