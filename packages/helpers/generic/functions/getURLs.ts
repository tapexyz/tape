import { COMMON_REGEX } from '@tape.xyz/constants'

export const getURLs = (text: string): string[] => {
  if (!text) {
    return []
  }
  return text.match(COMMON_REGEX.URL) || []
}
