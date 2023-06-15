import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import { useRouter } from 'next/router'
import React from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import {
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from 'utils'
import getCategoryName from 'utils/functions/getCategoryName'

const ExploreCategory = () => {
  const { query } = useRouter()
  const categoryName = query.category as string
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 32,
    sortCriteria: PublicationSortCriteria.Latest,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags: { oneOf: [categoryName] },
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: {
      request,
      channelId: selectedChannel?.id ?? null
    },
    skip: !query.category
  })

  const videos = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          },
          channelId: selectedChannel?.id ?? null
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
        <h1 className="font-semibold capitalize md:text-2xl">
          {getCategoryName(categoryName)}
        </h1>
        <div className="my-4">
          {loading && <TimelineShimmer />}
          {videos?.length === 0 && (
            <NoDataFound isCenter withImage text={t`No videos found`} />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && (
                <span ref={observe} className="flex justify-center p-10">
                  <Loader />
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
