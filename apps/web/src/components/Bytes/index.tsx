import type {
  AnyPublication,
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MetaTags from '@components/Common/MetaTags'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsLazyQuery,
  usePublicationLazyQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import { useKeenSlider } from 'keen-slider/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'

import ByteVideo from './ByteVideo'
import { KeyboardControls, WheelControls } from './SliderPlugin'

const request: ExplorePublicationRequest = {
  limit: LimitType.Fifty,
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  where: {
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
    },
    publicationTypes: [ExplorePublicationType.Post]
  }
}

const Bytes = () => {
  const router = useRouter()
  const [currentViewingId, setCurrentViewingId] = useState('')

  const [sliderRef, { current: slider }] = useKeenSlider(
    {
      slides: { perView: 1, spacing: 10 },
      vertical: true
    },
    [WheelControls, KeyboardControls]
  )

  const [
    fetchPublication,
    { data: singleByteData, loading: singleByteLoading }
  ] = usePublicationLazyQuery()

  const [fetchAllBytes, { data, error, fetchMore, loading }] =
    useExplorePublicationsLazyQuery({
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as unknown as AnyPublication[]
        const publicationId = router.query.id
        if (!publicationId && items[0]?.id) {
          const nextUrl = `${location.origin}/bytes/${items[0]?.id}`
          history.pushState({ path: nextUrl }, '', nextUrl)
        }
      },
      variables: {
        request
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
      fetchPolicy: 'network-only',
      onCompleted: () => fetchAllBytes(),
      variables: {
        request: { forId: publicationId }
      }
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
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    threshold: 0.25
  })

  if (loading || singleByteLoading) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    )
  }

  if (error || (!bytes?.length && !singleByte)) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <NoDataFound isCenter withImage />
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-7rem)] overflow-y-hidden focus-visible:outline-none md:h-[calc(100vh-4rem)]">
      <MetaTags title="Bytes" />
      <div
        className="keen-slider h-[calc(100vh-7rem)] snap-y snap-mandatory focus-visible:outline-none md:h-[calc(100vh-4rem)]"
        ref={sliderRef}
      >
        {singleByte && (
          <ByteVideo
            currentViewingId={currentViewingId}
            intersectionCallback={(id) => setCurrentViewingId(id)}
            video={singleByte}
          />
        )}
        {bytes?.map(
          (video, index) =>
            singleByte?.id !== video.id && (
              <ByteVideo
                currentViewingId={currentViewingId}
                intersectionCallback={(id) => setCurrentViewingId(id)}
                key={`${video?.id}_${index}`}
                video={video}
              />
            )
        )}
      </div>
      {pageInfo?.next && (
        <span className="flex justify-center p-10" ref={observe}>
          <Loader />
        </span>
      )}
      <div className="laptop:right-6 ultrawide:right-8 bottom-2 right-4 hidden flex-col space-y-2 md:absolute md:flex">
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
