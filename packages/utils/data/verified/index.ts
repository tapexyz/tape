import { IS_MAINNET } from '../../constants'
import { AAVE_MEMBERS } from './aave-members'
import { CREATORS } from './creators'

export const CORE_MEMBERS = IS_MAINNET ? ['0x2d', '0xc001'] : ['0x2f'] // sasicodes

export const VERIFIED_CHANNELS = [...CREATORS, ...AAVE_MEMBERS, ...CORE_MEMBERS]
