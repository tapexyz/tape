import type {
  CollectModuleParams,
  MultirecipientFeeCollectModuleParams,
  RecipientDataInput
} from 'lens'

import type { CollectModuleType } from '../custom-types'
import { getTimeAddedOneDay } from './formatTime'

export const getCollectModule = (
  selectedCollectModule: CollectModuleType
): CollectModuleParams => {
  // No one can collect the post
  if (selectedCollectModule.isRevertCollect) {
    return {
      revertCollectModule: true
    }
  }
  // Multi collect / revenue split
  if (selectedCollectModule.isMultiRecipientFeeCollect) {
    let multirecipientFeeCollectModule: MultirecipientFeeCollectModuleParams = {
      amount: {
        currency: selectedCollectModule.amount?.currency,
        value: selectedCollectModule.amount?.value as string
      },
      recipients: selectedCollectModule.multiRecipients as RecipientDataInput[],
      referralFee: selectedCollectModule.referralFee as number,
      followerOnly: selectedCollectModule.followerOnlyCollect as boolean
    }
    if (
      selectedCollectModule.isLimitedTimeFeeCollect ||
      selectedCollectModule.isLimitedFeeCollect
    ) {
      multirecipientFeeCollectModule.collectLimit =
        selectedCollectModule.collectLimit as string
    }
    if (
      selectedCollectModule.isLimitedTimeFeeCollect ||
      selectedCollectModule.isTimedFeeCollect
    ) {
      multirecipientFeeCollectModule.endTimestamp = getTimeAddedOneDay()
    }
    return {
      multirecipientFeeCollectModule
    }
  }
  // Should collect by paying fee (anyone/ only subs)
  if (
    selectedCollectModule.isFeeCollect &&
    !selectedCollectModule.isTimedFeeCollect &&
    !selectedCollectModule.isLimitedFeeCollect &&
    !selectedCollectModule.isLimitedTimeFeeCollect
  ) {
    return {
      feeCollectModule: {
        amount: {
          currency: selectedCollectModule.amount?.currency,
          value: selectedCollectModule.amount?.value as string
        },
        recipient: selectedCollectModule.recipient,
        referralFee: selectedCollectModule.referralFee as number,
        followerOnly: selectedCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Should collect with limited collects, unlimited time (anyone/ only subs)
  if (
    selectedCollectModule.isLimitedFeeCollect &&
    !selectedCollectModule.isLimitedTimeFeeCollect
  ) {
    return {
      limitedFeeCollectModule: {
        collectLimit: selectedCollectModule.collectLimit as string,
        amount: {
          currency: selectedCollectModule.amount?.currency,
          value: selectedCollectModule.amount?.value as string
        },
        recipient: selectedCollectModule.recipient,
        referralFee: selectedCollectModule.referralFee as number,
        followerOnly: selectedCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Should collect with limited collects, within 24hrs (anyone/ only subs)
  if (selectedCollectModule.isLimitedTimeFeeCollect) {
    return {
      limitedTimedFeeCollectModule: {
        collectLimit: selectedCollectModule.collectLimit as string,
        amount: {
          currency: selectedCollectModule.amount?.currency,
          value: selectedCollectModule.amount?.value as string
        },
        recipient: selectedCollectModule.recipient,
        referralFee: selectedCollectModule.referralFee as number,
        followerOnly: selectedCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Should collect within 24 hrs (anyone/ only subs)
  if (
    selectedCollectModule.isFeeCollect &&
    selectedCollectModule.isTimedFeeCollect
  ) {
    return {
      timedFeeCollectModule: {
        amount: {
          currency: selectedCollectModule.amount?.currency,
          value: selectedCollectModule.amount?.value as string
        },
        recipient: selectedCollectModule.recipient,
        referralFee: selectedCollectModule.referralFee as number,
        followerOnly: selectedCollectModule.followerOnlyCollect as boolean
      }
    }
  }
  // Post is free to collect
  return {
    freeCollectModule: {
      followerOnly: selectedCollectModule.followerOnlyCollect as boolean
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
    case 'MultirecipientFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication which revenue split with multiple recipients.'
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
