import { tw } from '@tape.xyz/browser'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import React from 'react'

export const NoDataFound = ({
  text = 'Zero trace!',
  withImage = false,
  isCenter = false,
  className = ''
}) => {
  return (
    <div
      className={tw('flex flex-col space-y-6 rounded-lg p-6', className, {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
          height={70}
          width={70}
          alt="zero trace!"
          draggable={false}
        />
      )}
      <div
        className={tw('text-sm font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
