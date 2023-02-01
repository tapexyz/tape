import type { Publication } from 'lens'
import { PublicationMainFocus } from 'lens'

const isWatchable = (publication: Publication) => {
  const publicationType = publication?.__typename

  const canWatch =
    publication &&
    publicationType &&
    ['Post', 'Comment'].includes(publicationType) &&
    publication.metadata.mainContentFocus === PublicationMainFocus.Video &&
    !publication?.hidden

  return canWatch
}

export default isWatchable
