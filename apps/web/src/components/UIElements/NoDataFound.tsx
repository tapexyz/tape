import clsx from 'clsx'
import React from 'react'
import { STATIC_ASSETS } from 'utils'
import imageCdn from 'utils/functions/imageCdn'

export const NoDataFound = ({
  text = 'No data found',
  withImage = false,
  isCenter = false
}) => {
  return (
    <div
      className={clsx('flex flex-col p-1 space-y-1 rounded-lg', {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          src={imageCdn(
            `${STATIC_ASSETS}/images/illustrations/no-results.png`,
            'square'
          )}
          className="w-32 my-4 md:w-36"
          alt="no results"
          draggable={false}
        />
      )}
      <div
        className={clsx('text-sm mb-2 font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
