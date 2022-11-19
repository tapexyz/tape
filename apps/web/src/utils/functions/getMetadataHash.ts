import type { LenstubePublication } from 'src/types'

const getMetadataHash = (publication: LenstubePublication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}

export default getMetadataHash
