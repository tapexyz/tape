import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import {
  getIsSensitiveContent,
  getPublication,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { MirrorablePublication } from '@lenstube/lens'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('@lenstube/ui/VideoPlayer'), {
  loading: () => <CardShimmer rounded={false} />,
  ssr: false
})

type Props = {
  video: MirrorablePublication
}

const Video: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video)
  const isSensitiveContent = getIsSensitiveContent(
    targetPublication.metadata,
    targetPublication.id
  )
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const isBytesVideo =
    targetPublication.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(targetPublication, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  const refCallback = (ref: HTMLMediaElement) => {
    if (ref) {
      ref.autoplay = true
    }
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl">
        <VideoPlayer
          address={selectedSimpleProfile?.ownedBy.address}
          refCallback={refCallback}
          currentTime={videoWatchTime}
          url={getPublicationMediaUrl(video.metadata)}
          posterUrl={thumbnailUrl}
          options={{
            loadingSpinner: true,
            isCurrentlyShown: true
          }}
          isSensitiveContent={isSensitiveContent}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="mt-4 line-clamp-2 text-lg font-medium"
            data-testid="watch-video-title"
          >
            <InterweaveContent
              content={targetPublication.metadata.marketplace?.name as string}
            />
          </h1>
          <VideoMeta video={targetPublication} />
        </div>
      </div>
      <VideoActions video={targetPublication} />
    </div>
  )
}

export default React.memo(Video)
