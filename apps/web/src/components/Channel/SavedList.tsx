import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type { Profile, Publication } from '@lenstube/lens'
import { PublicationMainFocus, useProfileBookmarksQuery } from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  channel: Profile
}

const SavedList: FC<Props> = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const request = {
    limit: 32,
    metadata: { mainContentFocus: [PublicationMainFocus.Video] },
    profileId: selectedSimpleProfile?.id,
    sources: IS_MAINNET
      ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
      : undefined
  }

  const { data, loading, error, fetchMore } = useProfileBookmarksQuery({
    variables: {
      request,
      channelId: selectedSimpleProfile?.id ?? null
    },
    skip: !selectedSimpleProfile?.id
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
          channelId: selectedSimpleProfile?.id ?? null
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
      <MetaTags title={t`Saved Videos`} />
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
