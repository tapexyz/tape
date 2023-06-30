import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getVisitorId = async () => {
  const fp = await FingerprintJS.load()
  const { visitorId } = await fp.get()
  return visitorId
}
