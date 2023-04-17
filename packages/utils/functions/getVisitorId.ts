import FingerprintJS from '@fingerprintjs/fingerprintjs'

const getVisitorId = async () => {
  const fp = await FingerprintJS.load()
  const { visitorId } = await fp.get()
  return visitorId
}

export default getVisitorId
