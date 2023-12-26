import type {
  AnyPublication,
  PublicationBookmarksRequest
} from '@tape.xyz/lens'
import type { FC } from 'react'

import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  usePublicationBookmarksQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Bookmarks: FC = () => {
  const { activeProfile } = useProfileStore()

  const request: PublicationBookmarksRequest = {
    limit: LimitType.Fifty,
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined
      }
    }
  }

  const { data, error, fetchMore, loading } = usePublicationBookmarksQuery({
    skip: !activeProfile?.id,
    variables: {
      request
    }
  })

  const savedVideos = data?.publicationBookmarks?.items as AnyPublication[]
  const pageInfo = data?.publicationBookmarks?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          channelId: activeProfile?.id ?? null,
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (!data?.publicationBookmarks?.items?.length) {
    return (
      <NoDataFound
        className="my-20"
        isCenter
        text="No videos found"
        withImage
      />
    )
  }

  return (
    <>
      <MetaTags title={`Saved Videos`} />
      <h1 className="mb-6 font-bold md:text-2xl">Saved Videos</h1>
      {!error && !loading && (
        <>
          <Timeline videos={savedVideos} />
          {pageInfo?.next && (
            <span className="flex justify-center p-10" ref={observe}>
              <Loader />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Bookmarks
