import { Attribute } from 'src/types'

export const getKeyFromAttributes = (
  attributes: Attribute[] | null | undefined,
  key: string
) => {
  return attributes?.find((el) => el.key === key)?.value
}

export const checkValueInAttributes = (
  attributes: Attribute[],
  value: string
) => {
  return attributes?.find((el) => el.value === value)?.value
}
