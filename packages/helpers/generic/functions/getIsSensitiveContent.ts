import { SENSITIVE_CONTENT } from '@tape.xyz/constants'
import type { MetadataOutput } from '@tape.xyz/lens'

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
