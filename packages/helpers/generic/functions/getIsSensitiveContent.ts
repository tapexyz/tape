import type { PublicationMetadata } from '@tape.xyz/lens'

import { SENSITIVE_CONTENT } from '@tape.xyz/constants'

export const getIsSensitiveContent = (
  metadata: null | PublicationMetadata,
  videoId: string
): boolean => {
  return (
    Boolean(metadata?.attributes?.find((el) => el.value === 'sensitive')) ||
    SENSITIVE_CONTENT.includes(videoId) ||
    Boolean(metadata?.contentWarning)
  )
}
