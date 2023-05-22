import type { CollectModuleParams, RecipientDataInput } from 'lens'

import type { CollectModuleType } from '../custom-types'
import { getTimeAddedOneDay } from './formatTime'

export const getCollectModule = (
  selectedCollectModule: CollectModuleType
): CollectModuleParams => {
  const {
    amount,
    referralFee,
    collectLimit,
    followerOnlyCollect,
    recipient,
    timeLimitEnabled,
    isFeeCollect,
    isMultiRecipientFeeCollect
  } = selectedCollectModule

  // No one can collect the post
  if (selectedCollectModule.isRevertCollect) {
    return {
      revertCollectModule: true
    }
  }

  const collectLimitEnabled = Boolean(collectLimit)
  const baseCollectModuleParams = {
    collectLimit: collectLimitEnabled ? collectLimit : null,
    followerOnly: followerOnlyCollect as boolean,
    endTimestamp: timeLimitEnabled ? getTimeAddedOneDay() : null
  }
  const baseAmountParams = {
    amount: {
      currency: amount?.currency,
      value: amount?.value as string
    },
    referralFee: referralFee as number
  }

  if (selectedCollectModule.isSimpleCollect && !isMultiRecipientFeeCollect) {
    return {
      simpleCollectModule: {
        ...baseCollectModuleParams,
        ...(isFeeCollect && {
          fee: {
            ...baseAmountParams,
            recipient
          }
        })
      }
    }
  }

  // Multi collect / revenue split
  if (selectedCollectModule.isMultiRecipientFeeCollect) {
    return {
      multirecipientFeeCollectModule: {
        ...baseAmountParams,
        ...baseCollectModuleParams,
        recipients:
          selectedCollectModule.multiRecipients as RecipientDataInput[]
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
          'Allow you to collect any publication which splits collect revenue with multiple recipients.'
      }
    case 'AaveFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication which deposit its revenue to AAVE v3 pool.'
      }
    case 'SimpleCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication including paid collects, limited and timed free collects and more!'
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
