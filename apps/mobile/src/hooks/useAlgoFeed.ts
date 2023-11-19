import { LENS_CUSTOM_FILTERS } from '@dragverse/constants'
import type { PublicationsRequest } from '@dragverse/lens'
import {
    LimitType,
    PublicationMetadataMainFocusType,
    PublicationType,
    usePublicationsQuery
} from '@dragverse/lens'

const useAlgoFeed = () => {
  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      publicationTypes: [PublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Audio,
          PublicationMetadataMainFocusType.Video
        ]
      },
      publicationIds: []
    }
  }

  const { data } = usePublicationsQuery({
    variables: { request }
  })

  return {
    publications: data?.publications.items,
    pageInfo: data?.publications.pageInfo
  }
}

export default useAlgoFeed
