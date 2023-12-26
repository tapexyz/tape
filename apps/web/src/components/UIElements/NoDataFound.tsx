import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import React from 'react'

export const NoDataFound = ({
  className = '',
  isCenter = false,
  text = 'Zero trace!',
  withImage = false
}) => {
  return (
    <div
      className={clsx('flex flex-col space-y-6 rounded-lg p-6', className, {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          alt="zero trace!"
          draggable={false}
          height={70}
          src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
          width={70}
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
