import type { Publication } from 'lens'

const getMetadataHash = (publication: Publication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}

export default getMetadataHash
