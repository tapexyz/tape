import { IS_MAINNET } from '@utils/constants'

export const VERIFIED_CHANNELS = IS_MAINNET
  ? ['0x2d']
  : ['0x2f', '0x03c7', '0x3675']
