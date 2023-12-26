import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  getIsSensitiveContent,
  getPublicationData,
  getPublicationMediaUrl,
  getShouldUploadVideo,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import dynamic from 'next/dynamic'
import React from 'react'

import PublicationActions from '../Common/Publication/PublicationActions'
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
  const { activeProfile } = useProfileStore()

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const videoUrl = getPublicationMediaUrl(video.metadata)

  const refCallback = (ref: HTMLMediaElement) => {
    if (ref) {
      ref.autoplay = true
    }
  }

  return (
    <div>
      <div className="rounded-large overflow-hidden">
        <VideoPlayer
          address={activeProfile?.ownedBy.address}
          currentTime={videoWatchTime}
          isSensitiveContent={isSensitiveContent}
          options={{
            isCurrentlyShown: true,
            loadingSpinner: true
          }}
          posterUrl={thumbnailUrl}
          refCallback={refCallback}
          shouldUpload={getShouldUploadVideo(video)}
          url={videoUrl}
        />
      </div>
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="mt-4 line-clamp-2 font-bold md:text-xl">
            <InterweaveContent
              content={getPublicationData(video.metadata)?.title || ''}
            />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <PublicationActions publication={video} />
    </div>
  )
}

export default React.memo(Video)
