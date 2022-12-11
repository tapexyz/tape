import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React from 'react'
import { useInView } from 'react-cool-inview'
import type { LenstubePublication } from 'utils'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils'

import Item from './Item'

const Curated = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Audio]
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications?.items as LenstubePublication[]

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
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

  if (videos?.length === 0) {
    return <NoDataFound isCenter withImage text="No echoes found" />
  }

  return (
    <div>
      {loading && <Loader />}
      {!error && !loading && videos && (
        <>
          <div className="grid max-w-[1600px] place-items-center mx-auto grid-cols-1 gap-5 mt-4 ultrawide:grid-cols-7 lg:grid-cols-5 sm:grid-cols-3">
            {videos?.map((publication: LenstubePublication) => (
              <Item publication={publication} key={publication.id} />
            ))}
          </div>
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default Curated
