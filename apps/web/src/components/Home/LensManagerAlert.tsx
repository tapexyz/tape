import ToggleLensManager from '@components/Settings/Manager/LensManager/ToggleLensManager'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import useProfileStore from '@lib/store/idb/profile'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getIsProfileOwner
} from '@tape.xyz/generic'
import React from 'react'
import { useAccount } from 'wagmi'

const LensManagerAlert = () => {
  const { address } = useAccount()
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const isOwner = activeProfile && getIsProfileOwner(activeProfile, address)
  const { canUseLensManager } = checkLensManagerPermissions(activeProfile)

  const getDescription = () => {
    return `Enable your Lens manager for seamless interaction with ${TAPE_APP_NAME}, allowing for faster and easier transactions without the need for signing.`
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
        <div className="flex">
          <ToggleLensManager />
        </div>
      </div>

      <SignalWaveGraphic />
    </div>
  )
}

export default LensManagerAlert
