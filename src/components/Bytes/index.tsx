import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import { EXPLORE_QUERY } from '@utils/gql/queries'
import Head from 'next/head'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import ByteVideo from './ByteVideo'

const Bytes = () => {
  const { selectedChannel } = usePersistStore()
  const [bytes, setBytes] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: 'LATEST',
        limit: 5,
        noRandomize: false,
        sources: [LENSTUBE_BYTES_APP_ID],
        publicationTypes: ['POST']
      },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setBytes(data?.explorePublications?.items)
    }
  })

  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              sortCriteria: 'LATEST',
              cursor: pageInfo?.next,
              limit: 10,
              noRandomize: false,
              sources: [LENSTUBE_BYTES_APP_ID],
              publicationTypes: ['POST']
            }
          }
        })
        setPageInfo(data?.explorePublications?.pageInfo)
        setBytes([...bytes, ...data?.explorePublications?.items])
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
