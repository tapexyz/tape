import { useQuery } from '@apollo/client'
import Popover from '@components/UIElements/Popover'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { NOTIFICATION_COUNT_QUERY } from '@utils/gql/queries'
import React, { useEffect } from 'react'
import { CgBell } from 'react-icons/cg'

import Notifications from '.'

const NotificationTrigger = () => {
  const {
    selectedChannel,
    hasNewNotification,
    setHasNewNotification,
    notificationCount,
    setNotificationCount
  } = useAppStore()

  const { data: notificationsData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: selectedChannel?.id } },
    pollInterval: 50000,
    skip: !selectedChannel?.id
  })

  useEffect(() => {
    if (selectedChannel && notificationsData) {
      setHasNewNotification(
        notificationCount !==
          notificationsData?.notifications?.pageInfo?.totalCount.toString()
      )
      setNotificationCount(
        notificationsData?.notifications?.pageInfo?.totalCount
      )
    }
  }, [
    selectedChannel,
    notificationsData,
    notificationsData?.notifications?.pageInfo?.totalCount,
    notificationCount,
    setHasNewNotification,
    setNotificationCount
  ])

  const onClickNotification = () => {
    localStorage.setItem(
      'notificationCount',
      notificationsData?.notifications?.pageInfo?.totalCount.toString()
    )
  }
  return (
    <Popover
      trigger={
        <Tooltip className="!rounded-lg" content="Notifications">
          <button
            onClick={() => onClickNotification()}
            className="relative flex self-center p-2 rounded-md focus:outline-none hover:bg-white dark:hover:bg-gray-800"
          >
            <CgBell />
            {hasNewNotification && (
              <span className="absolute flex w-1.5 h-1.5 bg-red-500 rounded-full top-1 right-1" />
            )}
          </button>
        </Tooltip>
      }
      panelClassName="right-0"
    >
      <div className="p-1 max-h-96 mt-1.5 w-72 overflow-x-hidden overflow-y-auto border shadow-xl border-gray-100 rounded-lg dark:border-gray-800 bg-secondary">
        <div className="flex flex-col p-2 text-sm transition duration-150 ease-in-out rounded-lg">
          <Notifications />
        </div>
      </div>
    </Popover>
  )
}

export default NotificationTrigger
