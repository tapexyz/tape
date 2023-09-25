import { Analytics, TRACK } from '@lenstube/browser'
import { ADMIN_IDS } from '@lenstube/constants'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useProfilesQuery } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Avatar, Box, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useAccount, useDisconnect } from 'wagmi'

import ChannelOutline from './Icons/ChannelOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import MoonOutline from './Icons/MoonOutline'
import SaveToListOutline from './Icons/SaveToListOutline'
import SunOutline from './Icons/SunOutline'
import SwitchChannelOutline from './Icons/SwitchChannelOutline'

const UserMenu = () => {
  const { theme, setTheme } = useTheme()
  const { push } = useRouter()

  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )

  const { address } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })

  const { data } = useProfilesQuery({
    variables: {
      request: {
        where: {
          ownedBy: [address]
        }
      }
    }
  })
  const allProfiles = data?.profiles.items as Profile[]

  const isAdmin = ADMIN_IDS.includes(selectedSimpleProfile?.id)

  const onSelectChannel = (profile: Profile) => {
    setActiveChannel(profile)
    // hand picked attributes to persist, to not bloat storage
    setSelectedSimpleProfile({
      handle: profile.handle,
      id: profile.id,
      ownedBy: profile.ownedBy,
      sponsor: profile.sponsor,
      metadata: profile.metadata,
      stats: profile.stats
    })
    Analytics.track(TRACK.CHANNEL.SWITCH)
  }

  const logout = () => {
    disconnect?.()
    signOut()
    setActiveChannel(null)
    setSelectedSimpleProfile(null)
    Analytics.track(TRACK.AUTH.SIGN_OUT)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="rounded ring-gray-200 hover:ring-4 dark:ring-gray-800">
          <Avatar
            size="2"
            src={getProfilePicture(selectedSimpleProfile as Profile)}
            fallback={trimLensHandle(selectedSimpleProfile?.handle)[0]}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
        <Flex gap="2" px="2" py="1" pb="3" align="center">
          <Avatar
            size="3"
            src={getProfilePicture(selectedSimpleProfile as Profile)}
            fallback={trimLensHandle(selectedSimpleProfile?.handle)[0]}
          />
          <Box>
            <Text as="p" weight="bold">
              {selectedSimpleProfile?.handle}
            </Text>
            <Text as="p" size="2" color="gray">
              {formatNumber(selectedSimpleProfile?.stats.followers!)} followers
            </Text>
          </Box>
        </Flex>

        <div className="w-52">
          <div className="text-sm">
            {isAdmin && (
              <DropdownMenu.Item>
                <Link href="/mod">
                  <GraphOutline className="h-4 w-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    <Trans>App Info</Trans>
                  </Text>
                </Link>
              </DropdownMenu.Item>
            )}
            {selectedSimpleProfile && (
              <>
                <DropdownMenu.Item
                  onClick={() =>
                    push(
                      `/channel/${trimLensHandle(
                        selectedSimpleProfile?.handle
                      )}`
                    )
                  }
                >
                  <Link
                    href={`/channel/${trimLensHandle(
                      selectedSimpleProfile?.handle
                    )}`}
                    className="flex items-center space-x-2"
                  >
                    <ChannelOutline className="h-4 w-4" />
                    <Text as="p" className="truncate whitespace-nowrap">
                      <Trans>My Profile</Trans>
                    </Text>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => push('/channel/saved')}>
                  <Link
                    href="/channel/saved"
                    className="flex items-center space-x-2"
                  >
                    <SaveToListOutline className="h-4 w-4" />
                    <Text as="p" className="truncate whitespace-nowrap">
                      <Trans>Saved Items</Trans>
                    </Text>
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    <Flex align="center" gap="2">
                      <SwitchChannelOutline className="h-4 w-4" />
                      <Text as="p" className="truncate whitespace-nowrap">
                        <Trans>Switch Profile</Trans>
                      </Text>
                    </Flex>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <div className="py-1 text-sm">
                      {allProfiles?.map((profile) => (
                        <DropdownMenu.Item
                          key={profile.id}
                          onClick={() => onSelectChannel(profile)}
                        >
                          <Flex gap="2" align="center">
                            <Avatar
                              size="1"
                              src={getProfilePicture(profile)}
                              fallback={trimLensHandle(profile?.handle)[0]}
                            />
                            <Text as="p" className="truncate whitespace-nowrap">
                              {trimLensHandle(profile.handle)}
                            </Text>
                          </Flex>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
              </>
            )}
            <DropdownMenu.Item onClick={() => push('/settings')}>
              <Link href="/settings" className="flex items-center space-x-2">
                <CogOutline className="h-4 w-4" />
                <Text as="p" className="truncate whitespace-nowrap">
                  <Trans>My Settings</Trans>
                </Text>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              onClick={() => {
                const selected = theme === 'dark' ? 'light' : 'dark'
                setTheme(selected)
                Analytics.track(TRACK.SYSTEM.TOGGLE_THEME, {
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
                  {theme === 'light' ? t`Switch to Dark` : t`Switch to Light`}
                </Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item color="red" onClick={() => logout()}>
              <Flex align="center" gap="2">
                <HandWaveOutline className="h-4 w-4" />
                <Text as="p" className="truncate whitespace-nowrap">
                  <Trans>Sign out</Trans>
                </Text>
              </Flex>
            </DropdownMenu.Item>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default UserMenu
