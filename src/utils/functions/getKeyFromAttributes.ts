import { Attribute } from 'src/types'

export const getKeyFromAttributes = (attributes: Attribute[], key: string) => {
  return attributes?.find((el) => el.key === key)?.value
}
