import { IS_MAINNET } from '@utils/constants'

export const getHandle = (handle: string) => {
  return `${handle}.${IS_MAINNET ? '.lens' : '.test'}`
}
