import { HANDLE_SUFFIX, LENSPROTOCOL_HANDLE } from '@lenstube/constants'

export const trimLensHandle = (handle: string, keepTld = false) => {
  if (!handle) {
    return handle
  }

  if (handle.toLowerCase() === LENSPROTOCOL_HANDLE) {
    return handle
  }

  if (keepTld) {
    return handle.match(HANDLE_SUFFIX)
      ? handle.split(HANDLE_SUFFIX)[0] + HANDLE_SUFFIX
      : handle + HANDLE_SUFFIX
  }

  return handle.replace('.lens', '').replace('.test', '')
}
