import { CustomFiltersType } from '@tape.xyz/lens'

export const TAPE_APP_NAME = 'Tape'
export const TAPE_APP_DESCRIPTION = 'Talk, Amplify, Post, Explore'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const IS_SANDBOX = LENS_ENV === 'sandbox'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const STATIC_ASSETS = 'https://static.tape.xyz'
export const TAPE_WEBSITE_URL = IS_MAINNET
  ? 'https://tape.xyz'
  : 'https://testnet.tape.xyz'
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/brand/fallback.png`
export const OG_IMAGE = `${STATIC_ASSETS}/brand/og.png`
export const LENS_IMAGEKIT_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot'

// infinite scroll
export const INFINITE_SCROLL_ROOT_MARGIN = '500px'

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: 'tr:w-60,h-60',
  AVATAR_LG: 'tr:w-300,h-300',
  THUMBNAIL: 'tr:w-720,h-404',
  THUMBNAIL_V: 'tr:w-404,h-720',
  SQUARE: 'tr:w-200,h-200'
}

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-v2-mumbai.lens.dev'
export const STAGING_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const LENS_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL

// api urls
export const TAPE_MAINNET_API_URL = 'https://api.tape.xyz'
export const TAPE_TESTNET_API_URL = 'https://api-testnet.tape.xyz'
export const TAPE_EMBED_URL = IS_MAINNET
  ? 'https://embed.tape.xyz'
  : 'https://embed-testnet.tape.xyz'
export const TAPE_DEV_API_URL = 'http://localhost:4002'
export const TAPE_API_URL = IS_MAINNET
  ? TAPE_MAINNET_API_URL
  : TAPE_TESTNET_API_URL

// addresses
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0xC1E77eE73403B8a7478884915aA599932A677870'
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LENS_MANAGER_ADDRESS = '0x6C1e1bC39b13f9E0Af9424D76De899203F47755F'

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
export const IPFS_GATEWAY_URL = 'https://ipfs.4everland.io/ipfs'
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
export const WORKER_RECS_URL = 'https://recs.tape.xyz'
export const WORKER_NFTS_URL = 'https://nfts.tape.xyz'
export const WORKER_DID_URL = 'https://did.tape.xyz'
export const WORKER_LIVE_URL = 'https://live.tape.xyz'
export const WORKER_TOWER_URL = 'https://tower.tape.xyz'

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
export const SIGN_IN_REQUIRED = 'Login to continue'

// App Ids
export const TAPE_APP_ID = 'tape'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'
export const ALLOWED_APP_IDS = [
  'lenstube'
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
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x34']
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS, '0x24'] : ['0x2f']
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

export const LENSPROTOCOL_HANDLE = 'lensprotocol'
export const HANDLE_PREFIX = IS_MAINNET ? 'lens/' : 'test/'

// other apps
export const HEY_WEBSITE_URL = IS_MAINNET
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz'

// banners
export const SHOW_GITCOIN_BANNER = false
export const GITCOIN_LIVE_ROUND = 19

// vercel
export const GIT_DEPLOYED_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
export const GIT_DEPLOYED_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
export const VERCEL_DEPLOYED_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV

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
