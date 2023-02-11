import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import type { Profile, Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfileMirrorsQuery
} from 'lens'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { LENS_CUSTOM_FILTERS } from 'utils'

type Props = {
  channel: Profile
}

const request = {
  publicationTypes: [PublicationTypes.Mirror],
  limit: 32,
  metadata: { mainContentFocus: [PublicationMainFocus.Video] },
  customFilters: LENS_CUSTOM_FILTERS
}

const MirroredVideos: FC<Props> = ({ channel }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { data, loading, error, fetchMore } = useProfileMirrorsQuery({
    variables: {
      request: {
        ...request,
        profileId: channel?.id
      }
    },
    skip: !channel?.id
  })

  const channelVideos = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  usePaginationLoading({
    ref: sectionRef,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            profileId: channel?.id,
            ...request
          }
        }
      })
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (channelVideos?.length === 0) {
    return <NoDataFound isCenter withImage text="No mirrors found" />
  }

  return (
    <div ref={sectionRef} className="w-full">
      {!error && !loading && (
        <div>
          <Timeline videos={channelVideos} videoType="Mirror" />
          {pageInfo?.next && (
            <span className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default MirroredVideos
