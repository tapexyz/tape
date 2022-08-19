import { IS_MAINNET } from '@utils/constants'

export const getHandle = (handle: string) => {
  const name = handle.replace('.lens', '').replace('.test', '')
  return `${name}.${IS_MAINNET ? 'lens' : 'test'}`
}
