import type { MetadataAttribute } from '@tape.xyz/lens'

// key available only profile metadata
export const getValueFromKeyInAttributes = (
  attributes: MetadataAttribute[] | null | undefined,
  key: string
) => {
  return attributes?.find((el) => el.key === key)?.value ?? ''
}

export const checkValueInAttributes = (
  attributes: MetadataAttribute[],
  value: string
) => {
  return attributes?.find((el) => el.value === value)?.value ?? ''
}
