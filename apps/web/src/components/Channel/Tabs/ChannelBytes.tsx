import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import { t } from '@lingui/macro'
import type { Profile, Publication } from 'lens'
import { PublicationTypes, useProfilePostsQuery } from 'lens'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from 'utils'

type Props = {
  channel: Profile
}

const ChannelBytes: FC<Props> = ({ channel }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 32,
    sources: [LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: channel?.id
  }

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: { request },
    skip: !channel?.id
  })

  const bytes = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  usePaginationLoading({
    ref: sectionRef,
    hasMore: !!pageInfo?.next,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No bytes found`} />
  }

  return (
    <div ref={sectionRef} className="w-full">
      {!error && !loading && (
        <>
          <Timeline videos={bytes} />
          {pageInfo?.next && (
            <span className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default ChannelBytes
