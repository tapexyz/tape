import Timeline from '@components/Home/Timeline'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import usePersistStore from '@lib/store/persist'
import { t } from '@lingui/macro'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { getValueFromKeyInAttributes } from '@tape.xyz/generic'
import type {
  AnyPublication,
  Profile,
  PublicationsRequest
} from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import PinnedVideo from './PinnedVideo'

type Props = {
  profile: Profile
}

const ChannelVideos: FC<Props> = ({ profile }) => {
  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const pinnedVideoId = getValueFromKeyInAttributes(
    profile?.metadata?.attributes,
    'pinnedPublicationId'
  )

  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined
      },
      publicationTypes: [PublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      from: profile.id
    },
    limit: LimitType.TwentyFive
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: {
      request
    },
    skip: !profile?.id
  })

  const channelVideos = data?.publications?.items as AnyPublication[]
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
    return (
      <>
        <PinnedVideoShimmer />
        <TimelineShimmer />
      </>
    )
  }

  if (data?.publications?.items?.length === 0 && queuedVideos.length === 0) {
    return <NoDataFound isCenter withImage text={t`No videos found`} />
  }

  return (
    <>
      {pinnedVideoId?.length ? (
        <span className="hidden lg:block">
          <PinnedVideo id={pinnedVideoId} />
        </span>
      ) : null}
      {!error && !loading && (
        <>
          <Timeline videos={channelVideos} />
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

export default ChannelVideos
