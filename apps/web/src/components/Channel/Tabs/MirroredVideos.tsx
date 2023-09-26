import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@lenstube/constants'
import type { AnyPublication, PublicationsRequest } from '@lenstube/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
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

const MirroredVideos: FC<Props> = ({ profileId }) => {
  const request: PublicationsRequest = {
    where: {
      metadata: { mainContentFocus: [PublicationMetadataMainFocusType.Video] },
      publicationTypes: [PublicationType.Mirror],
      customFilters: LENS_CUSTOM_FILTERS,
      from: [profileId]
    },
    limit: LimitType.TwentyFive
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: {
      request: {
        ...request
      }
    },
    skip: !profileId
  })

  const mirroredVideos = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            profileId,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (mirroredVideos?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No mirrors found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div>
          <Timeline videos={mirroredVideos} videoType="Mirror" />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default MirroredVideos
