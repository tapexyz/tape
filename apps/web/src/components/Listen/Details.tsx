import HoverableProfile from '@components/Common/HoverableProfile'
import InterweaveContent from '@components/Common/InterweaveContent'
import VideoComments from '@components/Watch/Comments/VideoComments'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  audio: PrimaryPublication
}

const Details: FC<Props> = ({ audio }) => {
  const metadata = getPublicationData(audio.metadata)

  return (
    <div className="px-4 py-10 lg:px-0">
      <h1 className="laptop:text-2xl text-xl font-bold">Artist</h1>
      <div className="mt-2">
        <HoverableProfile
          profile={audio.by}
          fontSize="5"
          pfp={
            <img
              src={getProfilePicture(audio.by, 'AVATAR')}
              className="h-7 w-7 rounded-full"
              draggable={false}
              alt={getProfile(audio.by)?.displayName}
            />
          }
        />
      </div>
      {metadata?.content && (
        <div className="mt-6">
          <h1 className="laptop:text-2xl text-xl font-bold">Description</h1>
          <div className="mt-2">
            <InterweaveContent content={metadata?.content} />
          </div>
        </div>
      )}
      <div className="mt-6">
        <VideoComments video={audio} />
      </div>
    </div>
  )
}

export default Details
