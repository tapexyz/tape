import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { getCategoryName } from '@tape.xyz/generic'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'

const ExploreCategory = () => {
  const { query } = useRouter()
  const categoryName = query.category as string

  const request: ExplorePublicationRequest = {
    limit: LimitType.Fifty,
    orderBy: ExplorePublicationsOrderByType.Latest,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined,
        tags: { oneOf: [categoryName] }
      },
      publicationTypes: [ExplorePublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading } = useExplorePublicationsQuery({
    skip: !query.category,
    variables: {
      request
    }
  })

  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
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
            <NoDataFound isCenter text={`No videos found`} withImage />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && (
                <span className="flex justify-center p-10" ref={observe}>
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
