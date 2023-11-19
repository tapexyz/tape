import { ADMIN_IDS } from '@dragverse/constants'
import {
  EVENTS,
  getProfile,
  getProfilePicture,
  Tower
} from '@dragverse/generic'
import type { Profile } from '@dragverse/lens'
import {
  LimitType,
  useProfilesManagedQuery,
  useRevokeAuthenticationMutation
} from '@dragverse/lens'
import type { CustomErrorWithData } from '@dragverse/lens/custom-types'
import getCurrentSessionId from '@lib/getCurrentSessionId'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { Avatar, DropdownMenu, Flex, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useAccount, useDisconnect } from 'wagmi'

import BookmarkOutline from './Icons/BookmarkOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import SwitchProfileOutline from './Icons/SwitchProfileOutline'
import UserOutline from './Icons/UserOutline'

const UserMenu = () => {
  const { push, asPath } = useRouter()
  const { address } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })
  const { activeProfile, setActiveProfile } = useProfileStore()

  const { data } = useProfilesManagedQuery({
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
    await revokeAuthentication({
      variables: {
        request: { authorizationId: getCurrentSessionId() }
      }
    })
    signOut()
    setActiveProfile(null)
    disconnect?.()
    Tower.track(EVENTS.AUTH.SIGN_OUT)
    location.reload()
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="ring-brand-500 flex rounded-full hover:ring-2">
          <Avatar
            size="2"
            radius="full"
            src={getProfilePicture(activeProfile, 'AVATAR')}
            fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
            alt={getProfile(activeProfile)?.displayName}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
        <div className="w-48">
          <Link href={getProfile(activeProfile)?.link}>
            <Flex gap="2" px="2" py="1" pb="3" align="center">
              <Avatar
                size="1"
                radius="full"
                src={getProfilePicture(activeProfile, 'AVATAR')}
                fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
                alt={getProfile(activeProfile)?.displayName}
              />
              <Text as="p" weight="bold" className="line-clamp-1">
                {getProfile(activeProfile)?.slug}
              </Text>
            </Flex>
          </Link>
          {isAdmin && (
            <DropdownMenu.Item onClick={() => push('/mod')}>
              <Flex gap="2" align="center">
                <GraphOutline className="h-4 w-4" />
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
                <Flex gap="2" align="center">
                  <UserOutline className="h-4 w-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    My Profile
                  </Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => push('/bookmarks')}>
                <Flex gap="2" align="center">
                  <BookmarkOutline className="h-4 w-4" />
                  <Text as="p" className="truncate whitespace-nowrap">
                    Bookmarks
                  </Text>
                </Flex>
              </DropdownMenu.Item>

              {profilesManagedWithoutActiveProfile.length ? (
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    <Flex align="center" gap="2">
                      <SwitchProfileOutline className="h-4 w-4" />
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
                            <Flex gap="2" align="center">
                              <Avatar
                                size="1"
                                radius="full"
                                src={getProfilePicture(profile)}
                                fallback={
                                  getProfile(profile)?.displayName[0] ?? ';)'
                                }
                                alt={getProfile(activeProfile)?.displayName}
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
            <Flex gap="2" align="center">
              <CogOutline className="h-4 w-4" />
              <Text as="p" className="truncate whitespace-nowrap">
                My Settings
              </Text>
            </Flex>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
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

export default UserMenu
