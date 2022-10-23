import { useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import DropMenu from '@components/UIElements/DropMenu'
import { NOTIFICATION_COUNT_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'
import React, { useEffect } from 'react'
import { CgBell } from 'react-icons/cg'

import Notifications from '.'

const NotificationTrigger = () => {
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )
  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const notificationCount = usePersistStore((state) => state.notificationCount)
  const setNotificationCount = usePersistStore(
    (state) => state.setNotificationCount
  )

  const { data: notificationsData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    skip: !selectedChannel?.id
  })

  useEffect(() => {
    if (selectedChannel && notificationsData) {
      const currentCount =
        notificationsData?.notifications?.pageInfo?.totalCount
      setHasNewNotification(notificationCount !== currentCount)
      setNotificationCount(
        notificationsData?.notifications?.pageInfo?.totalCount
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel, notificationsData])

  const onClickNotification = () => {
    setNotificationCount(notificationsData?.notifications?.pageInfo?.totalCount)
    setHasNewNotification(false)
  }

  if (!selectedChannelId) return null

  return (
    <DropMenu
      trigger={
        <Button
          variant="outlined"
          className="!p-[9px] !hidden md:!block"
          onClick={() => onClickNotification()}
        >
          <CgBell className="text-lg" />
          {hasNewNotification && (
            <span className="absolute flex w-1.5 h-1.5 bg-red-500 rounded-full -top-1 -right-1" />
          )}
        </Button>
      }
    >
      <div className="p-1 max-h-96 md:block hidden mt-1.5 w-80 overflow-x-hidden overflow-y-auto border shadow-xl border-gray-100 rounded-lg dark:border-gray-800 bg-secondary">
        <div className="flex flex-col p-2 text-sm transition duration-150 ease-in-out rounded-lg">
          <Notifications />
        </div>
      </div>
    </DropMenu>
  )
}

export default NotificationTrigger
