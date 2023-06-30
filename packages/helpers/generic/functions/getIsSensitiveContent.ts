import { SENSITIVE_CONTENT } from '@lenstube/constants'
import type { MetadataOutput } from '@lenstube/lens'

export const getIsSensitiveContent = (
  metadata: MetadataOutput | null,
  videoId: string
): boolean => {
  return (
    Boolean(metadata?.attributes?.find((el) => el.value === 'sensitive')) ||
    SENSITIVE_CONTENT.includes(videoId) ||
    Boolean(metadata?.contentWarning)
  )
}
