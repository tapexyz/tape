import OpenActionsShimmer from '@components/Shimmers/OpenActionsShimmer'
import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import React from 'react'

import SharedLink from './SharedLink'

const OpenActionCollects = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    limit: 10,
    noRandomize: false,
    sources: [LENSTUBE_APP_ID],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Link]
    }
  }

  const { data, error, loading } = useExploreQuery({
    variables: { request, channelId: null }
  })
  const links = data?.explorePublications?.items as Publication[]

  if (loading) {
    return <OpenActionsShimmer />
  }

  if (error || !data?.explorePublications?.items?.length) {
    return null
  }

  return (
    <div className="mb-6 grid gap-x-4 gap-y-2 md:mb-8 md:grid-cols-4 md:gap-y-7 lg:grid-cols-5">
      {links?.map(({ metadata, profile, createdAt }: Publication, i) => {
        return (
          <SharedLink
            key={i}
            metadata={metadata}
            sharedBy={profile}
            postedAt={createdAt}
          />
        )
      })}
    </div>
  )
}

export default OpenActionCollects
