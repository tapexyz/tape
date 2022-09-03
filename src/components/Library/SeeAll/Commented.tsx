import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { PROFILE_FEED_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { AiOutlineComment } from 'react-icons/ai'
import { PaginatedResultInfo, PublicationTypes } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const Timeline = dynamic(() => import('../../Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const SeeAllCommented = () => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const [commentedVideos, setCommentedVideos] = useState<LenstubePublication[]>(
    []
  )
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: [PublicationTypes.Comment],
        profileId: selectedChannel?.id,
        limit: 12,
        sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
      }
    },
    skip: !selectedChannel?.id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setCommentedVideos(data?.publications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              publicationTypes: [PublicationTypes.Comment],
              profileId: selectedChannel?.id,
              cursor: pageInfo?.next,
              limit: 12,
              sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
            }
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setCommentedVideos([...commentedVideos, ...data?.publications?.items])
      } catch (error) {
        logger.error('[Error Fetch See All Commented]', error)
      }
    }
  })

  return (
    <>
      <MetaTags title="Commented Videos" />
      <div className="flex flex-col space-y-4 md:mb-4">
        <div className="flex items-center justify-between">
          <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
            <AiOutlineComment />
            <span>Commented Videos</span>
          </h1>
        </div>
        {(data?.publications?.items?.length === 0 || !selectedChannelId) && (
          <NoDataFound text="No comments on videos" isCenter withImage />
        )}
        {loading && <TimelineShimmer />}
        {!error && !loading && (
          <>
            <Timeline videos={commentedVideos} />
            {pageInfo?.next && commentedVideos.length !== pageInfo?.totalCount && (
              <span ref={observe} className="flex justify-center p-10">
                <Loader />
              </span>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default SeeAllCommented
