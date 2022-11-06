import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@utils/constants'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import {
  PaginatedResultInfo,
  SearchPublicationsDocument,
  SearchRequestTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

const ExploreHashtag = () => {
  const { query } = useRouter()
  const hashtag = query.hashtag as string
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const request = {
    type: SearchRequestTypes.Publication,
    limit: 16,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    query: hashtag
  }

  const { data, loading, error, fetchMore } = useQuery(
    SearchPublicationsDocument,
    {
      variables: {
        request
      },
      skip: !hashtag,
      onCompleted: (data) => {
        if (data.search.__typename === 'PublicationSearchResult') {
          setPageInfo(data?.search?.pageInfo)
          setVideos(data?.search?.items as LenstubePublication[])
        }
      }
    }
  )

  // @ts-ignore
  const searchItems = data?.search?.items

  const { observe } = useInView({
    rootMargin: '1000px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              query: hashtag,
              cursor: pageInfo?.next
            }
          }
        })
        if (data.search.__typename === 'PublicationSearchResult') {
          setPageInfo(data?.search?.pageInfo)
          setVideos([
            ...videos,
            ...(data?.search?.items as LenstubePublication[])
          ])
        }
      } catch (error) {
        logger.error('[Error Fetch Explore Hashtag]', error)
      }
    }
  })
  if (!hashtag) return <Custom404 />

  return (
    <>
      <MetaTags title={hashtag?.toString() || ''} />
      <div>
        <h1 className="font-semibold md:text-2xl">#{hashtag}</h1>
        <div className="my-4">
          {loading && <TimelineShimmer />}
          {searchItems?.length === 0 && (
            <NoDataFound isCenter withImage text="No videos found" />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
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

export default ExploreHashtag
