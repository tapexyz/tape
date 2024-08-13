import { TAPE_ADMIN_ADDRESS } from '@tape.xyz/constants'
import type {
  ApprovedAllowanceAmountResult,
  OpenActionModuleInput,
  RecipientDataInput
} from '@tape.xyz/lens'
import { OpenActionModuleType } from '@tape.xyz/lens'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'

import { VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS } from '@/components/Watch/OpenActions/verified-contracts'

import { getUTCDateAfterDays } from './formatTime'

const PLATFORM_FEE = 5
const RECIPIENT_SHARE = 100 - PLATFORM_FEE

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
    collectLimitEnabled,
    multiRecipients
  } = selectedCollectModule

  const recipients = multiRecipients?.length
    ? multiRecipients
    : [{ recipient, split: 100 }]

  let totalSplitPercentage = 0

  const updatedRecipients = recipients?.map((split) => {
    let revisedSplitPercentage = Math.floor(
      split.split * (RECIPIENT_SHARE / 100)
    )
    totalSplitPercentage += revisedSplitPercentage
    return {
      recipient: split.recipient,
      split: revisedSplitPercentage
    }
  })

  if (updatedRecipients?.length) {
    let adjustments = 0
    updatedRecipients.forEach((recipient) => {
      if (
        // Check if the recipient has a split of 0
        recipient.split === 0 &&
        // Check if the total split percentage is less than 100
        RECIPIENT_SHARE - totalSplitPercentage > 0
      ) {
        recipient.split++
        adjustments++
      }
    })
    // Adjust the first recipient's split to ensure total is 100%
    updatedRecipients[0].split +=
      RECIPIENT_SHARE - totalSplitPercentage - adjustments
  }

  // Add the admin fee split
  updatedRecipients?.push({
    recipient: TAPE_ADMIN_ADDRESS,
    split: PLATFORM_FEE
  })

  // No one can collect the post
  if (selectedCollectModule.isRevertCollect) {
    return {
      collectOpenAction: null
    }
  }

  const baseCollectModuleParams = {
    followerOnly: followerOnlyCollect || false,
    ...(collectLimitEnabled && {
      collectLimit
    }),
    ...(timeLimitEnabled && {
      endsAt: getUTCDateAfterDays(Number(timeLimit))
    })
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
          recipients: updatedRecipients as RecipientDataInput[]
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

export const getCollectModuleConfig = (
  module: ApprovedAllowanceAmountResult
) => {
  switch (module.moduleName) {
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
    case OpenActionModuleType.UnknownOpenActionModule:
      switch (module.moduleContract.address) {
        case VERIFIED_UNKNOWN_OPEN_ACTION_CONTRACTS.TIP:
          return {
            type: 'unknownOpenActionModule',
            label: 'Tip Action',
            description: 'Allow users to tip with supported currencies.'
          }
        default:
          return {
            type: 'openActionModule',
            label: 'Unknown Action',
            description: module.moduleContract.address
          }
      }
    case 'FeeFollowModule':
      return {
        type: 'followModule',
        label: 'Subscribe Profiles',
        description:
          'Subscribe any profile by paying a fee specified by the profile.'
      }
    default:
      return {
        type: '',
        description: ''
      }
  }
}
