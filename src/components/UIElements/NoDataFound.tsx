import { STATIC_ASSETS } from '@utils/constants'
import imageCdn from '@utils/functions/imageCdn'
import React from 'react'

export const NoDataFound = ({ text = 'No data found', withImage = false }) => {
  return (
    <div className="flex flex-col items-center justify-center p-1 space-y-1 rounded-lg">
      {withImage && (
        <img
          src={imageCdn(`${STATIC_ASSETS}/images/illustrations/empty.png`)}
          className="w-32 my-4 md:w-36"
          alt=""
          draggable={false}
        />
      )}
      <div className="text-sm font-medium text-center">{text}</div>
    </div>
  )
}
