import { VERIFIED_CHANNELS } from '@utils/data/verified'
import clsx from 'clsx'
import React, { FC } from 'react'
import { MdVerified } from 'react-icons/md'

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'lg'
  color?: string
}

const IsVerified: FC<Props> = ({ id, size = 'sm', color }) => {
  if (!VERIFIED_CHANNELS.includes(id)) return null
  return (
    <div>
      <MdVerified
        className={clsx(
          'text-gray-600 dark:text-gray-400',
          {
            'text-xs': size === 'xs',
            'text-sm': size === 'sm',
            'text-lg': size === 'lg'
          },
          color
        )}
      />
    </div>
  )
}

export default IsVerified
