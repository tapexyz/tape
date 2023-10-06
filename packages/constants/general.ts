import { CustomFiltersTypes } from '@tape.xyz/lens'

export const TAPE_APP_NAME = 'Tape'
export const TAPE_APP_DESCRIPTION = 'Talk, Amplify, Post, Explore'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const IS_STAGING = LENS_ENV === 'staging'
export const IS_SANDBOX = LENS_ENV === 'sandbox'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const STATIC_ASSETS = 'https://static.tape.xyz'
export const TAPE_WEBSITE_URL = IS_MAINNET
  ? 'https://tape.xyz'
  : 'https://testnet.tape.xyz'
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/brand/fallback.png`
export const OG_IMAGE = `${STATIC_ASSETS}/brand/og.png`
export const SCROLL_ROOT_MARGIN = '60% 0px'
export const LENS_IMAGEKIT_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot'

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: 'tr:w-60,h-60',
  AVATAR_LG: 'tr:w-300,h-300',
  THUMBNAIL: 'tr:w-720,h-404',
  THUMBNAIL_V: 'tr:w-404,h-720',
  SQUARE: 'tr:w-200,h-200'
}

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const STAGING_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const LENS_API_URL = IS_MAINNET
  ? MAINNET_API_URL
  : IS_STAGING
  ? STAGING_API_URL
  : TESTNET_API_URL

// API urls
export const TAPE_MAINNET_API_URL = 'https://api.tape.xyz'
export const TAPE_TESTNET_API_URL = 'https://api-testnet.tape.xyz'
export const TAPE_EMBED_URL = IS_MAINNET
  ? 'https://embed.tape.xyz'
  : 'https://embed-testnet.tape.xyz'
export const TAPE_DEV_API_URL = 'http://localhost:4002'
export const TAPE_API_URL = IS_MAINNET
  ? TAPE_MAINNET_API_URL
  : TAPE_TESTNET_API_URL

// contracts
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const LENS_PERIPHERY_ADDRESS = IS_MAINNET
  ? '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8'
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const OLD_LENS_RELAYER_ADDRESS =
  '0xD1FecCF6881970105dfb2b654054174007f0e07E'

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
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 10000 : 100 // in MB
export const IPFS_GATEWAY_URL =
  'https://39454ef77cea81df61b54eafc2816cd7.ipfscdn.io/ipfs'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'

// walletconnect
export const WC_PROJECT_ID = 'bf790b6b57570b99567abd1677b7415d'

// livepeer
export const LIVEPEER_STUDIO_API_KEY = ''

// workers
export const WORKER_LIVEPEER_VIEWS_URL = 'https://views.tape.xyz'
export const WORKER_IRYS_METADATA_UPLOAD_URL = 'https://metadata.tape.xyz'
export const WORKER_LOGTAIL_INGEST_URL = 'https://tail.tape.xyz'
export const WORKER_STS_TOKEN_URL = 'https://sts.tape.xyz'
export const WORKER_HEALTH_URL = 'https://health.tape.xyz'
export const WORKER_RECS_URL = 'https://recs.tape.xyz'
export const WORKER_NFTS_URL = 'https://nfts.tape.xyz'
export const WORKER_DID_URL = 'https://did.tape.xyz'
export const WORKER_LIVE_URL = 'https://live.lenstube.xyz'

export const SB_STORAGE_URL =
  'https://hdpmuwmctxbkykamcvpl.supabase.co/storage/v1/object/public/waves'

// irys
export const IRYS_NODE_URL = IS_MAINNET
  ? 'https://node1.irys.xyz'
  : 'https://devnet.irys.xyz'
export const IRYS_CURRENCY = 'matic'
export const ARWEAVE_GATEWAY_URL = 'https://arweave.net'
export const IRYS_CONNECT_MESSAGE = 'Estimating video upload cost...'
export const REQUESTING_SIGNATURE_MESSAGE = 'Requesting signature...'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'

// App Ids
export const TAPE_APP_ID = 'tape'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'
export const ALLOWED_APP_IDS = [
  'lenster',
  'lenstube',
  'orb',
  'hey',
  'buttrfly',
  'lensplay',
  'diversehq'
]

// official
export const TAPE_X_HANDLE = 'tapexyz'
export const TAPE_GITHUB_HANDLE = 'tapexyz'
export const TAPE_LOGO = `${STATIC_ASSETS}/brand/logo.svg`
export const TAPE_STATUS_PAGE = 'https://status.tape.xyz'
export const TAPE_ROADMAP_URL = 'https://roadmap.tape.xyz'

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x2f']
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS, '0x24'] : ['0x2f']
export const TAPE_ADMIN_ADDRESS = '0xB89560D7b33ea8d787EaaEfbcE1268f8991Db9E1'

// lens
export const LENS_CUSTOM_FILTERS = [CustomFiltersTypes.Gardeners]
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/quicktime',
  'video/mov'
]

// i18n
export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  zh: 'Chinese'
}
export const DEFAULT_LOCALE = 'en'
export const LENSPROTOCOL_HANDLE = 'lensprotocol'
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test'

// other apps
export const HEY_WEBSITE_URL = IS_MAINNET
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz'

// analytics
export const MIXPANEL_API_HOST = '/collect'
export const MIXPANEL_TOKEN = '928986a6551f5a12132e63c8bdd4451e'
export const MUX_DATA_KEY = '2h11sq1qeahiaejrjegjti847'

// vercel
export const GIT_DEPLOYED_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
export const GIT_DEPLOYED_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
export const VERCEL_DEPLOYED_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV

// misc
export const ALLOWED_HEX_CHARACTERS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
]

// open actions
export const ZORA_MAINNET_CHAINS = ['eth', 'oeth', 'base', 'zora']
