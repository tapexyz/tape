import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'
import { LocalStore } from '@tape.xyz/lens/custom-types'

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
