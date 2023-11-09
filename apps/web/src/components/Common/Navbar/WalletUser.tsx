import getCurrentSessionId from '@lib/getCurrentSessionId'
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId'
import { signOut } from '@lib/store/auth'
import { Avatar, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import {
  EVENTS,
  getRandomProfilePicture,
  shortenAddress,
  Tower
} from '@tape.xyz/generic'
import { useRevokeAuthenticationMutation } from '@tape.xyz/lens'
import { useTheme } from 'next-themes'
import React from 'react'
import { useDisconnect } from 'wagmi'

import HandWaveOutline from '../Icons/HandWaveOutline'
import MoonOutline from '../Icons/MoonOutline'
import SunOutline from '../Icons/SunOutline'
import AddressExplorerLink from '../Links/AddressExplorerLink'

const WalletUser = () => {
  const { theme, setTheme } = useTheme()
  const addressOfCurrentUser = getCurrentSessionProfileId()
  const { disconnect } = useDisconnect()
  const [revokeAuthentication, { loading }] = useRevokeAuthenticationMutation()

  const onClickSignout = async () => {
    disconnect?.()
    signOut()
    await revokeAuthentication({
      variables: {
        request: { authorizationId: getCurrentSessionId() }
      }
    })
    Tower.track(EVENTS.AUTH.SIGN_OUT)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="ring-brand-500 flex rounded-full hover:ring-2">
          <Avatar
            size="2"
            radius="full"
            src={getRandomProfilePicture(addressOfCurrentUser)}
            fallback={shortenAddress(addressOfCurrentUser)[0] ?? ';)'}
            alt={shortenAddress(addressOfCurrentUser)}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
        <div className="w-48">
          <AddressExplorerLink address={addressOfCurrentUser}>
            <Flex gap="2" px="2" py="1" align="center">
              <Avatar
                size="1"
                radius="full"
                src={getRandomProfilePicture(addressOfCurrentUser)}
                fallback={shortenAddress(addressOfCurrentUser)[0] ?? ';)'}
                alt={shortenAddress(addressOfCurrentUser)}
              />
              <Text as="p" weight="bold" className="line-clamp-1">
                {shortenAddress(addressOfCurrentUser)}
              </Text>
            </Flex>
          </AddressExplorerLink>

          <DropdownMenu.Separator />
          <DropdownMenu.Item
            onClick={() => {
              const selected = theme === 'dark' ? 'light' : 'dark'
              setTheme(selected)
              Tower.track(EVENTS.SYSTEM.TOGGLE_THEME, {
                selected_theme: selected
              })
            }}
          >
            <Flex align="center" gap="2">
              {theme === 'dark' ? (
                <SunOutline className="h-4 w-4" />
              ) : (
                <MoonOutline className="h-4 w-4" />
              )}
              <Text as="p" className="truncate whitespace-nowrap">
                {theme === 'light' ? `Switch to Dark` : `Switch to Light`}
              </Text>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            asChild
            disabled={loading}
            color="red"
            onClick={() => onClickSignout()}
          >
            <Flex align="center" gap="2">
              <HandWaveOutline className="h-4 w-4" />
              <Text as="p" className="truncate whitespace-nowrap">
                Sign out
              </Text>
            </Flex>
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default WalletUser
