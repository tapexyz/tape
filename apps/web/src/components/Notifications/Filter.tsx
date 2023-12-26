import CogOutline from '@components/Common/Icons/CogOutline'
import usePersistStore from '@lib/store/persist'
import { Box, DropdownMenu, Text } from '@radix-ui/themes'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import React from 'react'

const NotificationsFilter = () => {
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )
  const setSelectedNotificationsFilter = usePersistStore(
    (state) => state.setSelectedNotificationsFilter
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Box>
          <CogOutline className="size-4" />
        </Box>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={10} variant="soft">
        <DropdownMenu.Item
          onClick={() =>
            setSelectedNotificationsFilter(
              CustomNotificationsFilterEnum.HIGH_SIGNAL
            )
          }
        >
          <Text
            className="whitespace-nowrap"
            weight={
              selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.HIGH_SIGNAL
                ? 'bold'
                : 'regular'
            }
          >
            High signal
          </Text>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() =>
            setSelectedNotificationsFilter(
              CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
            )
          }
        >
          <Text
            className="whitespace-nowrap"
            weight={
              selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
                ? 'bold'
                : 'regular'
            }
          >
            Show all
          </Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default NotificationsFilter
