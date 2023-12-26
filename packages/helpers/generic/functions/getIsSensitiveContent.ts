import { SENSITIVE_CONTENT } from '@tape.xyz/constants'
import type { PublicationMetadata } from '@tape.xyz/lens'

export const getIsSensitiveContent = (
  metadata: PublicationMetadata | null,
  videoId: string
): boolean => {
  return (
    Boolean(metadata?.attributes?.find((el) => el.value === 'sensitive')) ||
    SENSITIVE_CONTENT.includes(videoId) ||
    Boolean(metadata?.contentWarning)
  )
}
