import SharedLink from '@components/Home/OpenActions/SharedLink'
import OpenActionsShimmer from '@components/Shimmers/OpenActionsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import {
  LimitType,
  type LinkMetadataV3,
  type PrimaryPublication,
  PublicationMetadataMainFocusType,
  type PublicationsRequest,
  PublicationType,
  usePublicationsQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
}

const SharedLinks: FC<Props> = ({ profileId }) => {
  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Link],
        publishedOn: [LENSTUBE_APP_ID]
      },
      publicationTypes: [PublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      from: [profileId]
    },
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profileId
  })

  const links = data?.publications?.items as PrimaryPublication[]
  const pageInfo = data?.publications?.pageInfo

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

  if (loading) {
    return <OpenActionsShimmer />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No links found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-5">
            {links?.map(
              ({ metadata, by, createdAt }: PrimaryPublication, i) => {
                return (
                  <SharedLink
                    key={i}
                    metadata={metadata as LinkMetadataV3}
                    sharedBy={by}
                    postedAt={createdAt}
                  />
                )
              }
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default SharedLinks
