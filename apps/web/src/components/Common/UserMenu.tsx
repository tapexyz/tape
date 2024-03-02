import getCurrentSession from '@lib/getCurrentSession'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/idb/profile'
import { ADMIN_IDS } from '@tape.xyz/constants'
import { EVENTS, getProfile, getProfilePicture, Tower } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  LimitType,
  useProfilesManagedQuery,
  useRevokeAuthenticationMutation
} from '@tape.xyz/lens'
import {
  BookmarkOutline,
  ChevronRightOutline,
  CogOutline,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  GraphOutline,
  HandWaveOutline,
  MoonOutline,
  SunOutline,
  SwitchProfileOutline,
  UserOutline
} from '@tape.xyz/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { useMemo } from 'react'
import { useAccount } from 'wagmi'

const UserMenu = () => {
  const { theme, setTheme } = useTheme()
  const { push, asPath } = useRouter()
  const { address } = useAccount()
  const { activeProfile } = useProfileStore()

  const { data } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty },
      lastLoggedInProfileRequest: { for: address }
    },
    skip: !address
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
    const authorizationId = getCurrentSession().authorizationId
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
    <DropdownMenu
      trigger={
        <div className="ring-brand-500 size-[34px] rounded-full hover:ring-2">
          <img
            className="h-full w-full flex-none rounded-full object-cover"
            src={getProfilePicture(activeProfile, 'AVATAR')}
            alt={getProfile(activeProfile)?.displayName}
            draggable={false}
          />
        </div>
      }
    >
      <div className="w-44">
        <Link href={getProfile(activeProfile)?.link}>
          <div className="flex items-center gap-2 px-2 py-1 pb-3">
            <img
              src={getProfilePicture(activeProfile, 'AVATAR')}
              alt={getProfile(activeProfile)?.displayName}
              className="h-8 w-8 rounded-full"
            />
            <p className="line-clamp-1 font-semibold">
              {getProfile(activeProfile)?.slug}
            </p>
          </div>
        </Link>
        {isAdmin && (
          <DropdownMenuItem onClick={() => push('/mod')}>
            <div className="flex items-center gap-2">
              <GraphOutline className="size-4" />
              <p className="whitespace-nowrap">Mod</p>
            </div>
          </DropdownMenuItem>
        )}
        {activeProfile && (
          <>
            <DropdownMenuItem
              onClick={() => push(getProfile(activeProfile)?.link)}
            >
              <div className="flex items-center gap-2">
                <UserOutline className="size-4" />
                <p className="whitespace-nowrap">My Profile</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => push('/bookmarks')}>
              <div className="flex items-center gap-2">
                <BookmarkOutline className="size-4" />
                <p className="whitespace-nowrap">Bookmarks</p>
              </div>
            </DropdownMenuItem>

            {profilesManagedWithoutActiveProfile.length ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <SwitchProfileOutline className="size-4" />
                    <p className="whitespace-nowrap">Switch Profile</p>
                  </div>
                  <ChevronRightOutline className="size-2.5" />
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {profilesManagedWithoutActiveProfile?.map(
                      (profile) =>
                        profile.id !== activeProfile.id && (
                          <DropdownMenuItem
                            key={profile.id}
                            onClick={() =>
                              push(`/login?as=${profile.id}&next=${asPath}`)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={getProfilePicture(profile)}
                                className="size-4 rounded-full"
                                draggable={false}
                                alt={getProfile(activeProfile)?.displayName}
                              />
                              <p className="whitespace-nowrap">
                                {getProfile(profile)?.slug}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        )
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : null}
          </>
        )}
        <DropdownMenuItem onClick={() => push('/settings')}>
          <div className="flex items-center gap-2">
            <CogOutline className="size-4" />
            <p className="whitespace-nowrap">My Settings</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const selected = theme === 'dark' ? 'light' : 'dark'
            setTheme(selected)
            Tower.track(EVENTS.SYSTEM.TOGGLE_THEME, {
              selected_theme: selected
            })
          }}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <SunOutline className="size-4" />
            ) : (
              <MoonOutline className="size-4" />
            )}
            <p className="whitespace-nowrap">
              {theme === 'light' ? `Switch to Dark` : `Switch to Light`}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={loading} onClick={() => onClickSignout()}>
          <div className="flex items-center gap-2 text-red-500">
            <HandWaveOutline className="size-4" />
            <p className="whitespace-nowrap">Sign out</p>
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenu>
  )
}

export default UserMenu
