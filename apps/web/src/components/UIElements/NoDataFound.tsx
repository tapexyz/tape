import clsx from 'clsx'
import React from 'react'
import { FALLBACK_COVER_URL } from 'utils'
import imageCdn from 'utils/functions/imageCdn'

export const NoDataFound: React.FC<{
  text?: string
  withImage?: boolean
  isCenter?: boolean
}> = ({ text = 'No data found', withImage = false, isCenter = false }) => {
  return (
    <div
      className={clsx('flex flex-col space-y-1 rounded-lg p-6', {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          src={imageCdn(`${FALLBACK_COVER_URL}`, 'square')}
          className="w-32 md:w-36"
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
