import Alert from '@components/Common/Alert'
import Toggle from '@components/Settings/Permissions/Dispatcher/Toggle'
import useAppStore from '@lib/store'
import { APP_NAME } from '@utils/constants'
import React from 'react'

const DispatcherAlert = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  if (!selectedChannel || selectedChannel?.dispatcher?.canUseRelay) {
    return null
  }

  return (
    <div className="flex-1 mb-4">
      <Alert variant="danger">
        <div className="flex flex-wrap items-center justify-end flex-1 space-y-3 md:space-y-0 md:justify-between">
          <span>
            Enable dispatcher to interact with {APP_NAME} without signing any of
            your transactions.
          </span>
          <Toggle />
        </div>
      </Alert>
    </div>
  )
}

export default DispatcherAlert
