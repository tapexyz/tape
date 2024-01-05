import usePersistStore from '@lib/store/persist'
import { Box, DropdownMenu, Text } from '@radix-ui/themes'
import { CustomNotificationsFilterEnum } from '@tape.xyz/lens/custom-types'
import { CogOutline } from '@tape.xyz/ui'
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
      <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
        <DropdownMenu.Item
          onClick={() =>
            setSelectedNotificationsFilter(
              CustomNotificationsFilterEnum.HIGH_SIGNAL
            )
          }
        >
          <Text
            weight={
              selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.HIGH_SIGNAL
                ? 'bold'
                : 'regular'
            }
            className="whitespace-nowrap"
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
            weight={
              selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
                ? 'bold'
                : 'regular'
            }
            className="whitespace-nowrap"
          >
            Show all
          </Text>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default NotificationsFilter
