import Badge from '@components/Common/Badge'
import { formatNumber } from '@dragverse/generic'
import { Avatar } from '@radix-ui/themes'
import clsx from 'clsx'
import type { FC } from 'react'

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
    <div className={clsx('flex space-x-2 truncate px-1.5 py-1.5', className)}>
      <Avatar
        src={pfp}
        size="2"
        radius="full"
        className="mt-1 h-6 w-6 rounded-full"
        fallback={handle[0]}
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
