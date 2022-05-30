import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

export const Loader = () => {
  return (
    <div className="border-0">
      <div className="grid p-5 space-y-2 justify-items-center">
        <LoaderIcon className="!h-5 !w-5" />
      </div>
    </div>
  )
}
