import { IS_MAINNET } from '../constants'

const getLensHandle = (handle: string) => {
  const name = handle.replace('.lens', '').replace('.test', '')
  return `${name}.${IS_MAINNET ? 'lens' : 'test'}`
}

export default getLensHandle
