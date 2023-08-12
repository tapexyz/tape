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
  description: string | null
}[] = [
  {
    // brian_armstrong.lens
    id: '0x700c',
    type: MisuseType.Impersonated,
    description: null
  },
  {
    // lufoart.lens
    id: '0xd3a4',
    type: MisuseType.Impersonated,
    description:
      'Original account owner has established a new channel: @lufo.lens'
  },
  {
    // web3academy.lens
    id: '0x661b',
    type: MisuseType.Impersonated,
    description:
      'Original account owner has established a new channel: @web3academy_.lens'
  },
  {
    // xmtp_.lens
    id: '0xc358',
    type: MisuseType.TrademarkViolation,
    description: 'Original account is @xmtplabs.lens'
  },
  {
    // safewallet.lens
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation,
    description: null
  }
]
