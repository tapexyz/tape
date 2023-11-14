import { IS_MAINNET } from '../general'

export const AAVE_MEMBERS = IS_MAINNET
  ? [
      '0x5c95', // 2irl4u
      '0x04', // letsraave
      '0x05', // stani
      '0x0d', // yoginth
      '0x28a2', // nader
      '0x24', // bradorbradley
      '0x03', // aavegrants
      '0x02', // aaveaave
      '0x01' // lensprotocol
    ]
  : []
