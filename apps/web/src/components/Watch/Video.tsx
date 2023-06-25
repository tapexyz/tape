import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import useAppStore from '@lib/store'
import useChannelStore from '@lib/store/channel'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import {
  getPublicationHlsUrl,
  getPublicationRawMediaUrl
} from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('web-ui/VideoPlayer'), {
  loading: () => <CardShimmer rounded={false} />,
  ssr: false
})

type Props = {
  video: Publication
}

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  const refCallback = (ref: HTMLMediaElement) => {
    if (ref) {
      ref.autoplay = true
    }
  }

  return (
    <div className="overflow-hidden">
      <VideoPlayer
        address={selectedChannel?.ownedBy}
        refCallback={refCallback}
        currentTime={videoWatchTime}
        permanentUrl={getPublicationRawMediaUrl(video)}
        hlsUrl={getPublicationHlsUrl(video)}
        posterUrl={thumbnailUrl}
        options={{
          loadingSpinner: true,
          isCurrentlyShown: true
        }}
        isSensitiveContent={isSensitiveContent}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="mt-4 line-clamp-2 text-lg font-medium"
            data-testid="watch-video-title"
          >
            <InterweaveContent content={video.metadata?.name as string} />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default React.memo(Video)
