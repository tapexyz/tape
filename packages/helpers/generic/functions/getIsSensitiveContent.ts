import { SENSITIVE_CONTENT } from '@lenstube/constants'
import type { PublicationMetadata } from '@lenstube/lens'

export const getIsSensitiveContent = (
  metadata: PublicationMetadata | null,
  videoId: string
): boolean => {
  return (
    Boolean(
      metadata?.marketplace?.attributes?.find((el) => el.value === 'sensitive')
    ) ||
    SENSITIVE_CONTENT.includes(videoId) ||
    Boolean(metadata?.contentWarning)
  )
}
