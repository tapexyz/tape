import { APP_NAME } from '@utils/constants'
import React from 'react'

import Toggle from './Toggle'

const DispatcherPermissions = () => {
  return (
    <div>
      <div className="mb-2">
        <h1 className="mb-1 text-xl font-semibold">Dispatcher</h1>
        <p className="opacity-80">
          Interact with {APP_NAME} without signing any of your transactions.
        </p>
      </div>
      <div className="flex justify-end mt-3">
        <Toggle />
      </div>
    </div>
  )
}

export default DispatcherPermissions
