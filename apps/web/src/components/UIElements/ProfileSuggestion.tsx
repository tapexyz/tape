import Badge from '@components/Common/Badge'
import { tw } from '@tape.xyz/browser'
import { formatNumber } from '@tape.xyz/generic'
import type { FC } from 'react'
import React from 'react'

type Props = {
  className?: string
  pfp: string
  handle: string
  id: string
  followers: number
}

const ProfileSuggestion: FC<Props> = ({
  className,
  pfp,
  handle,
  id,
  followers
}) => {
  return (
    <div className={tw('flex space-x-2 truncate px-1.5 py-1.5', className)}>
      <img
        src={pfp}
        className="mt-1 size-8 rounded-full"
        draggable={false}
        alt={handle}
      />
      <div className="overflow-hidden">
        <div className="flex items-center space-x-0.5">
          <p className="truncate text-sm font-medium leading-4">{handle}</p>
          <Badge id={id} size="xs" />
        </div>
        <span className="text-xs opacity-80">
          {formatNumber(followers)} followers
        </span>
      </div>
    </div>
  )
}

export default ProfileSuggestion
