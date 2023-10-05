import ExploreOutline from '@components/Common/Icons/ExploreOutline'
import { Trans } from '@lingui/macro'
import React from 'react'

import Unlonely from './Unlonely'

const WhatsPopping = () => {
  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <ExploreOutline className="h-4 w-4" />
        <h1 className="text-xl font-semibold">
          <Trans>What's Popping?</Trans>
        </h1>
      </div>
      <div>
        <Unlonely />
      </div>
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default WhatsPopping
