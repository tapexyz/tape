import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { PublicationsQueryRequest } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@lenstube/lens'

const useAlgoFeed = () => {
  const request: PublicationsQueryRequest = {
    limit: 50,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    },
    publicationIds: []
  }

  const { data } = useProfilePostsQuery({
    variables: { request }
  })

  return {
    publications: data?.publications.items,
    pageInfo: data?.publications.pageInfo
  }
}

export default useAlgoFeed
