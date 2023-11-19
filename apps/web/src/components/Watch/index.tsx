import MetaTags from '@components/Common/MetaTags'
import { WatchShimmer } from '@components/Shimmers/WatchShimmer'
import {
  EVENTS,
  getPublication,
  getPublicationData,
  isWatchable,
  Tower
} from '@dragverse/generic'
import type { AnyPublication } from '@dragverse/lens'
import { usePublicationQuery } from '@dragverse/lens'
import { CustomCommentsFilterEnum } from '@dragverse/lens/custom-types'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/profile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import PublicationComments from '../Common/Publication/PublicationComments'
import AboutProfile from './AboutProfile'
import NonRelevantComments from './Comments/NonRelevantComments'
import SuggestedVideos from './SuggestedVideos'
import Video from './Video'

const VideoDetails = () => {
  const {
    query: { id, t: time }
  } = useRouter()

  const setVideoWatchTime = useAppStore((state) => state.setVideoWatchTime)
  const selectedCommentFilter = useProfileStore(
    (state) => state.selectedCommentFilter
  )

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.WATCH })
  }, [])

  useEffect(() => {
    setVideoWatchTime(Number(time))
  }, [time, setVideoWatchTime])

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  })

  if (loading || !data) {
    return <WatchShimmer />
  }

  if (error) {
    return <Custom500 />
  }

  const publication = data?.publication as AnyPublication
  const video = getPublication(publication)

  if (!isWatchable(video)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={getPublicationData(video?.metadata)?.title || `Watch`} />
      {!loading && !error && video ? (
        <div className="max-w-screen-ultrawide mx-auto grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <Video video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <AboutProfile video={video} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            <PublicationComments publication={video} />
            {selectedCommentFilter ===
            CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
              <NonRelevantComments video={video} />
            ) : null}
          </div>
          <div className="col-span-1">
            <SuggestedVideos />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default VideoDetails
