import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

import ToggleDispatcher from './ToggleDispatcher'

const DispatcherPermissions = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const usingOldDispatcher = activeProfile?.lensManager === false

  const getDescription = () => {
    if (usingOldDispatcher) {
      return t`Enable your dispatcher to the latest version for better, faster signless transactions.`
    }
    return `Dispacher helps interact with ${TAPE_APP_NAME} without signing any of your transactions.`
  }

  return (
    <div className="flex flex-wrap items-center justify-end md:justify-between">
      <div className="mb-2 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          <Trans>Dispatcher</Trans>
        </h1>
        <p className="opacity-80">{getDescription()}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <ToggleDispatcher />
      </div>
    </div>
  )
}

export default DispatcherPermissions
