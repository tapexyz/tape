import { VERIFIED_CHANNELS } from '@lenstube/constants'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import Verified from './Icons/Verified'

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}

const IsVerified: FC<Props> = ({ id, size = 'sm', color }) => {
  if (!VERIFIED_CHANNELS.includes(id)) {
    return null
  }
  return (
    <div>
      <Verified
        className={clsx(
          'ml-0.5',
          {
            'h-2.5 w-2.5': size === 'xs',
            'h-3 w-3': size === 'sm',
            'h-3.5 w-3.5': size === 'md',
            'h-4 w-4': size === 'lg'
          },
          color
        )}
      />
    </div>
  )
}

export default IsVerified
