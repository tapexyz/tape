import type { Publication } from '@lenstube/lens'

export const getMetadataCid = (publication: Publication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}
