import BangersShimmer from '@components/Shimmers/BangersShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
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
    orderBy: ExplorePublicationsOrderByType.TopMirrored,
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
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

  if (loading) {
    return <BangersShimmer />
  }

  if ((!loading && !posts?.length) || error) {
    return <NoDataFound withImage isCenter className="my-20" />
  }

  return (
    <div>
      {posts?.map((post) => <RenderBanger key={post.id} post={post} />)}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Loader />
        </span>
      )}
    </div>
  )
}

export default Feed
