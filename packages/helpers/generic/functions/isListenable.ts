import type { MirrorablePublication } from '@dragverse/lens'

export const isListenable = (publication: MirrorablePublication) => {
  const canListen =
    publication &&
    publication.metadata.__typename === 'AudioMetadataV3' &&
    !publication?.isHidden

  return canListen
}
