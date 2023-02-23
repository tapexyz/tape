import { CustomFiltersTypes } from 'lens'

export const LENSTUBE_APP_NAME = 'Lenstube'
export const LENSTUBE_APP_DESCRIPTION =
  'Lenstube is a decentralized video-sharing social media platform built with Lens protocol.'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'mainnet'
export const IS_MAINNET = LENS_ENV === 'mainnet'

export const STATIC_ASSETS = 'https://static.lenstube.xyz'
export const LENSTUBE_WEBSITE_URL = IS_MAINNET
  ? 'https://lenstube.xyz'
  : 'https://testnet.lenstube.xyz'
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/images/fallbackThumbnail.png`
export const OG_IMAGE = `${STATIC_ASSETS}/images/seo/og.png`
export const IMAGE_CDN_URL = IS_MAINNET ? 'https://img.lenstube.xyz' : ''
export const SCROLL_ROOT_MARGIN = '40% 0px'

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const STAGING_MAINNET_API_URL =
  'https://staging-api-social-polygon.lens.crtlkey.com'
export const STAGING_TESTNET_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const STAGING_API_URL = IS_MAINNET
  ? STAGING_MAINNET_API_URL
  : STAGING_TESTNET_API_URL
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
export const LIVEPEER_STUDIO_API_KEY = 'b13fd43e-d0d6-4abc-a5df-93592a0c5124'

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
export const BUNDLR_CONNECT_MESSAGE = 'Sign to initialize & estimate upload...'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required'

// App Ids
export const LENSTUBE_APP_ID = 'lenstube'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'
export const ALLOWED_APP_IDS = ['orb']

// official
export const LENSTUBE_TWITTER_HANDLE = 'lenstubexyz'
export const LENSTUBE_GITHUB_HANDLE = 'lenstube-xyz'
export const LENSTUBE_STATUS_PAGE = 'https://status.lenstube.xyz'
export const TALLY_VERIFICATION_FORM_URL = 'https://tally.so/r/mY5e80'
export const LENSTUBE_ROADMAP_URL = 'https://roadmap.lenstube.xyz'

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
