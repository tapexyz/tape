import type { Publication } from '@lenstube/lens'
import { PublicationMainFocus } from '@lenstube/lens'

const isWatchable = (publication: Publication) => {
  const canWatch =
    publication &&
    publication.metadata?.mainContentFocus === PublicationMainFocus.Video &&
    !publication?.hidden

  return canWatch
}

export default isWatchable
