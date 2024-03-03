import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const BottomOverlay: FC<Props> = ({ video }) => {
  const profile = video.by

  return (
    <div className="rounded-b-large absolute bottom-0 left-0 right-0 z-[1] bg-gradient-to-b from-transparent to-black px-3 pb-3 pt-5">
      <h1 className="line-clamp-2 break-all pb-2 font-bold text-white">
        {getPublicationData(video.metadata)?.title}
      </h1>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href={`/u/${getProfile(video.by)?.slug}?tab=bytes`}
            className="flex flex-none cursor-pointer items-center space-x-2"
          >
            <img
              src={getProfilePicture(profile, 'AVATAR')}
              className="size-9 rounded-full"
              draggable={false}
              alt={getProfile(video.by)?.slug}
            />
            <div className="flex min-w-0 flex-col items-start text-white">
              <h6 className="flex max-w-full items-center space-x-1">
                <span className="truncate">{getProfile(video.by)?.slug}</span>
                <Badge
                  id={profile?.id}
                  color="text-gray-300 dark:text-gray-300"
                />
              </h6>
              <span className="inline-flex items-center space-x-1 text-xs">
                {formatNumber(profile?.stats.followers)} followers
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <FollowActions profile={profile} />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
