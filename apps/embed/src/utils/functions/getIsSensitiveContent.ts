import { SENSITIVE_CONTENT } from '@utils/data/sensitives'
import type { MetadataOutput } from 'lens'

export const getIsSensitiveContent = (
  metadata: MetadataOutput | null,
  videoId: string
): boolean => {
  return (
    !!metadata?.attributes?.find((el) => el.value === 'sensitive') ||
    SENSITIVE_CONTENT.includes(videoId) ||
    !!metadata?.contentWarning
  )
}
