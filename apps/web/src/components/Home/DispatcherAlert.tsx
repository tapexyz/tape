import HandWaveOutline from '@components/Common/Icons/HandWaveOutline'
import Toggle from '@components/Settings/Permissions/Dispatcher/Toggle'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import useChannelStore from '@lib/store/channel'
import React from 'react'
import { LENSTUBE_APP_NAME } from 'utils'
import getIsDispatcherEnabled from 'utils/functions/getIsDispatcherEnabled'

const DispatcherAlert = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const isDispatcherEnabled = getIsDispatcherEnabled(selectedChannel)

  if (!selectedChannel || isDispatcherEnabled) {
    return null
  }

  return (
    <div className="mb-4 w-full">
      <div className="relative flex flex-col overflow-hidden rounded-xl p-6 lg:p-8">
        <div className="absolute inset-0 h-full w-full bg-gray-100 bg-gradient-to-b dark:from-gray-800 dark:to-gray-900" />
        <div className="relative z-[1] flex flex-col items-start space-y-4 text-left">
          <div className="flex items-center rounded-full bg-gradient-to-br from-orange-200 to-orange-300 px-3 py-1 text-xs font-medium text-black">
            <HandWaveOutline className="h-3.5 w-3.5" />
            <span className="ml-1">Action Required</span>
          </div>
          <div className="flex w-full flex-1 flex-wrap items-center justify-between gap-y-3 dark:text-gray-100">
            <p className="md:text-md text-sm lg:text-lg">
              You can enable dispatcher to interact with {LENSTUBE_APP_NAME}{' '}
              without signing any of your transactions.
            </p>
            <Toggle />
          </div>
        </div>
        <SignalWaveGraphic />
      </div>
    </div>
  )
}

export default DispatcherAlert
