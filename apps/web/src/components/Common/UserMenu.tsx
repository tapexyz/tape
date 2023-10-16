import useAuthPersistStore, { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { Avatar, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { ADMIN_IDS } from '@tape.xyz/constants'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useProfilesQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
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

  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)

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
    setActiveProfile(profile)
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
    setActiveProfile(null)
    setSelectedSimpleProfile(null)
    Analytics.track(TRACK.AUTH.SIGN_OUT)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="ring-brand-500 flex rounded-full hover:ring-2">
          <Avatar
            size="2"
            radius="full"
            src={getProfilePicture(selectedSimpleProfile as Profile)}
            fallback={
              getProfile(selectedSimpleProfile as Profile)?.slug[0] ?? ''
            }
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
        <div className="w-48">
          <Flex gap="2" px="2" py="1" pb="3" align="center">
            <Avatar
              size="1"
              radius="full"
              src={getProfilePicture(selectedSimpleProfile as Profile)}
              fallback={
                getProfile(selectedSimpleProfile as Profile)?.slug[0] ?? ''
              }
            />
            <Text as="p" weight="bold" className="line-clamp-1">
              {getProfile(selectedSimpleProfile as Profile)?.slug}
            </Text>
          </Flex>
          {isAdmin && (
            <DropdownMenu.Item onClick={() => push('/mod')}>
              <Flex gap="2" align="center">
                <GraphOutline className="h-4 w-4" />
                <Text as="p" className="truncate whitespace-nowrap">
                  <Trans>App Info</Trans>
                </Text>
              </Flex>
            </DropdownMenu.Item>
          )}
          {selectedSimpleProfile && (
            <>
              <DropdownMenu.Item
                onClick={() =>
                  push(
                    `/u/${getProfile(selectedSimpleProfile as Profile)?.slug}`
                  )
                }
              >
                <Flex gap="2" align="center">
                  <ChannelOutline className="h-4 w-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    <Trans>My Profile</Trans>
                  </Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => push('/bookmarks')}>
                <Flex gap="2" align="center">
                  <SaveToListOutline className="h-4 w-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    <Trans>Bookmarks</Trans>
                  </Text>
                </Flex>
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
                  {allProfiles?.map((profile) => (
                    <DropdownMenu.Item
                      key={profile.id}
                      onClick={() => onSelectChannel(profile)}
                    >
                      <Flex gap="2" align="center">
                        <Avatar
                          size="1"
                          radius="full"
                          src={getProfilePicture(profile)}
                          fallback={
                            getProfile(profile as Profile)?.displayName[0] ?? ''
                          }
                        />
                        <Text as="p" className="truncate whitespace-nowrap">
                          {getProfile(profile)?.slug}
                        </Text>
                      </Flex>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </>
          )}
          <DropdownMenu.Item onClick={() => push('/settings')}>
            <Flex gap="2" align="center">
              <CogOutline className="h-4 w-4" />
              <Text as="p" className="truncate whitespace-nowrap">
                <Trans>My Settings</Trans>
              </Text>
            </Flex>
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
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default UserMenu
