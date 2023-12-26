import type { Profile } from '@tape.xyz/lens'

import getCurrentSession from '@lib/getCurrentSession'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/idb/profile'
import { Avatar, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { ADMIN_IDS } from '@tape.xyz/constants'
import { EVENTS, getProfile, getProfilePicture, Tower } from '@tape.xyz/generic'
import {
  LimitType,
  useProfilesManagedQuery,
  useRevokeAuthenticationMutation
} from '@tape.xyz/lens'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useAccount } from 'wagmi'

import BookmarkOutline from './Icons/BookmarkOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import MoonOutline from './Icons/MoonOutline'
import SunOutline from './Icons/SunOutline'
import SwitchProfileOutline from './Icons/SwitchProfileOutline'
import UserOutline from './Icons/UserOutline'

const UserMenu = () => {
  const { setTheme, theme } = useTheme()
  const { asPath, push } = useRouter()
  const { address } = useAccount()
  const { activeProfile } = useProfileStore()

  const { data } = useProfilesManagedQuery({
    skip: !address,
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    }
  })
  const profilesManagedWithoutActiveProfile = useMemo(() => {
    if (!data?.profilesManaged?.items) {
      return []
    }
    return data.profilesManaged.items.filter(
      (p) => p.id !== activeProfile?.id
    ) as Profile[]
  }, [data?.profilesManaged, activeProfile])

  const isAdmin = ADMIN_IDS.includes(activeProfile?.id)

  const [revokeAuthentication, { loading }] = useRevokeAuthenticationMutation()

  const onClickSignout = async () => {
    const { authorizationId } = getCurrentSession()
    if (authorizationId) {
      await revokeAuthentication({
        variables: {
          request: { authorizationId }
        }
      })
    }
    signOut()
    Tower.track(EVENTS.AUTH.SIGN_OUT)
    location.reload()
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="ring-brand-500 flex rounded-full hover:ring-2">
          <Avatar
            alt={getProfile(activeProfile)?.displayName}
            fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
            radius="full"
            size="2"
            src={getProfilePicture(activeProfile, 'AVATAR')}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={10} variant="soft">
        <div className="w-48">
          <Link href={getProfile(activeProfile)?.link}>
            <Flex align="center" gap="2" pb="3" px="2" py="1">
              <Avatar
                alt={getProfile(activeProfile)?.displayName}
                fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
                radius="full"
                size="1"
                src={getProfilePicture(activeProfile, 'AVATAR')}
              />
              <Text as="p" className="line-clamp-1" weight="bold">
                {getProfile(activeProfile)?.slug}
              </Text>
            </Flex>
          </Link>
          {isAdmin && (
            <DropdownMenu.Item onClick={() => push('/mod')}>
              <Flex align="center" gap="2">
                <GraphOutline className="size-4" />
                <Text as="p" className="truncate whitespace-nowrap">
                  Mod
                </Text>
              </Flex>
            </DropdownMenu.Item>
          )}
          {activeProfile && (
            <>
              <DropdownMenu.Item
                onClick={() => push(getProfile(activeProfile)?.link)}
              >
                <Flex align="center" gap="2">
                  <UserOutline className="size-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    My Profile
                  </Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => push('/bookmarks')}>
                <Flex align="center" gap="2">
                  <BookmarkOutline className="size-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    Bookmarks
                  </Text>
                </Flex>
              </DropdownMenu.Item>

              {profilesManagedWithoutActiveProfile.length ? (
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    <Flex align="center" gap="2">
                      <SwitchProfileOutline className="size-4" />
                      <Text as="p" className="truncate whitespace-nowrap">
                        Switch Profile
                      </Text>
                    </Flex>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    {profilesManagedWithoutActiveProfile?.map(
                      (profile) =>
                        profile.id !== activeProfile.id && (
                          <DropdownMenu.Item
                            key={profile.id}
                            onClick={() =>
                              push(`/login?as=${profile.id}&next=${asPath}`)
                            }
                          >
                            <Flex align="center" gap="2">
                              <Avatar
                                alt={getProfile(activeProfile)?.displayName}
                                fallback={
                                  getProfile(profile)?.displayName[0] ?? ';)'
                                }
                                radius="full"
                                size="1"
                                src={getProfilePicture(profile)}
                              />
                              <Text
                                as="p"
                                className="truncate whitespace-nowrap"
                              >
                                {getProfile(profile)?.slug}
                              </Text>
                            </Flex>
                          </DropdownMenu.Item>
                        )
                    )}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
              ) : null}
            </>
          )}
          <DropdownMenu.Item onClick={() => push('/settings')}>
            <Flex align="center" gap="2">
              <CogOutline className="size-4" />
              <Text as="p" className="truncate whitespace-nowrap">
                My Settings
              </Text>
            </Flex>
          </DropdownMenu.Item>
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
                <SunOutline className="size-4" />
              ) : (
                <MoonOutline className="size-4" />
              )}
              <Text as="p" className="truncate whitespace-nowrap">
                {theme === 'light' ? `Switch to Dark` : `Switch to Light`}
              </Text>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            asChild
            color="red"
            disabled={loading}
            onClick={() => onClickSignout()}
          >
            <Flex align="center" gap="2">
              <HandWaveOutline className="size-4" />
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

export default UserMenu
