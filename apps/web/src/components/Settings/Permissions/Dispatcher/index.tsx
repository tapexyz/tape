import {
  LENSTUBE_APP_NAME,
  OLD_LENS_RELAYER_ADDRESS
} from '@lenstube/constants'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import React from 'react'

import Toggle from './Toggle'

const DispatcherPermissions = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const usingOldDispatcher =
    selectedChannel?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()

  const getDescription = () => {
    if (usingOldDispatcher) {
      return t`Upgrade your dispatcher to the latest version for better, faster, stronger signless transactions.`
    }
    return `Dispacher helps interact with ${LENSTUBE_APP_NAME} without signing any of your transactions.`
  }

  return (
    <div className="flex flex-wrap items-center justify-end md:justify-between">
      <div className="mb-2">
        <h1 className="mb-1 text-xl font-semibold">
          <Trans>Dispatcher</Trans>
        </h1>
        <p className="opacity-80">{getDescription()}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <Toggle />
      </div>
    </div>
  )
}

export default DispatcherPermissions
