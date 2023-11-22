import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@dragverse/constants'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@dragverse/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@dragverse/lens'
import { Loader } from '@dragverse/ui'
import { useInView } from 'react-cool-inview'

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID],
      mainContentFocus: [PublicationMetadataMainFocusType.Video]
    }
  },
  orderBy: ExplorePublicationsOrderByType.Latest,
  limit: LimitType.Fifty
}

const Recents = () => {
  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })
  if (loading) {
    return (
      <div className="pt-3">
        <TimelineShimmer />
      </div>
    )
  }
  if (!videos.length || error) {
    return <NoDataFound isCenter withImage text={`No DRAG content to consume yet 🌕 Share your drag make-up tutorial, music videos, and more with your community!`} />
  }

  return (
    <div className="pt-3">
      {!error && !loading && videos?.length ? (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      ) : null}
    </div>
  )
}

export default Recents
