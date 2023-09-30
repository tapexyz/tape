import CollectOutline from '@components/Common/Icons/CollectOutline'
import CrossChainCollectsShimmer from '@components/Shimmers/CrossChainCollectsShimmer'
import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import React from 'react'

import SharedLink from './SharedLink'

const CrossChainCollects = () => {
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
    return <CrossChainCollectsShimmer />
  }

  if (error || !data?.explorePublications) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CollectOutline className="h-4 w-4" />
          <h1 className="text-xl font-semibold">
            <Trans>Cross Chain Collects</Trans>
          </h1>
        </div>
      </div>
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-5">
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
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default CrossChainCollects
