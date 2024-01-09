import usePersistStore from '@lib/store/persist'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import {
  CogOutline,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from '@tape.xyz/ui'
import clsx from 'clsx'
import React from 'react'

const NotificationsFilter = () => {
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )
  const setSelectedNotificationsFilter = usePersistStore(
    (state) => state.setSelectedNotificationsFilter
  )

  return (
    <DropdownMenu trigger={<CogOutline className="size-4" />}>
      <DropdownMenuContent
        sideOffset={10}
        align="end"
        className="tape-border rounded-xl bg-white p-2 dark:bg-black"
      >
        <DropdownMenuItem
          onClick={() =>
            setSelectedNotificationsFilter(
              CustomNotificationsFilterEnum.HIGH_SIGNAL
            )
          }
        >
          <p
            className={clsx(
              'whitespace-nowrap',
              selectedNotificationsFilter ===
                CustomNotificationsFilterEnum.HIGH_SIGNAL && 'font-bold'
            )}
          >
            High signal
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            setSelectedNotificationsFilter(
              CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
            )
          }
        >
          <p
            className={clsx(
              'whitespace-nowrap',
              selectedNotificationsFilter ===
                CustomNotificationsFilterEnum.ALL_NOTIFICATIONS && 'font-bold'
            )}
          >
            Show all
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationsFilter
