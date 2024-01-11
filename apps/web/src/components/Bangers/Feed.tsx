import BangersShimmer from '@components/Shimmers/BangersShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

import New from './New'
import RenderBanger from './RenderBanger'

const Feed = () => {
  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        publishedOn: [TAPE_APP_ID],
        mainContentFocus: [PublicationMetadataMainFocusType.Link]
      },
      customFilters: LENS_CUSTOM_FILTERS
    },
    orderBy: ExplorePublicationsOrderByType.TopReacted,
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore, refetch } =
    useExplorePublicationsQuery({
      variables: {
        request
      }
    })

  const posts = data?.explorePublications?.items as PrimaryPublication[]
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

  return (
    <>
      <New refetch={() => refetch()} />
      <div className="tape-border container mx-auto max-w-screen-sm !border-y-0">
        {loading && <BangersShimmer />}
        {(!loading && !posts?.length) || error ? (
          <NoDataFound withImage isCenter className="my-20" />
        ) : null}
        {posts?.map((post, i) => (
          <RenderBanger key={post.id} post={post} isCertifiedBanger={i === 0} />
        ))}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Spinner />
          </span>
        )}
      </div>
    </>
  )
}

export default Feed
