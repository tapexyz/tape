import type { Publication } from '@tape.xyz/lens'

export const getMetadataCid = (publication: Publication): string => {
  const hash = publication.onChainContentURI.split('/').pop()
  return hash ?? ''
}
