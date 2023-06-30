import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  LENSTUBE_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type { Profile, Publication } from '@lenstube/lens'
import { PublicationMainFocus, useProfileBookmarksQuery } from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  channel: Profile
}

const SavedList: FC<Props> = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const request = {
    limit: 32,
    metadata: { mainContentFocus: [PublicationMainFocus.Video] },
    profileId: selectedChannel?.id,
    sources: [LENSTUBE_APP_ID, ...ALLOWED_APP_IDS]
  }

  const { data, loading, error, fetchMore } = useProfileBookmarksQuery({
    variables: {
      request,
      channelId: selectedChannel?.id ?? null
    },
    skip: !selectedChannel?.id
  })

  const savedVideos = data?.publicationsProfileBookmarks?.items as Publication[]
  const pageInfo = data?.publicationsProfileBookmarks?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          },
          channelId: selectedChannel?.id ?? null
        }
      })
    }
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (!data?.publicationsProfileBookmarks?.items?.length) {
    return <NoDataFound isCenter withImage text={t`No saved videos found`} />
  }

  return (
    <>
      <MetaTags title="Saved Videos" />
      <h1 className="mb-6 font-semibold md:text-2xl">Saved Videos</h1>
      {!error && !loading && (
        <>
          <Timeline videos={savedVideos} />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default SavedList
