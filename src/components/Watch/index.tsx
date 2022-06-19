import { useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import VideoDetailShimmer from '@components/Shimmers/VideoDetailShimmer'
import useAppStore from '@lib/store'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { LenstubePublication } from 'src/types/local'

const SuggestedVideos = dynamic(() => import('./SuggestedVideos'))
const VideoComments = dynamic(() => import('./VideoComments'))
const AboutChannel = dynamic(() => import('./AboutChannel'))

const Video = dynamic(() => import('./Video'), {
  loading: () => <VideoCardShimmer />
})

const VideoDetails = () => {
  const {
    query: { id }
  } = useRouter()
  const { selectedChannel, addToRecentlyWatched, isAuthenticated } =
    useAppStore()
  const { data, error, loading, refetch } = useQuery(VIDEO_DETAIL_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      sources: [LENSTUBE_APP_ID]
    },
    skip: !id
  })
  const video = data?.publication as LenstubePublication

  useEffect(() => {
    refetch({
      request: { publicationId: id },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      sources: [LENSTUBE_APP_ID]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    if (video) addToRecentlyWatched(video)
  }, [video, addToRecentlyWatched])

  if (error) return <Custom500 />
  if (loading || !data)
    return (
      <Layout>
        <VideoDetailShimmer />
      </Layout>
    )
  if (!data?.publication && video?.__typename !== 'Post') return <Custom404 />

  return (
    <Layout>
      <MetaTags title={video?.metadata?.name ?? 'Watch'} />
      {!loading && !error && video ? (
        <>
          <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
            <div className="col-span-3 space-y-3 divide-y divide-gray-200 dark:divide-gray-900">
              <Video video={video} />
              <AboutChannel video={video} />
              <VideoComments video={video} />
            </div>
            <div className="col-span-1">
              <SuggestedVideos />
            </div>
          </div>
        </>
      ) : null}
    </Layout>
  )
}

export default VideoDetails
