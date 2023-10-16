import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MetaTags from '@components/Common/MetaTags'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
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
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'

import ByteVideo from './ByteVideo'

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo]
    },
    customFilters: LENS_CUSTOM_FILTERS
  },
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  limit: LimitType.Fifty
}

const Bytes = () => {
  const router = useRouter()
  const bytesContainer = useRef<HTMLDivElement>(null)
  const [currentViewingId, setCurrentViewingId] = useState('')

  const [fetchPublication, { data: singleByte, loading: singleByteLoading }] =
    usePublicationLazyQuery()

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    useExplorePublicationsLazyQuery({
      variables: {
        request
      },
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as unknown as AnyPublication[]
        const publicationId = router.query.id
        if (!publicationId) {
          const nextUrl = `${location.origin}/bytes/${items[0]?.id}`
          history.pushState({ path: nextUrl }, '', nextUrl)
        }
      }
    })

  const bytes = data?.explorePublications?.items as unknown as AnyPublication[]
  const pageInfo = data?.explorePublications?.pageInfo
  const singleBytePublication =
    singleByte?.publication as unknown as PrimaryPublication

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
      Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.BYTES })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

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

  if (loading || singleByteLoading) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <NoDataFound isCenter withImage />
      </div>
    )
  }

  return (
    <div className="overflow-y-hidden">
      <MetaTags title="Bytes" />
      <div
        ref={bytesContainer}
        className="no-scrollbar h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-scroll scroll-smooth pt-4"
      >
        {singleByte && (
          <ByteVideo
            video={singleBytePublication}
            currentViewingId={currentViewingId}
            intersectionCallback={(id) => setCurrentViewingId(id)}
          />
        )}
        {bytes?.map(
          (video, index) =>
            singleByte?.publication?.id !== video.id && (
              <ByteVideo
                video={video}
                currentViewingId={currentViewingId}
                intersectionCallback={(id) => setCurrentViewingId(id)}
                key={`${video?.id}_${index}`}
              />
            )
        )}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Loader />
          </span>
        )}
        <div className="bottom-4 right-4 hidden flex-col space-y-2 lg:absolute lg:flex">
          <button
            className="rounded-full p-3 hover:bg-gray-200 focus:outline-none dark:bg-gray-800"
            onClick={() => bytesContainer.current?.scrollBy({ top: -30 })}
          >
            <ChevronUpOutline className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-3 hover:bg-gray-200 focus:outline-none dark:bg-gray-800"
            onClick={() => bytesContainer.current?.scrollBy({ top: 30 })}
          >
            <ChevronDownOutline className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Bytes
