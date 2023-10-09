import { type OpenActionModule } from '@tape.xyz/lens'

export const getCollectModuleOutput = (openActionModule: OpenActionModule) => {
  const output = {
    collectLimit: 0,
    amount: {
      rate: '',
      value: ''
    },
    recipient: '',
    referralFee: 0,
    endsAt: '',
    followerOnly: false
  }
  switch (openActionModule.__typename) {
    case 'SimpleCollectOpenActionSettings':
      return {
        ...output,
        collectLimit: openActionModule.collectLimit,
        amount: {
          value: openActionModule.amount?.value,
          rate: openActionModule.amount?.rate?.value
        },
        recipient: openActionModule.recipient,
        referralFee: openActionModule.referralFee,
        endsAt: openActionModule.endsAt,
        followerOnly: openActionModule.followerOnly
      }

    default:
      break
  }
}
