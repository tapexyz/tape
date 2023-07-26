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
    // lufoart.lens
    id: '0xd3a4',
    type: MisuseType.Impersonated
  },
  {
    // web3academy.lens
    id: '0x661b',
    type: MisuseType.Impersonated
  },
  {
    // xmtp_.lens
    id: '0xc358',
    type: MisuseType.TrademarkViolation
  },
  {
    // safewallet.lens
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation
  }
]
