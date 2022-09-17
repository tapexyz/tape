import { CollectModuleParams } from 'src/types'
import { CollectModuleType } from 'src/types/local'

export const getCollectModule = (
  selectCollectModule: CollectModuleType
): CollectModuleParams => {
  // No one can collect the post
  if (selectCollectModule.isRevertCollect) {
    return {
      revertCollectModule: true
    }
  }
  // Should collect by paying fee (anyone/ only subs)
  if (
    selectCollectModule.isFeeCollect &&
    !selectCollectModule.isTimedFeeCollect &&
    !selectCollectModule.isLimitedFeeCollect &&
    !selectCollectModule.isLimitedTimeFeeCollect
  ) {
    return {
      feeCollectModule: {
        amount: {
          currency: selectCollectModule.amount?.currency,
          value: selectCollectModule.amount?.value as string
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee as number,
        followerOnly: selectCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Should collect with limited collects, unlimited time (anyone/ only subs)
  if (
    selectCollectModule.isLimitedFeeCollect &&
    !selectCollectModule.isLimitedTimeFeeCollect
  ) {
    return {
      limitedFeeCollectModule: {
        collectLimit: selectCollectModule.collectLimit as string,
        amount: {
          currency: selectCollectModule.amount?.currency,
          value: selectCollectModule.amount?.value as string
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee as number,
        followerOnly: selectCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Should collect with limited collects, withing 24hrs (anyone/ only subs)
  if (selectCollectModule.isLimitedTimeFeeCollect) {
    return {
      limitedTimedFeeCollectModule: {
        collectLimit: selectCollectModule.collectLimit as string,
        amount: {
          currency: selectCollectModule.amount?.currency,
          value: selectCollectModule.amount?.value as string
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee as number,
        followerOnly: selectCollectModule.followerOnlyCollect as boolean
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
          value: selectCollectModule.amount?.value as string
        },
        recipient: selectCollectModule.recipient,
        referralFee: selectCollectModule.referralFee as number,
        followerOnly: selectCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Post is free to collect
  return {
    freeCollectModule: {
      followerOnly: selectCollectModule.followerOnlyCollect as boolean
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
    case 'LimitedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication with the collect limit specified.'
      }
    case 'LimitedTimedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication with the time and collect limit specified.'
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
