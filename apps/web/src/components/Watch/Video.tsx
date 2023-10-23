import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  getIsSensitiveContent,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('@tape.xyz/ui/VideoPlayer'), {
  loading: () => <CardShimmer rounded={false} />,
  ssr: false
})

type Props = {
  video: PrimaryPublication
}

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )

  const refCallback = (ref: HTMLMediaElement) => {
    if (ref) {
      ref.autoplay = true
    }
  }

  return (
    <div>
      <div className="rounded-large overflow-hidden">
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
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="mt-4 line-clamp-2 text-xl font-medium">
            <InterweaveContent
              content={getPublicationData(video.metadata)?.title || ''}
            />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default React.memo(Video)
