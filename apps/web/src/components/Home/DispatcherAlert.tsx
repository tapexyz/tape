import Toggle from '@components/Settings/Permissions/Dispatcher/Toggle'
import useAppStore from '@lib/store'
import React from 'react'
import { HiOutlineSparkles } from 'react-icons/hi'
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
          <div className="flex text-black items-center px-3 py-1 space-x-1.5 text-xs font-medium rounded-full bg-gradient-to-br from-orange-200 to-orange-300">
            <HiOutlineSparkles className="text-base" />
            <span>Action Required</span>
          </div>
          <div className="flex flex-wrap items-center justify-between flex-1 w-full gap-y-3 dark:text-gray-100">
            <p className="text-sm lg:text-lg md:text-md">
              You can enable dispatcher to interact with {LENSTUBE_APP_NAME}{' '}
              without signing any of your transactions.
            </p>
            <Toggle />
          </div>
        </div>
        <div className="absolute top-0 right-0 flex items-center justify-center translate-x-2 opacity-60 md:opacity-100">
          <div className="absolute border-2 border-black rounded-full dark:border-white w-96 h-96 opacity-10" />
          <div className="absolute border-2 border-black rounded-full dark:border-white w-80 h-80 opacity-10" />
          <div className="absolute w-64 h-64 border-2 border-black rounded-full dark:border-white opacity-20" />
          <div className="absolute w-48 h-48 border-2 border-black rounded-full dark:border-white opacity-20" />
          <div className="absolute w-32 h-32 border-2 border-black rounded-full dark:border-white opacity-30" />
          <div className="absolute w-20 h-20 border-2 border-black rounded-full dark:border-white opacity-30" />
          <div className="absolute w-10 h-10 border-2 border-black rounded-full dark:border-white opacity-40" />
        </div>
      </div>
    </div>
  )
}

export default DispatcherAlert
