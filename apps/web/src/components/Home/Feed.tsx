import CategoryFilters from '@components/Common/CategoryFilters'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  TAPE_APP_ID
} from '@dragverse/constants'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@dragverse/lens'
import {
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@dragverse/lens'
import { Spinner } from '@dragverse/ui'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import { getRandomFeedOrder } from '@lib/getRandomFeedOrder'
import useAppStore from '@lib/store'
import { useInView } from 'react-cool-inview'

const since = getUnixTimestampForDaysAgo(30)
const orderBy = getRandomFeedOrder()

const Feed = ({ showFilter = true }) => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined,
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
        mainContentFocus: [PublicationMetadataMainFocusType.Video]
      },
      since
    },
    orderBy,
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]

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

  return (
    <div className="laptop:pt-6 space-y-4 pt-4">
      {showFilter && <CategoryFilters />}
      <div>
        {loading && <TimelineShimmer />}
        {!error && !loading && videos.length > 0 && (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && (
              <span ref={observe} className="flex justify-center p-10">
                <Spinner />
              </span>
            )}
          </>
        )}
        {videos?.length === 0 && (
          <NoDataFound
            isCenter
            withImage
            text={`No DRAG content to consume yet 🌕 Share your drag make-up tutorial, music videos, and more with your community!`}
          />
        )}
      </div>
    </div>
  )
}

export default Feed
