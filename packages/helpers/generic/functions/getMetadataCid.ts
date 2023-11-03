import type { AnyPublication } from '@tape.xyz/lens'

import { getPublication } from './getPublication'

export const getMetadataCid = (publication: AnyPublication): string => {
  const target = getPublication(publication)
  const hash = target.metadata.rawURI.split('/').pop()
  return hash ?? ''
}
