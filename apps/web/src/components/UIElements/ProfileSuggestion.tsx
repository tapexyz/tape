import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import { Avatar } from '@radix-ui/themes'
import { formatNumber } from '@tape.xyz/generic'
import clsx from 'clsx'
import React from 'react'

type Props = {
  className?: string
  followers: number
  handle: string
  id: string
  pfp: string
}

const ProfileSuggestion: FC<Props> = ({
  className,
  followers,
  handle,
  id,
  pfp
}) => {
  return (
    <div className={clsx('flex space-x-2 truncate px-1.5 py-1.5', className)}>
      <Avatar
        alt={handle}
        className="mt-1 size-6 rounded-full"
        draggable={false}
        fallback={handle[0]}
        radius="full"
        size="2"
        src={pfp}
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
