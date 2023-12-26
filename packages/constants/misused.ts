export enum MisuseType {
  Hacked = 'Hacked',
  Impersonated = 'Impersonated',
  Phishing = 'Phishing',
  Scam = 'Scam',
  TrademarkViolation = 'Trademark violation'
}

export const MISUSED_CHANNELS: {
  description: null | string
  id: string
  type: MisuseType
}[] = [
  {
    description: null,
    // brian_armstrong.lens
    id: '0x700c',
    type: MisuseType.Impersonated
  },
  {
    description:
      'Original account owner has established a new profile: @lens/lufo',
    // lufoart.lens
    id: '0xd3a4',
    type: MisuseType.Impersonated
  },
  {
    description:
      'Original account owner has established a new profile: @lens/web3academy_',
    // web3academy.lens
    id: '0x661b',
    type: MisuseType.Impersonated
  },
  {
    description: 'Original account is @lens/xmtplabs.lens',
    // xmtp_.lens
    id: '0xc358',
    type: MisuseType.TrademarkViolation
  },
  {
    description: null,
    // safewallet.lens
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation
  }
]
