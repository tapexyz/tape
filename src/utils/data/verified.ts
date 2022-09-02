import { IS_MAINNET } from '@utils/constants'

export const VERIFIED_CHANNELS = IS_MAINNET
  ? [
      '0xb493', // niftycomedians.lens
      '0x0ce1', // levychain.lens
      '0xce63', // ethcatherders.lens
      '0x8dec', // thisisvoya.lens
      '0x2e09', // defidad.lens
      '0x8b61', // bankless.lens
      '0x1c19', // gabriel.lens
      '0x0160', // ethglobal.lens
      '0x9797', // ethdubai.lens
      '0x24', // bradorbradley.lens
      '0x2d' // sasicodes.lens
    ]
  : ['0x2f', '0x3675']
