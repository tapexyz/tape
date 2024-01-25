import useVerifiedStore from '@lib/store/idb/verified'
import { tw } from '@tape.xyz/browser'
import { MISUSED_CHANNELS } from '@tape.xyz/constants'
import { InfoSolid, Tooltip, VerifiedSolid } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const Badge: FC<Props> = ({ id, size = 'sm', color }) => {
  const verifiedProfiles = useVerifiedStore((state) => state.verifiedProfiles)
  const isVerified = verifiedProfiles.includes(id)
  const misused = MISUSED_CHANNELS.find((c) => c.id === id)

  return (
    <>
      {isVerified && (
        <Tooltip content="Verified" placement="top">
          <span>
            <VerifiedSolid
              className={tw(
                'text-brand-500 -mb-0.5 ml-0.5',
                {
                  'size-2.5': size === 'xs',
                  'size-3': size === 'sm',
                  'size-3.5': size === 'md',
                  'size-4': size === 'lg',
                  'size-5': size === 'xl'
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
              className={tw(
                'ml-0.5 text-red-500',
                {
                  'size-2.5': size === 'xs',
                  'size-3': size === 'sm',
                  'size-3.5': size === 'md',
                  'size-4': size === 'lg'
                },
                color
              )}
            />
          </span>
        </Tooltip>
      )}
    </>
  )
}

export default Badge
