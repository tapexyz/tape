import { IS_MAINNET } from '@lenstube/constants'

export const getLensHandle = (handle: string) => {
  if (!handle) {
    return handle
  }
  const name = handle.replace('.lens', '').replace('.test', '')
  return `${name}.${IS_MAINNET ? 'lens' : 'test'}`
}
