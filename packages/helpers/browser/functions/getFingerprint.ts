import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'

export const getFingerprint = async () => {
  const fingerprint = await getCurrentBrowserFingerPrint()
  return fingerprint
}
