import HoverableProfile from '@components/Common/HoverableProfile'
import { getReadableTimeFromSeconds } from '@lib/formatTime'
import {
  getProfile,
  getProfilePicture,
  getPublicationData,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

type Props = {
  audio: PrimaryPublication
}

const Audio: FC<Props> = ({ audio }) => {
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata, true)),
    'SQUARE'
  )
  const metadata = getPublicationData(audio.metadata)
  const duration = metadata?.asset?.duration

  return (
    <div className="grid place-items-center gap-6 py-10 md:grid-cols-2">
      <div className="flex justify-center">
        <img
          src={coverUrl}
          className="rounded-small tape-border aspect-[1/1] w-3/4 object-cover"
          alt="audio cover"
          draggable={false}
        />
      </div>
      <div className="flex w-full flex-col items-center space-y-4 text-white lg:items-start">
        <h1 className="line-clamp-5 text-4xl font-bold leading-normal">
          {metadata?.title}
        </h1>
        <div className="flex items-center space-x-1">
          <div>
            <HoverableProfile
              profile={audio.by}
              fontSize="3"
              pfp={
                <img
                  src={getProfilePicture(audio.by, 'AVATAR')}
                  className="h-5 w-5 rounded-full"
                  draggable={false}
                  alt={getProfile(audio.by)?.displayName}
                />
              }
            />
          </div>
          <span className="middot" />
          <span className="text-sm">
            {getReadableTimeFromSeconds(String(duration))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Audio
