import type { Publication } from '@tape.xyz/lens'
import { PublicationMainFocus } from '@tape.xyz/lens'

export const isWatchable = (publication: Publication) => {
  const canWatch =
    publication &&
    publication.metadata?.mainContentFocus === PublicationMainFocus.Video &&
    !publication?.hidden

  return canWatch
}
