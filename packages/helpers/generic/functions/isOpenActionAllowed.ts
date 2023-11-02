import type { Maybe, OpenActionModule } from '@tape.xyz/lens'

const allowedTypes = [
  'SimpleCollectOpenActionModule',
  'MultirecipientFeeCollectOpenActionModule'
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
