import Tooltip from '@components/UIElements/Tooltip'
import { MISUSED_CHANNELS, VERIFIED_CHANNELS } from '@lenstube/constants'
import { t } from '@lingui/macro'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import InfoSolid from './Icons/InfoSolid'
import VerifiedSolid from './Icons/VerifiedSolid'

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
}

const Badge: FC<Props> = ({ id, size = 'sm', color }) => {
  const isVerified = VERIFIED_CHANNELS.includes(id)
  const misused = MISUSED_CHANNELS.find((c) => c.id === id)

  return (
    <div>
      {isVerified && (
        <Tooltip content={t`Verified`} placement="top">
          <span>
            <VerifiedSolid
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
          </span>
        </Tooltip>
      )}
      {misused?.id && (
        <Tooltip content={misused.type} placement="right">
          <span>
            <InfoSolid
              className={clsx(
                'ml-0.5 text-red-500',
                {
                  'h-2.5 w-2.5': size === 'xs',
                  'h-3 w-3': size === 'sm',
                  'h-3.5 w-3.5': size === 'md',
                  'h-4 w-4': size === 'lg'
                },
                color
              )}
            />
          </span>
        </Tooltip>
      )}
    </div>
  )
}

export default Badge
