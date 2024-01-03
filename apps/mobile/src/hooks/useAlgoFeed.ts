import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import type { PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'

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
