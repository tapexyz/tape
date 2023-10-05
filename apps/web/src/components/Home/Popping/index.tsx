import BytesOutline from '@components/Common/Icons/BytesOutline'
import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import { Trans } from '@lingui/macro'
import React from 'react'

import Unlonely from './Unlonely'

const WhatsPopping = () => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BytesOutline className="h-4 w-4" />
          <h1 className="text-xl font-semibold">
            <Trans>What's Popping?</Trans>
          </h1>
        </div>
        <div className="flex justify-end space-x-3">
          <button className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none">
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none">
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        <Unlonely />
      </div>
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default WhatsPopping
