import type { Publication } from 'lens'
import { PublicationMainFocus } from 'lens'

const isWatchable = (publication: Publication) => {
  const canWatch =
    publication &&
    publication.metadata?.mainContentFocus === PublicationMainFocus.Video &&
    !publication?.hidden

  return canWatch
}

export default isWatchable
