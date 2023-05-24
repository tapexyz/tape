import { IS_MAINNET } from '../../constants'
import { AAVE_MEMBERS } from './aave-members'
import { CREATORS } from './creators'

export const CORE_MEMBERS = IS_MAINNET ? ['0x01a821'] : ['0x7028'] // dragverse.lens

export const VERIFIED_CHANNELS = [...CREATORS, ...AAVE_MEMBERS, ...CORE_MEMBERS]
