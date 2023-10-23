import { LENSPROTOCOL_HANDLE } from '@tape.xyz/constants'

export const trimLensHandle = (handle: string) => {
  if (!handle) {
    return handle
  }

  if (handle.toLowerCase() === LENSPROTOCOL_HANDLE) {
    return handle
  }

  return handle
    .replace('.lens', '')
    .replace('.test', '')
    .replace('test/@', '')
    .replace('lens/@', '')
    .replace('.eth', '')
}
