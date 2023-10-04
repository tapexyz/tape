import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type { Publication } from '@tape.xyz/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

const HomeFeed = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    sources: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request, channelId: selectedSimpleProfile?.id ?? null }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications?.items as Publication[]

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

  if (videos?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No videos found`} />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && videos && (
        <>
          <Timeline videos={videos} />
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

export default HomeFeed
