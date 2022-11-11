import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  ExploreDocument,
  PaginatedResultInfo,
  PublicationSortCriteria,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

import ByteVideo from './ByteVideo'

const request = {
  sortCriteria: PublicationSortCriteria.CuratedProfiles,
  limit: 10,
  noRandomize: false,
  sources: [LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  customFilters: LENS_CUSTOM_FILTERS
}

const Bytes = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const [bytes, setBytes] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.BYTES })
  }, [])

  const { data, loading, error, fetchMore } = useQuery(ExploreDocument, {
    variables: {
      request,
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setBytes(data?.explorePublications?.items as LenstubePublication[])
    }
  })

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.explorePublications?.pageInfo)
        setBytes([
          ...bytes,
          ...(data?.explorePublications?.items as LenstubePublication[])
        ])
      } catch (error) {
        logger.error('[Error Fetch Bytes]', error)
      }
    }
  })

  if (loading)
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    )

  if (data?.explorePublications?.items?.length === 0) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <NoDataFound isCenter withImage text="No bytes found" />
      </div>
    )
  }

  return (
    <div className="overflow-y-hidden">
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <MetaTags title="Bytes" />
      {!error && !loading && (
        <div className="md:h-[calc(100vh-70px)] h-screen overflow-y-scroll no-scrollbar snap-y snap-mandatory scroll-smooth">
          {bytes?.map((video: LenstubePublication) => (
            <ByteVideo video={video} key={`${video?.id}_${video.createdAt}`} />
          ))}
          {pageInfo?.next && bytes.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Bytes
