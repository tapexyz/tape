import { IS_MAINNET } from './general'

// profile ids that are not sponsored for free ipfs uploads
export const UNSPONSORED_IPFS_UPLOADS = IS_MAINNET
  ? [
      '0x4aca',
      '0x015f95',
      '0x6e64',
      '0x79f2',
      '0x4e24',
      '0x79f2',
      '0x923a',
      '0x99',
      '0x9b5d',
      '0x9cb4',
      '0x9cb4',
      '0x8441',
      '0x9b5d',
      '0x0dc2',
      '0x9cb4'
    ]
  : []
