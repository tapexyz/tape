import { STATIC_ASSETS } from '@tape.xyz/constants'
import { imageCdn } from '@tape.xyz/generic'
import clsx from 'clsx'
import React from 'react'

export const NoDataFound = ({
  text = 'Zero trace!',
  withImage = false,
  isCenter = false,
  className = ''
}) => {
  return (
    <div
      className={clsx('flex flex-col space-y-1 rounded-lg p-6', className, {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          src={imageCdn(
            `${STATIC_ASSETS}/mobile/icons/ice-cubes.png`,
            'AVATAR'
          )}
          className="w-24"
          alt="no results"
          draggable={false}
        />
      )}
      <div
        className={clsx('text-sm font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
