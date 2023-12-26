import useProfileStore from '@lib/store/idb/profile'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

import ToggleLensManager from './ToggleLensManager'

const LensManager = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const getDescription = () => {
    if (!activeProfile?.signless) {
      return `Enable your Lens manager for seamless interaction with ${TAPE_APP_NAME}, allowing for faster and easier transactions without the need for signing.`
    }
    return `Lens manager helps interact with ${TAPE_APP_NAME} without signing any of your transactions.`
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-2 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Lens Manager</h1>
        <p className="opacity-80">{getDescription()}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <ToggleLensManager />
      </div>
    </div>
  )
}

export default LensManager
