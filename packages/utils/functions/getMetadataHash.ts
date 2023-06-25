import type { Publication } from '@lenstube/lens'

const getMetadataHash = (publication: Publication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}

export default getMetadataHash
