import type { LenstubePublication } from 'src/types/local'

const getMetadataHash = (publication: LenstubePublication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}

export default getMetadataHash
