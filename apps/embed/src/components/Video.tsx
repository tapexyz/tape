import { usePublicationDetailsQuery } from 'lens'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubePublication } from 'utils'
import { Analytics, TRACK } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import truncate from 'utils/functions/truncate'

import MetaTags from './MetaTags'
import Shimmer from './Shimmer'
import VideoOverlay from './VideoOverlay'

const VideoPlayer = dynamic(() => import('web-ui/VideoPlayer'), {
  ssr: false
})

const Video: FC = () => {
  const { query } = useRouter()
  const publicationId = query.pubId

  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId }
    },
    skip: !publicationId
  })

  const video = data?.publication as LenstubePublication
  const isSensitiveContent = getIsSensitiveContent(video?.metadata, video?.id)
  const publicationType = video?.__typename

  const canWatch =
    video &&
    publicationType &&
    ['Post', 'Comment'].includes(publicationType) &&
    !video?.hidden

  if (error) {
    return (
      <div className="grid h-screen place-items-center text-white">
        <span>Failed to load video!</span>
      </div>
    )
  }
  if (loading || !data) return <Shimmer />
  if (!canWatch) {
    return (
      <div className="grid h-screen place-items-center text-white">
        <span>404 - Not found</span>
      </div>
    )
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    ref.onpause = () => {
      setShowVideoOverlay(true)
    }
    ref.onplay = () => {
      setShowVideoOverlay(false)
    }
  }

  return (
    <div className="relative w-screen h-screen">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={imageCdn(getThumbnailUrl(video), 'thumbnail')}
        videoUrl={getPublicationMediaUrl(video)}
      />
      <div className="relative group">
        <VideoPlayer
          refCallback={refCallback}
          permanentUrl={getPublicationMediaUrl(video)}
          isSensitiveContent={isSensitiveContent}
          posterUrl={imageCdn(
            sanitizeIpfsUrl(getThumbnailUrl(video)),
            'thumbnail'
          )}
          publicationId={video.id}
          options={{ autoPlay: isAutoPlay, muted: isAutoPlay, loop: true }}
        />
        {!isSensitiveContent && (
          <div
            className={`${
              showVideoOverlay ? 'block' : 'hidden'
            } group-hover:block`}
          >
            <VideoOverlay video={video} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Video
