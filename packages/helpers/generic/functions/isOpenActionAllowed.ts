import {
  type Maybe,
  type OpenActionModule,
  OpenActionModuleType
} from '@tape.xyz/lens'

const allowedTypes = [
  OpenActionModuleType.SimpleCollectOpenActionModule,
  OpenActionModuleType.MultirecipientFeeCollectOpenActionModule,
  OpenActionModuleType.LegacySimpleCollectModule,
  OpenActionModuleType.LegacyMultirecipientFeeCollectModule
]

const isOpenActionAllowed = (
  openActions?: Maybe<OpenActionModule[]>
): boolean => {
  if (!openActions?.length) {
    return false
  }

  return openActions.some((openAction) => {
    const { type } = openAction

    return allowedTypes.includes(type)
  })
}

export default isOpenActionAllowed
