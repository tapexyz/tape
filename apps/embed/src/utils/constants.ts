export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'
export const API_URL = IS_MAINNET
  ? 'https://api.lens.dev'
  : 'https://api-mumbai.lens.dev'

export const LENSTUBE_URL = IS_MAINNET
  ? 'https://lenstube.xyz'
  : 'https://testnet.lenstube.xyz'
export const EMBED_URL = IS_MAINNET
  ? 'https://embed.lenstube.xyz'
  : 'https://test-embed.lenstube.xyz'
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
export const MIXPANEL_API_HOST = '/collect'

export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/'
export const STATIC_ASSETS = 'https://assets.lenstube.xyz'
export const APP_NAME = 'Lenstube'

export const LENSTUBE_APP_ID = 'lenstube'
export const LENSTUBE_BYTE_APP_ID = 'lenstube-bytes'

export const LENSTUBE_TWITTER_HANDLE = 'lenstubexyz'
