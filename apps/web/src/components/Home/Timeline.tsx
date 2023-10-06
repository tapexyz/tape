import MirroredVideoCard from '@components/Channel/MirroredVideoCard'
import VideoCard from '@components/Common/VideoCard'
import QueuedVideo from '@components/Common/VideoCard/QueuedVideo'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { getPublication, trimLensHandle } from '@tape.xyz/generic'
import type { AnyPublication, Mirror } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  videos: AnyPublication[]
  videoType?: 'Post' | 'Mirror' | 'Comment'
}

const Timeline: FC<Props> = ({ videos, videoType = 'Post' }) => {
  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const isMirror = videoType === 'Mirror'
  const isChannelPage =
    location.pathname ===
    `/channel/${trimLensHandle(selectedSimpleProfile?.handle)}`

  return (
    <div className="laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8">
      {isChannelPage &&
        queuedVideos?.map((queuedVideo) => (
          <QueuedVideo
            key={queuedVideo?.thumbnailUrl}
            queuedVideo={queuedVideo}
          />
        ))}
      {videos?.map((video: AnyPublication, i) => {
        const isPub = video.__typename === videoType
        const targetPublication = getPublication(video)

        return isPub && isMirror ? (
          <MirroredVideoCard
            key={`${video?.id}_${i}`}
            video={video as Mirror}
          />
        ) : (
          isPub && (
            <VideoCard key={`${video?.id}_${i}`} video={targetPublication} />
          )
        )
      })}
    </div>
  )
}

export default Timeline
