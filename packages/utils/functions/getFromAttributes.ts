import type { Attribute } from '@lenstube/lens'

// key available only profile metadata
export const getValueFromKeyInAttributes = (
  attributes: Attribute[] | null | undefined,
  key: string
) => {
  return attributes?.find((el) => el.key === key)?.value
}

export const getValueFromTraitType = (
  attributes: Attribute[] | null | undefined,
  traitType: string
) => {
  return attributes?.find((el) => el.traitType === traitType)?.value
}

export const checkValueInAttributes = (
  attributes: Attribute[],
  value: string
) => {
  return attributes?.find((el) => el.value === value)?.value
}
