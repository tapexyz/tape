import HandWaveOutline from '@components/Common/Icons/HandWaveOutline'
import Toggle from '@components/Settings/Permissions/Dispatcher/Toggle'
import SignalWave from '@components/UIElements/SignalWave'
import useAppStore from '@lib/store'
import React from 'react'
import { LENSTUBE_APP_NAME } from 'utils'

const DispatcherAlert = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  if (!selectedChannel || selectedChannel?.dispatcher?.canUseRelay) {
    return null
  }

  return (
    <div className="w-full mb-4">
      <div className="relative flex flex-col p-6 overflow-hidden lg:p-8 rounded-xl">
        <div className="absolute inset-0 w-full h-full bg-gray-100 bg-gradient-to-b dark:from-gray-800 dark:to-gray-900" />
        <div className="relative z-[1] flex flex-col items-start space-y-4 text-left">
          <div className="flex text-black items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-br from-orange-200 to-orange-300">
            <HandWaveOutline className="w-3.5 h-3.5" />
            <span className="ml-1">Action Required</span>
          </div>
          <div className="flex flex-wrap items-center justify-between flex-1 w-full gap-y-3 dark:text-gray-100">
            <p className="text-sm lg:text-lg md:text-md">
              You can enable dispatcher to interact with {LENSTUBE_APP_NAME}{' '}
              without signing any of your transactions.
            </p>
            <Toggle />
          </div>
        </div>
        <SignalWave />
      </div>
    </div>
  )
}

export default DispatcherAlert
