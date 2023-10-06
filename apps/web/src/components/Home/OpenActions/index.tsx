import CollectOutline from '@components/Common/Icons/CollectOutline'
import OpenActionsShimmer from '@components/Shimmers/OpenActionsShimmer'
import { Trans } from '@lingui/macro'
import { LENS_CUSTOM_FILTERS, TAPE_APP_ID } from '@tape.xyz/constants'
import type {
  ExplorePublicationRequest,
  LinkMetadataV3,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import React from 'react'

import SharedLink from './SharedLink'

const request: ExplorePublicationRequest = {
  where: {
    metadata: {
      publishedOn: [TAPE_APP_ID],
      mainContentFocus: [PublicationMetadataMainFocusType.Link]
    },
    publicationTypes: [ExplorePublicationType.Post],
    customFilters: LENS_CUSTOM_FILTERS
  },
  orderBy: ExplorePublicationsOrderByType.Latest,
  limit: LimitType.Ten
}

const OpenActionCollects = () => {
  const { data, error, loading } = useExplorePublicationsQuery({
    variables: { request }
  })
  const links = data?.explorePublications?.items as PrimaryPublication[]

  if (loading) {
    return <OpenActionsShimmer />
  }

  if (error || !data?.explorePublications?.items?.length) {
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
        {links?.map(({ metadata, by, createdAt }: PrimaryPublication, i) => {
          return (
            <SharedLink
              key={i}
              metadata={metadata as LinkMetadataV3}
              sharedBy={by}
              postedAt={createdAt}
            />
          )
        })}
      </div>
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default OpenActionCollects
