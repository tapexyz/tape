import { IS_MAINNET } from '../general'
import { AVARA_MEMBERS } from './avara'
import { CREATORS } from './creators'

export const CORE_MEMBERS = IS_MAINNET ? ['0x2d'] : ['0x0256']

export const VERIFIED_CHANNELS = [
  ...CREATORS,
  ...AVARA_MEMBERS,
  ...CORE_MEMBERS
]
