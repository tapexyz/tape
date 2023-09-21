import type { AnyPublication } from '@lenstube/lens'

export const getMetadataCid = (publication: AnyPublication): string => {
  const hash = publication.metadata.rawURI.split('/').pop()
  return hash ?? ''
}
