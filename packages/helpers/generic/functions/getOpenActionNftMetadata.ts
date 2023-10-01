import { COMMON_REGEX } from '@lenstube/constants'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'

const knownSites = ['zora.co', 'testnet.zora.co']

const ZORA_REGEX = COMMON_REGEX.ZORA

const getZoraNFT = (url: string): BasicNftMetadata | null => {
  const matches = ZORA_REGEX.exec(url)
  if (ZORA_REGEX.test(url) && matches && matches.length >= 3) {
    const chain = matches[1]
    const address = matches[2]
    const token = matches[4]

    return { chain, address, token, provider: 'zora' }
  }

  return null
}

export const getOpenActionNftMetadata = (
  urls: string[]
): BasicNftMetadata | null => {
  if (!urls.length) {
    return null
  }

  const knownUrls = urls.filter((url) => {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace('www.', '')
    return knownSites.includes(hostname)
  })

  if (!knownUrls.length) {
    return null
  }

  const url = knownUrls[0]
  const hostname = new URL(url).hostname.replace('www.', '')

  switch (hostname) {
    case 'zora.co':
    case 'testnet.zora.co':
      return getZoraNFT(url)
    default:
      return null
  }
}
