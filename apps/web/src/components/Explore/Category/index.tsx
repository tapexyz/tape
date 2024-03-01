import MetaTags from '@components/Common/MetaTags';
import Timeline from '@components/Home/Timeline';
import TimelineShimmer from '@components/Shimmers/TimelineShimmer';
import { NoDataFound } from '@components/UIElements/NoDataFound';
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@dragverse/constants';
import { getCategoryName } from '@dragverse/generic';
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@dragverse/lens';
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@dragverse/lens';
import { Spinner } from '@dragverse/ui';
import { getUnixTimestampForDaysAgo } from '@lib/formatTime';
import { useRouter } from 'next/router';
import { useInView } from 'react-cool-inview';
import Custom404 from 'src/pages/404';

const since = getUnixTimestampForDaysAgo(30)

const ExploreCategory = () => {
  const { query } = useRouter()
  const categoryName = query.category as string

  const request: ExplorePublicationRequest = {
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        tags: { oneOf: [categoryName] },
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined
      },
      since
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: {
      request
    },
    skip: !query.category
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
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    }
  })
  if (!query.category) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={categoryName?.toString() || ''} />
      <div>
        <h1 className="font-bold capitalize md:text-2xl">
          {getCategoryName(categoryName)}
        </h1>
        <div className="my-4">
          {loading && <TimelineShimmer />}
          {videos?.length === 0 && (
            <NoDataFound
              isCenter
              withImage
              text={`No DRAG content to consume yet 🌕 Share your drag make-up tutorial, music videos, and more with your community!`}
            />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && (
                <span ref={observe} className="flex justify-center p-10">
                  <Spinner />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ExploreCategory
