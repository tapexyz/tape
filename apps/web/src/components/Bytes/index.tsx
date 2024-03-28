import MetaTags from '@components/Common/MetaTags'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useCuratedProfiles from '@lib/store/idb/curated'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type {
  AnyPublication,
  PrimaryPublication,
  PublicationsRequest
} from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationLazyQuery,
  usePublicationsLazyQuery
} from '@tape.xyz/lens'
import { ChevronDownOutline, ChevronUpOutline, Spinner } from '@tape.xyz/ui'
import { useKeenSlider } from 'keen-slider/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'

import ByteVideo from './ByteVideo'
import { KeyboardControls, WheelControls } from './SliderPlugin'

const Bytes = () => {
  const router = useRouter()
  const [currentViewingId, setCurrentViewingId] = useState('')
  const curatedProfiles = useCuratedProfiles((state) => state.curatedProfiles)

  const [sliderRef, { current: slider }] = useKeenSlider(
    {
      vertical: true,
      slides: { perView: 1, spacing: 10 }
    },
    [WheelControls, KeyboardControls]
  )

  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined
      },
      publicationTypes: [PublicationType.Post],
      from: curatedProfiles
    },
    limit: LimitType.Fifty
  }

  const [
    fetchPublication,
    { data: singleByteData, loading: singleByteLoading }
  ] = usePublicationLazyQuery()

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    usePublicationsLazyQuery({
      variables: {
        request
      },
      onCompleted: ({ publications }) => {
        const items = publications?.items as unknown as AnyPublication[]
        const publicationId = router.query.id
        if (!publicationId && items[0]?.id) {
          const nextUrl = `${location.origin}/bytes/${items[0]?.id}`
          history.pushState({ path: nextUrl }, '', nextUrl)
        }
      }
    })

  const bytes = data?.publications?.items as unknown as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo
  const singleByte = singleByteData?.publication as PrimaryPublication

  const fetchSingleByte = async () => {
    const publicationId = router.query.id
    if (!publicationId) {
      return curatedProfiles?.length ? fetchAllBytes() : null
    }
    await fetchPublication({
      variables: {
        request: { forId: publicationId }
      },
      onCompleted: () => (curatedProfiles?.length ? fetchAllBytes() : null),
      fetchPolicy: 'network-only'
    })
  }

  useEffect(() => {
    if (router.isReady) {
      fetchSingleByte()
      Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.BYTES })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, curatedProfiles.length])

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
