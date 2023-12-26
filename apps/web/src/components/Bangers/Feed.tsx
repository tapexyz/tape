import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

import BangersShimmer from '@components/Shimmers/BangersShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

import New from './New'
import RenderBanger from './RenderBanger'

const Feed = () => {
  const request: ExplorePublicationRequest = {
    limit: LimitType.Fifty,
    orderBy: ExplorePublicationsOrderByType.TopReacted,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Link],
        publishedOn: [TAPE_APP_ID]
      },
      publicationTypes: [ExplorePublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading, refetch } =
    useExplorePublicationsQuery({
      variables: {
        request
      }
    })

  const posts = data?.explorePublications?.items as PrimaryPublication[]
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

  return (
    <>
      <New refetch={() => refetch()} />
      <div className="tape-border container mx-auto max-w-screen-sm !border-y-0">
        {loading && <BangersShimmer />}
        {(!loading && !posts?.length) || error ? (
          <NoDataFound className="my-20" isCenter withImage />
        ) : null}
        {posts?.map((post, i) => (
          <RenderBanger isCertifiedBanger={i === 0} key={post.id} post={post} />
        ))}
        {pageInfo?.next && (
          <span className="flex justify-center p-10" ref={observe}>
            <Loader />
          </span>
        )}
      </div>
    </>
  )
}

export default Feed
