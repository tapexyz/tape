import { CollectModuleType } from 'src/types/local'

export const getCollectModule = (selectCollectModule: CollectModuleType) => {
  // No one can collect the post
  if (selectCollectModule.isRevertCollect) {
    return {
      revertCollectModule: true
    }
  }
  // Should collect by paying fee (anyone/ only subs)
  if (selectCollectModule.isFeeCollect) {
    return {
      feeCollectModule: {
        amount: {
          currency: selectCollectModule.amount?.currency,
          value: selectCollectModule.amount?.value
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee,
        followerOnly: selectCollectModule.followerOnlyCollect
      }
    }
  }
  // Should collect within 24 hrs (anyone/ only subs)
  if (selectCollectModule.isTimedFeeCollect) {
    return {
      timedFeeCollectModule: {
        amount: {
          currency: selectCollectModule.amount?.currency,
          value: selectCollectModule.amount?.value
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee,
        followerOnly: selectCollectModule.followerOnlyCollect
      }
    }
  }
  // Post is free to collect
  return {
    freeCollectModule: {
      followerOnly: selectCollectModule.followerOnlyCollect
    }
  }
}
