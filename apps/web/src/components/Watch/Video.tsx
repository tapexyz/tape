import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getVideoUrl } from 'utils/functions/getVideoUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('../Common/Player/VideoPlayer'), {
  loading: () => <CardShimmer />,
  ssr: false
})

type Props = {
  video: LenstubePublication
}

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)

  return (
    <div className="overflow-hidden">
      <VideoPlayer
        permanentUrl={getVideoUrl(video)}
        posterUrl={imageCdn(
          sanitizeIpfsUrl(video?.metadata?.cover?.original.url),
          'thumbnail'
        )}
        isSensitiveContent={isSensitiveContent}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-4 text-lg font-medium line-clamp-2">
            <InterweaveContent content={video.metadata?.name as string} />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
