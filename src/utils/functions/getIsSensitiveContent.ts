import { SENSITIVE_CONTENT } from '@utils/constants'
import { MetadataAttributeOutput } from 'src/types'

export const getIsSensitiveContent = (
  attributes: MetadataAttributeOutput[] | null,
  videoId: string
) => {
  return (
    !!attributes?.find((el) => el.value === 'sensitive') ||
    SENSITIVE_CONTENT.includes(videoId)
  )
}
