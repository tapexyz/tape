import { useQuery } from '@apollo/client'
import Layout from '@components/common/Layout'
import MetaTags from '@components/common/MetaTags'
import { Loader } from '@components/ui/Loader'
import useAppStore from '@lib/store'
import { LENSTUBE_VIDEOS_APP_ID, ZERO_ADDRESS } from '@utils/constants'
import { VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { LenstubePublication } from 'src/types/local'

const SuggestedVideos = dynamic(() => import('./SuggestedVideos'))
const VideoComments = dynamic(() => import('./VideoComments'))
const AboutChannel = dynamic(() => import('./AboutChannel'))

const Video = dynamic(() => import('./Video'))

const VideoDetails = () => {
  const {
    query: { id }
  } = useRouter()
  const { selectedChannel } = useAppStore()
  const channelId = selectedChannel?.id ?? id?.toString().split('-')[0]
  const { data, error, loading } = useQuery(VIDEO_DETAIL_QUERY, {
    variables: {
      request: { publicationId: id },
      followRequest: {
        followInfos: {
          followerAddress: selectedChannel?.ownedBy ?? ZERO_ADDRESS,
          profileId: channelId
        }
      },
      sources: [LENSTUBE_VIDEOS_APP_ID]
    },
    skip: !id
  })

  const video = data?.publication as LenstubePublication
  if (error) return <Custom500 />
  if (video && video?.__typename !== 'Post') return <Custom404 />
  const isFollower = data?.doesFollow[0].follows as boolean

  return (
    <Layout>
      <MetaTags title={video?.metadata?.name ?? 'Video Details'} />
      {loading && <Loader />}
      {!loading && !error && video ? (
        <>
          <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
            <div className="col-span-3">
              <Video video={video} />
              <AboutChannel video={video} isFollower={isFollower} />
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
