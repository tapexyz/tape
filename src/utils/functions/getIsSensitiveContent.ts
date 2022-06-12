import { MetadataAttributeOutput } from 'src/types'

export const getIsSensitiveContent = (
  attributes: MetadataAttributeOutput[] | null
) => {
  return !!attributes?.find((el) => el.value === 'sensitive')
}
