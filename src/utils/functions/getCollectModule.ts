import { CollectModuleType } from 'src/types/local'

export const getCollectModule = (selectCollectModule: CollectModuleType) => {
  // No one can collect the post
  if (selectCollectModule.isRevertCollect) {
    return {
      revertCollectModule: true
    }
  }
  // Should collect by paying fee (anyone/ only subs)
  if (
    selectCollectModule.isFeeCollect &&
    !selectCollectModule.isTimedFeeCollect
  ) {
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
  // Should collect with limited mints, unlimited time (anyone/ only subs)
  if (selectCollectModule.isLimitedFeeCollect) {
    return {
      limitedFeeCollectModule: {
        collectLimit: selectCollectModule.collectLimit,
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
  // Should collect with limited mints, withing 24hrs (anyone/ only subs)
  if (selectCollectModule.isLimitedTimeFeeCollect) {
    return {
      limitedTimedFeeCollectModule: {
        collectLimit: selectCollectModule.collectLimit,
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
  if (
    selectCollectModule.isFeeCollect &&
    selectCollectModule.isTimedFeeCollect
  ) {
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

export const getCollectModuleConfig = (collectModule: string) => {
  switch (collectModule) {
    case 'FeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication by paying fees specified.'
      }
    case 'TimedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication within the time limit specified.'
      }
    case 'FeeFollowModule':
      return {
        type: 'followModule',
        description:
          'Allows you to join any channel by paying a fee specified by the channel owner.'
      }
    default:
      return {
        type: '',
        description: ''
      }
  }
}
