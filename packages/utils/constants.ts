import { CustomFiltersTypes } from 'lens'

export const LENSTUBE_APP_NAME = 'Lenstube'
export const LENSTUBE_APP_DESCRIPTION =
  'Lenstube is a decentralized video-sharing social media platform built with Lens protocol.'

export const IS_MAINNET = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet'
export const RELAYER_ENABLED =
  process.env.NEXT_PUBLIC_RELAYER_ENABLED === 'true'

export const STATIC_ASSETS = 'https://assets.lenstube.xyz'
export const LENSTUBE_WEBSITE_URL = IS_MAINNET
  ? 'https://lenstube.xyz'
  : 'https://testnet.lenstube.xyz'
export const LENSTUBE_EMBED_URL = IS_MAINNET
  ? 'https://embed.lenstube.xyz'
  : 'https://test-embed.lenstube.xyz'

// lens
export const API_URL = IS_MAINNET
  ? 'https://api.lens.dev'
  : 'https://api-mumbai.lens.dev'
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
export const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL as string
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001

// cdn
export const IMAGE_CDN_URL = IS_MAINNET
  ? 'https://ik.imagekit.io/lt'
  : 'https://ik.imagekit.io/lt/testnet'
export const VIDEO_CDN_URL = 'https://cdn.livepeer.com'

export const SCROLL_ROOT_MARGIN = '40% 0px'

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 1000 : 100
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'
export const EVER_ACCESS_KEY = process.env.EVER_ACCESS_KEY as string
export const EVER_ACCESS_SECRET = process.env.EVER_ACCESS_SECRET as string
export const NEXT_PUBLIC_EVER_BUCKET_NAME = process.env
  .NEXT_PUBLIC_EVER_BUCKET_NAME as string

// livepeer
export const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY as string

// bundlr
export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_METADATA_UPLOAD_URL = IS_MAINNET
  ? 'https://node2.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network'
export const ARWEAVE_WEBSITE_URL = 'https://arweave.net'
export const BUNDLR_PRIVATE_KEY = process.env.BUNDLR_PRIVATE_KEY as string
export const BUNDLR_CONNECT_MESSAGE = 'Sign to initialize & estimate upload...'

// error messages
export const ERROR_MESSAGE = 'Oops, something went something!'
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required'

// App Ids
export const LENSTUBE_APP_ID = 'lenstube'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'

// official
export const LENSTUBE_TWITTER_HANDLE = 'lenstubexyz'
export const LENSTUBE_GITHUB_HANDLE = 'lenstube-xyz'
export const LENSTUBE_STATUS_PAGE = 'https://status.lenstube.xyz'
export const TALLY_VERIFICATION_FORM_URL = 'https://tally.so/r/mY5e80'

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x2f']

// lens
export const LENS_CUSTOM_FILTERS = [CustomFiltersTypes.Gardeners]
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime'
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
export const LENSPORT_MARKETPLACE_URL = 'https://lensport.io'

// misc
export const GIT_DEPLOYED_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
export const GIT_DEPLOYED_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
export const VERCEL_DEPLOYED_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV
export const MIXPANEL_API_HOST = '/collect'
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

export const API_ORIGINS = [
  'https://lenstube.xyz',
  'https://testnet.lenstube.xyz',
  'https://stage.lenstube.xyz',
  'http://localhost:4783'
]
