import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@tape.xyz/constants'
import type { AnyPublication, PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
}

const ChannelBytes: FC<Props> = ({ profileId }) => {
  const request: PublicationsRequest = {
    where: {
      metadata: { publishedOn: [LENSTUBE_BYTES_APP_ID] },
      publicationTypes: [PublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      from: [profileId]
    },
    limit: LimitType.TwentyFive
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profileId
  })

  const bytes = data?.publications?.items as AnyPublication[]
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
    return <TimelineShimmer />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No bytes found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <Timeline videos={bytes} />
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

export default ChannelBytes
