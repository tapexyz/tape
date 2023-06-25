import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type { Profile, Publication } from '@lenstube/lens'
import { PublicationTypes, useProfilePostsQuery } from '@lenstube/lens'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  channel: Profile
}

const ChannelBytes: FC<Props> = ({ channel }) => {
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
