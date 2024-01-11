import {
  type OpenActionModuleInput,
  OpenActionModuleType,
  type RecipientDataInput
} from '@tape.xyz/lens'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'

import { getAddedDaysFromToday } from './formatTime'

export const getCollectModuleInput = (
  selectedCollectModule: CollectModuleType
): OpenActionModuleInput => {
  const {
    amount,
    referralFee,
    collectLimit,
    followerOnlyCollect,
    recipient,
    timeLimitEnabled,
    timeLimit = 1,
    isFeeCollect,
    isMultiRecipientFeeCollect,
    collectLimitEnabled
  } = selectedCollectModule

  // No one can collect the post
  if (selectedCollectModule.isRevertCollect) {
    return {
      collectOpenAction: null
    }
  }

  const baseCollectModuleParams = {
    collectLimit: collectLimitEnabled ? collectLimit : undefined,
    followerOnly: followerOnlyCollect || false,
    endsAt: timeLimitEnabled
      ? getAddedDaysFromToday(Number(timeLimit))
      : undefined
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
      collectOpenAction: {
        simpleCollectOpenAction: {
          ...baseCollectModuleParams,
          ...(isFeeCollect && {
            ...baseAmountParams,
            recipient
          })
        }
      }
    }
  }

  // Multi collect / revenue split
  if (selectedCollectModule.isMultiRecipientFeeCollect) {
    return {
      collectOpenAction: {
        multirecipientCollectOpenAction: {
          ...baseAmountParams,
          ...baseCollectModuleParams,
          recipients:
            selectedCollectModule.multiRecipients as RecipientDataInput[]
        }
      }
    }
  }

  // Post is free to collect
  return {
    collectOpenAction: {
      simpleCollectOpenAction: {
        ...baseCollectModuleParams,
        ...(isFeeCollect && {
          ...baseAmountParams,
          recipient
        })
      }
    }
  }
}

export const getCollectModuleConfig = (collectModule: string) => {
  switch (collectModule) {
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return {
        type: 'openActionModule',
        label: 'Simple collects',
        description:
          'Collect any publication including paid collects, limited and timed free collects and more!'
      }
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        type: 'openActionModule',
        label: 'Multi recipient collects',
        description:
          'Collect any publication which splits collect revenue with multiple recipients.'
      }
    case OpenActionModuleType.LegacySimpleCollectModule:
      return {
        type: 'openActionModule',
        label: 'Legacy V1 - Simple collects',
        description:
          'Collect any publication including paid collects, limited and timed free collects and more!'
      }
    case OpenActionModuleType.LegacyMultirecipientFeeCollectModule:
      return {
        type: 'openActionModule',
        label: 'Legacy V1 - Multi recipient collects',
        description:
          'Collect any publication which splits collect revenue with multiple recipients.'
      }
    case 'FeeFollowModule':
      return {
        type: 'followModule',
        label: 'Subscribe Profiles',
        description:
          'Subscribe any profile by paying a fee specified by the profile owner.'
      }
    default:
      return {
        type: '',
        description: ''
      }
  }
}
