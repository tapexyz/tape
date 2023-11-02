import ToggleDispatcher from '@components/Settings/Manager/Dispatcher/ToggleDispatcher'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import useProfileStore from '@lib/store/profile'
import { Flex } from '@radix-ui/themes'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import {
  checkDispatcherPermissions,
  getIsProfileOwner
} from '@tape.xyz/generic'
import React from 'react'
import { useAccount } from 'wagmi'

const DispatcherAlert = () => {
  const { address } = useAccount()
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const isOwner = activeProfile && getIsProfileOwner(activeProfile, address)
  const { canUseLensManager } = checkDispatcherPermissions(activeProfile)

  const getDescription = () => {
    return `Enable dispatcher to interact with ${TAPE_APP_NAME} without signing any of your transactions.`
  }

  if (!activeProfile || canUseLensManager || !isOwner) {
    return null
  }

  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="dark:to-bunker absolute inset-0 h-full w-full bg-gradient-to-b from-gray-100 dark:from-gray-900" />

      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left md:p-6">
        <div className="text-3xl font-bold">Action Required</div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          {getDescription()}
        </p>
        <Flex>
          <ToggleDispatcher />
        </Flex>
      </div>

      <SignalWaveGraphic />
    </div>
  )
}

export default DispatcherAlert
