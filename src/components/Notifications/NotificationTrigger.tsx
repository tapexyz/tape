import { useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import useAppStore from '@lib/store'
import { NOTIFICATION_COUNT_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { AiOutlineBell } from 'react-icons/ai'

const Notifications = dynamic(() => import('.'))

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
    skip: !selectedChannel?.id
  })

  useEffect(() => {
    if (selectedChannel && notificationsData) {
      setHasNewNotification(
        notificationCount !==
          notificationsData?.notifications?.pageInfo?.totalCount
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
    setNotificationCount(notificationsData?.notifications?.pageInfo?.totalCount)
    setHasNewNotification(false)
  }

  return (
    <Popover
      trigger={
        <Button
          variant="outlined"
          className="!p-[9px] !hidden md:!block"
          onClick={() => onClickNotification()}
        >
          <AiOutlineBell className="text-sm md:text-lg" />
          {hasNewNotification && (
            <span className="absolute flex w-1.5 h-1.5 bg-red-500 rounded-full -top-1 -right-1" />
          )}
        </Button>
      }
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
