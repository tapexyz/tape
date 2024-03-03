import MetaTags from '@components/Common/MetaTags'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type {
  AnyPublication,
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsLazyQuery,
  usePublicationLazyQuery
} from '@tape.xyz/lens'
import { ChevronDownOutline, ChevronUpOutline, Spinner } from '@tape.xyz/ui'
import { useKeenSlider } from 'keen-slider/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'

import ByteVideo from './ByteVideo'
import { KeyboardControls, WheelControls } from './SliderPlugin'

const since = getUnixTimestampForDaysAgo(30)

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
    },
    customFilters: LENS_CUSTOM_FILTERS,
    since
  },
  orderBy: ExplorePublicationsOrderByType.Latest,
  limit: LimitType.Fifty
}

const Bytes = () => {
  const router = useRouter()
  const [currentViewingId, setCurrentViewingId] = useState('')

  const [sliderRef, { current: slider }] = useKeenSlider(
    {
      vertical: true,
      slides: { perView: 1, spacing: 10 }
    },
    [WheelControls, KeyboardControls]
  )

  const [
    fetchPublication,
    { data: singleByteData, loading: singleByteLoading }
  ] = usePublicationLazyQuery()

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    useExplorePublicationsLazyQuery({
      variables: {
        request
      },
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as unknown as AnyPublication[]
        const publicationId = router.query.id
        if (!publicationId && items[0]?.id) {
          const nextUrl = `${location.origin}/bytes/${items[0]?.id}`
          history.pushState({ path: nextUrl }, '', nextUrl)
        }
      }
    })

  const bytes = data?.explorePublications?.items as unknown as AnyPublication[]
  const pageInfo = data?.explorePublications?.pageInfo
  const singleByte = singleByteData?.publication as PrimaryPublication

  const fetchSingleByte = async () => {
    const publicationId = router.query.id
    if (!publicationId) {
      return fetchAllBytes()
    }
    await fetchPublication({
      variables: {
        request: { forId: publicationId }
      },
      onCompleted: () => fetchAllBytes(),
      fetchPolicy: 'network-only'
    })
  }

  useEffect(() => {
    if (router.isReady) {
      fetchSingleByte()
      Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.BYTES })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const { observe } = useInView({
    threshold: 0.25,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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

  if (loading || singleByteLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner />
      </div>
    )
  }

  if (error || (!bytes?.length && !singleByte)) {
    return (
      <div className="grid h-screen place-items-center">
        <NoDataFound isCenter withImage />
      </div>
    )
  }

  return (
    <div className="relative mt-16 h-[calc(100vh-7rem)] overflow-y-hidden focus-visible:outline-none md:h-[calc(100vh-4rem)]">
      <MetaTags title="Bytes" />
      <style jsx global>{`
        html {
          overflow-y: hidden;
        }
      `}</style>
      <div
        ref={sliderRef}
        className="keen-slider h-[calc(100vh-9rem)] snap-y snap-mandatory focus-visible:outline-none md:h-[calc(100vh-4rem)]"
      >
        {singleByte && (
          <ByteVideo
            video={singleByte}
            currentViewingId={currentViewingId}
            intersectionCallback={(id) => setCurrentViewingId(id)}
          />
        )}
        {bytes?.map(
          (video, index) =>
            singleByte?.id !== video.id && (
              <ByteVideo
                video={video}
                currentViewingId={currentViewingId}
                intersectionCallback={(id) => setCurrentViewingId(id)}
                key={`${video?.id}_${index}`}
              />
            )
        )}
      </div>
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
      <div className="laptop:right-6 ultrawide:right-8 bottom-3 right-4 hidden flex-col space-y-2 md:absolute md:flex">
        <button
          className="bg-gallery rounded-full p-3 focus:outline-none dark:bg-gray-800"
          onClick={() => slider?.prev()}
        >
          <ChevronUpOutline className="size-5" />
        </button>
        <button
          className="bg-gallery rounded-full p-3 focus:outline-none dark:bg-gray-800"
          onClick={() => slider?.next()}
        >
          <ChevronDownOutline className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default Bytes
