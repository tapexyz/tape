import BellOutline from '@components/Common/Icons/BellOutline'
import DropMenu from '@components/UIElements/DropMenu'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import React from 'react'
import { Analytics, TRACK } from 'utils'

import Notifications from '.'

const NotificationTrigger = () => {
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )
  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

  const onClickNotification = () => {
    Analytics.track(TRACK.NOTIFICATIONS.CLICK_NOTIFICATIONS)
    setHasNewNotification(false)
  }

  if (!selectedChannelId) return null

  return (
    <DropMenu
      trigger={
        <button
          className="btn-hover p-2.5"
          onClick={() => onClickNotification()}
        >
          <BellOutline className="h-4 w-4" />
          {hasNewNotification && (
            <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5 rounded-full bg-red-500" />
          )}
        </button>
      }
    >
      <div className="bg-secondary mt-1.5 hidden max-h-96 w-80 overflow-y-auto overflow-x-hidden rounded-lg border border-gray-100 p-1 shadow-xl dark:border-gray-800 md:block">
        <div className="flex flex-col rounded-lg p-2 text-sm transition duration-150 ease-in-out">
          <Notifications />
        </div>
      </div>
    </DropMenu>
  )
}

export default NotificationTrigger
