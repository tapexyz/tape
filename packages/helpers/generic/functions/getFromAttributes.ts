import type { MetadataAttribute } from '@dragverse/lens'

// key available only profile metadata
export const getValueFromKeyInAttributes = (
  attributes: MetadataAttribute[] | null | undefined,
  key: string
) => {
  return attributes?.find((el) => el.key === key)?.value ?? ''
}
