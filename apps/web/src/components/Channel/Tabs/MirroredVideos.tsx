import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@lenstube/constants'
import type { Profile, Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfileMirrorsQuery
} from '@lenstube/lens'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

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

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            profileId: channel?.id,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (channelVideos?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No mirrors found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div>
          <Timeline videos={channelVideos} videoType="Mirror" />
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
