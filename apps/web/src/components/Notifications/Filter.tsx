import CogOutline from '@components/Common/Icons/CogOutline'
import DropMenu from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import React from 'react'

const NotificationsFilter: React.FC = () => {
  // const selectedNotificationsFilter = usePersistStore(
  //   (state) => state.selectedNotificationsFilter
  // )
  // const setSelectedNotificationsFilter = usePersistStore(
  //   (state) => state.setSelectedNotificationsFilter
  // )

  return (
    <DropMenu
      trigger={<CogOutline className="h-4 w-4 opacity-70 hover:opacity-100" />}
    >
      <div className="bg-secondary mt-1 overflow-hidden rounded-xl border border-gray-200 p-1 text-sm shadow dark:border-gray-800">
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            'bg-gray-100 dark:bg-gray-800'
          )}
          onClick={
            () => {}
            // setSelectedNotificationsFilter(
            //   CustomNotificationsFilterEnum.HIGH_SIGNAL
            // )
          }
          as="button"
        >
          <span className="whitespace-nowrap">
            <Trans>High signal</Trans>
          </span>
        </Menu.Item>
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            'bg-gray-100 dark:bg-gray-800'
          )}
          onClick={
            () => {}
            // setSelectedNotificationsFilter(
            //   CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
            // )
          }
          as="button"
        >
          <span className="whitespace-nowrap">
            <Trans>Show all</Trans>
          </span>
        </Menu.Item>
      </div>
    </DropMenu>
  )
}

export default NotificationsFilter
