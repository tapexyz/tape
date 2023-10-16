import Toggle from '@components/Settings/Permissions/Dispatcher/Toggle'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import { getIsDispatcherEnabled } from '@tape.xyz/generic'
import React from 'react'

const DispatcherAlert = () => {
  const activeChannel = useChannelStore((state) => state.activeChannel)

  const isDispatcherEnabled = getIsDispatcherEnabled(activeChannel)
  const usingOldDispatcher = activeChannel?.lensManager === false

  const getDescription = () => {
    if (usingOldDispatcher) {
      return t`Update your dispatcher to the latest version for better, faster signless transactions.`
    }
    return `You can enable dispatcher to interact with ${TAPE_APP_NAME} without signing any of your transactions.`
  }

  if (!activeChannel || isDispatcherEnabled) {
    return null
  }

  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="dark:to-bunker absolute inset-0 h-full w-full bg-gradient-to-b from-gray-100 dark:from-gray-900" />

      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left md:p-6">
        <div className="text-3xl">Action Required</div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          {getDescription()}
        </p>
        <div>
          <Toggle />
        </div>
      </div>

      <SignalWaveGraphic />
    </div>
  )
}

export default DispatcherAlert
