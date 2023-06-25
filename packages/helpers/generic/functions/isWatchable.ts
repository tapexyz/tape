import type { Publication } from '@lenstube/lens'
import { PublicationMainFocus } from '@lenstube/lens'

export const isWatchable = (publication: Publication) => {
  const canWatch =
    publication &&
    publication.metadata?.mainContentFocus === PublicationMainFocus.Video &&
    !publication?.hidden

  return canWatch
}
