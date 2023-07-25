export enum MisuseType {
  Scam = 'Scam',
  Impersonated = 'Impersonated',
  Hacked = 'Hacked',
  Phishing = 'Phishing',
  TrademarkViolation = 'Trademark violation'
}

export const MISUSED_CHANNELS: {
  id: string
  type: MisuseType
}[] = [
  {
    // web3academy
    id: '0x661b',
    type: MisuseType.Impersonated
  },
  {
    // xmtp_
    id: '0xc358',
    type: MisuseType.TrademarkViolation
  },
  {
    // safewallet
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation
  }
]
