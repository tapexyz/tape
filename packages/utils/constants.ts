import { CustomFiltersTypes } from 'lens';

export const LENSTUBE_APP_NAME = 'Dragverse'
export const LENSTUBE_APP_DESCRIPTION =
  'Dragverse is a livestreaming and decentralized video-sharing social media platform built with Lens protocol and inspired by the Lenstube project.'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
// export const IS_MAINNET = LENS_ENV === 'mainnet'
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const IS_STAGING = LENS_ENV === 'staging'
export const IS_SANDBOX = LENS_ENV === 'sandbox'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const STATIC_ASSETS = 'https://dragverse.4everland.store'
export const LENSTUBE_WEBSITE_URL = IS_MAINNET
  ? 'https://dragverse.app' // TODO: change testnet to mainnet when ready
  : 'https://dragverse.app'
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/dragverse.svg`
export const BANNER_URL = `${STATIC_ASSETS}/dragverse-banner.png`
export const BASE_LIVESTREAM_VIDEO_URL = `${STATIC_ASSETS}/dragverse-base-live-video.mp4`
export const LENSTER_ICON_URL = `${STATIC_ASSETS}/lenster-logo.svg`
export const TWITTER_ICON_URL = `${STATIC_ASSETS}/twitter-logo.jpeg`
export const LINKEDIN_ICON_URL = `${STATIC_ASSETS}/linkedin-logo.png`
export const REDDIT_ICON_URL = `${STATIC_ASSETS}/reddit-logo.png`
export const DRAGVERSE_SPATIAL_URL =
  'https://www.spatial.io/s/Dragverse-6330ebb42e62cd0001922a97?share=6796815018867406198'
export const OG_IMAGE = `${FALLBACK_COVER_URL}`
export const IMAGE_CDN_URL = IS_MAINNET ? 'https://img.lenstube.xyz' : ''
export const SCROLL_ROOT_MARGIN = '40% 0px'

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const STAGING_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const LENS_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL

// API urls
export const LENSTUBE_MAINNET_API_URL = 'https://api.lenstube.xyz'
export const LENSTUBE_TESTNET_API_URL = 'https://api-testnet.lenstube.xyz'
export const LENSTUBE_EMBED_URL = IS_MAINNET
  ? 'https://embed.lenstube.xyz'
  : 'https://embed-testnet.lenstube.xyz'
export const LENSTUBE_DEV_API_URL = 'http://localhost:4002'
export const LENSTUBE_API_URL = IS_MAINNET
  ? LENSTUBE_MAINNET_API_URL
  : LENSTUBE_TESTNET_API_URL

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
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 2000 : 100
export const IPFS_GATEWAY_URL = 'https://gateway.ipfscdn.io/ipfs'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'

// livepeer
export const LIVEPEER_STUDIO_API_KEY = '60935d4a-46ae-40fe-b580-f306a8ad2e48'

// workers
export const LIVEPEER_VIEWS_URL = 'https://views.lenstube.xyz'
export const BUNDLR_METADATA_UPLOAD_URL = 'https://metadata.lenstube.xyz'
export const LENSTUBE_TAIL_INGEST_URL = 'https://tail.lenstube.xyz'
export const STS_TOKEN_URL = 'https://sts.lenstube.xyz'
export const HEALTH_URL = 'https://health.lenstube.xyz'

// bundlr
export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network'
export const ARWEAVE_GATEWAY_URL = 'https://arweave.net'
export const BUNDLR_CONNECT_MESSAGE = 'Estimating video upload cost...'
export const REQUESTING_SIGNATURE_MESSAGE = 'Requesting signature...'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required'

// App Ids
export const LENSTUBE_APP_ID = 'dragverse'
export const LENSTUBE_BYTES_APP_ID = 'dragverse-bytes'
export const ALLOWED_APP_IDS = ['orb', 'lenster', 'buttrfly']

// official
export const LENSTUBE_TWITTER_HANDLE = 'metadragverse'
export const LENSTUBE_GITHUB_HANDLE = 'dragverse'
export const LENSTUBE_DISCORD_INVITE_URL = 'https://discord.gg/TbjTTgTh'
export const LENSTUBE_STATUS_PAGE = 'https://status.dragverse.app'
export const TALLY_VERIFICATION_FORM_URL = 'https://tally.so/r/mY5e80'
export const LENSTUBE_ROADMAP_URL = 'https://dragverse.canny.io'
export const DRAGVERSE_TERMS_URL = 'https://dragverse.io/terms'
export const DRAGVERSE_PRIVACY_URL = 'https://www.dragverse.io/privacy-policy'

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x2f']
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS, '0x24'] : ['0x2f']
export const LENSTUBE_DONATION_ADDRESS =
  '0xB89560D7b33ea8d787EaaEfbcE1268f8991Db9E1'

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

// other apps
export const LENSTER_WEBSITE_URL = IS_MAINNET
  ? 'https://lenster.xyz'
  : 'https://testnet.lenster.xyz'
export const OPENSEA_MARKETPLACE_URL = IS_MAINNET
  ? 'https://opensea.io'
  : 'https://testnets.opensea.io'
export const RARIBLE_MARKETPLACE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://testnet.rarible.com'

// analytics
export const MIXPANEL_API_HOST = '/collect'
export const MIXPANEL_TOKEN = '928986a6551f5a12132e63c8bdd4451e'
export const MUX_DATA_KEY = '2h11sq1qeahiaejrjegjti847'

// vercel
export const GIT_DEPLOYED_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
export const GIT_DEPLOYED_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
export const VERCEL_DEPLOYED_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV
