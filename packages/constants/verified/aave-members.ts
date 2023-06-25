import { IS_MAINNET } from '../general'

export const AAVE_MEMBERS = IS_MAINNET
  ? [
      '0x05', // stani.lens
      '0x0d', // yoginth.lens
      '0x28a2', // nader.lens
      '0x24', // bradorbradley.lens
      '0x03', // aavegrants.lens
      '0x01' // lensprotocol
    ]
  : []
