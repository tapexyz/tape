import type { CollectModuleType } from '@tape.xyz/lens/custom-types'

import {
  type OpenActionModuleInput,
  OpenActionModuleType,
  type RecipientDataInput
} from '@tape.xyz/lens'

import { getAddedDaysFromToday } from './formatTime'

export const getCollectModuleInput = (
  selectedCollectModule: CollectModuleType
): OpenActionModuleInput => {
  const {
    amount,
    collectLimit,
    collectLimitEnabled,
    followerOnlyCollect,
    isFeeCollect,
    isMultiRecipientFeeCollect,
    recipient,
    referralFee,
    timeLimit = 1,
    timeLimitEnabled
  } = selectedCollectModule

  // No one can collect the post
  if (selectedCollectModule.isRevertCollect) {
    return {
      collectOpenAction: null
    }
  }

  const baseCollectModuleParams = {
    collectLimit: collectLimitEnabled ? collectLimit : undefined,
    endsAt: timeLimitEnabled
      ? getAddedDaysFromToday(Number(timeLimit))
      : undefined,
    followerOnly: followerOnlyCollect as boolean
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
        description:
          'Collect any publication including paid collects, limited and timed free collects and more!',
        label: 'Simple collects',
        type: 'openActionModule'
      }
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        description:
          'Collect any publication which splits collect revenue with multiple recipients.',
        label: 'Multi recipient collects',
        type: 'openActionModule'
      }
    case OpenActionModuleType.LegacySimpleCollectModule:
      return {
        description:
          'Collect any publication including paid collects, limited and timed free collects and more!',
        label: 'Legacy V1 - Simple collects',
        type: 'openActionModule'
      }
    case OpenActionModuleType.LegacyMultirecipientFeeCollectModule:
      return {
        description:
          'Collect any publication which splits collect revenue with multiple recipients.',
        label: 'Legacy V1 - Multi recipient collects',
        type: 'openActionModule'
      }
    case 'FeeFollowModule':
      return {
        description:
          'Subscribe any profile by paying a fee specified by the profile owner.',
        label: 'Subscribe Profiles',
        type: 'followModule'
      }
    default:
      return {
        description: '',
        type: ''
      }
  }
}
