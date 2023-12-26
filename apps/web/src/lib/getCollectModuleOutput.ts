import { type OpenActionModule } from '@tape.xyz/lens'

export const getCollectModuleOutput = (openActionModule: OpenActionModule) => {
  const output = {
    amount: {
      assetAddress: '',
      assetDecimals: '',
      assetSymbol: '',
      rate: '',
      value: ''
    },
    collectLimit: 0,
    endsAt: '',
    followerOnly: false,
    recipient: '',
    recipients: [],
    referralFee: 0
  }
  switch (openActionModule.__typename) {
    case 'SimpleCollectOpenActionSettings':
    case 'LegacySimpleCollectModuleSettings':
      return {
        ...output,
        amount: {
          assetAddress: openActionModule.amount?.asset.contract.address,
          assetDecimals: openActionModule.amount?.asset.decimals,
          assetSymbol: openActionModule.amount?.asset.symbol,
          rate: openActionModule.amount?.rate?.value,
          value: openActionModule.amount?.value
        },
        collectLimit: openActionModule.collectLimit,
        endsAt: openActionModule.endsAt,
        followerOnly: openActionModule.followerOnly,
        recipient: openActionModule.recipient,
        referralFee: openActionModule.referralFee
      }
    case 'MultirecipientFeeCollectOpenActionSettings':
    case 'LegacyMultirecipientFeeCollectModuleSettings':
      return {
        ...output,
        amount: {
          assetAddress: openActionModule.amount?.asset.contract.address,
          assetDecimals: openActionModule.amount?.asset.decimals,
          assetSymbol: openActionModule.amount?.asset.symbol,
          rate: openActionModule.amount?.rate?.value ?? 0,
          value: openActionModule.amount?.value
        },
        collectLimit: openActionModule.collectLimit,
        endsAt: openActionModule.endsAt,
        followerOnly: openActionModule.followerOnly,
        recipients: openActionModule.recipients,
        referralFee: openActionModule.referralFee
      }
    default:
      break
  }
}
