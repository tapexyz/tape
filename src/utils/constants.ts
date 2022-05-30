export const IS_MAINNET = false
export const STATIC_ASSETS = 'https://assets.lenstube.xyz'

export const API_URL = IS_MAINNET
  ? 'https://api.lens.dev'
  : 'https://api-mumbai.lens.dev'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'

export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'

export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network/'
export const LENSTER_WEBSITE_URL = IS_MAINNET
  ? 'https://lenster.xyz'
  : 'https://testnet.lenster.xyz'

export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ERROR_MESSAGE = 'Oops, something went something!'

export const LENSTUBE_VIDEOS_APP_ID = 'lenstube-videos'
export const LENSTUBE_COMMENTS_APP_ID = 'lenstube-comments'
