import { LocalStore } from '@dragverse/lens/custom-types'
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'

const getFingerprint = async () => {
  const fingerprint = await getCurrentBrowserFingerPrint()
  return fingerprint
}

export const setFingerprint = async () => {
  const storedFingerprint = localStorage.getItem(LocalStore.TAPE_FINGERPRINT)
  if (!storedFingerprint) {
    const fingerprint = await getFingerprint()
    if (fingerprint) {
      localStorage.setItem(LocalStore.TAPE_FINGERPRINT, fingerprint)
    }
  }
}
