import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import type { Profile } from 'src/types/lens'
import { useProfileMirrorsQuery } from 'src/types/lens'
import { PublicationMainFocus, PublicationTypes } from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

type Props = {
  channel: Profile
}

const request = {
  publicationTypes: [PublicationTypes.Mirror],
  limit: 30,
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

  const channelVideos = data?.publications?.items as LenstubePublication[]
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

  if (loading) return <TimelineShimmer />

  if (channelVideos?.length === 0) {
    return <NoDataFound isCenter withImage text="No mirrors found" />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div>
          <Timeline videos={channelVideos} videoType="Mirror" />
          {pageInfo?.next && channelVideos.length !== pageInfo?.totalCount && (
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
