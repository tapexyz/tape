import { SENSITIVE_CONTENT } from '@dragverse/constants'
import type { PublicationMetadata } from '@dragverse/lens'

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
