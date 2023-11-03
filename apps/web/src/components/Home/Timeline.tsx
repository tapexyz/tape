import VideoCard from '@components/Common/VideoCard'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  videos: AnyPublication[]
}

const Timeline: FC<Props> = ({ videos }) => {
  return (
    <div className="ultrawide:grid-cols-6 grid-col-1 desktop:grid-cols-4 tablet:grid-cols-3 grid gap-x-4 gap-y-2 md:gap-y-6">
      {videos?.map((video: AnyPublication, i) => {
        const targetPublication = getPublication(video)
        return <VideoCard key={`${video?.id}_${i}`} video={targetPublication} />
      })}
    </div>
  )
}

export default Timeline
