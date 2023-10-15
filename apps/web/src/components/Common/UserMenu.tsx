import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAuthPersistStore, { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { ADMIN_IDS, IS_MAINNET } from '@tape.xyz/constants'
import { getProfilePicture, trimLensHandle } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useSimpleProfilesLazyQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAccount, useDisconnect } from 'wagmi'

import ChannelOutline from './Icons/ChannelOutline'
import CheckOutline from './Icons/CheckOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import MoonOutline from './Icons/MoonOutline'
import PlusOutline from './Icons/PlusOutline'
import SaveToListOutline from './Icons/SaveToListOutline'
import SunOutline from './Icons/SunOutline'
import SwitchChannelOutline from './Icons/SwitchChannelOutline'

const UserMenu = () => {
  const { theme, setTheme } = useTheme()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const [channels, setChannels] = useState<Profile[]>([])

  const setShowCreateChannel = useChannelStore(
    (state) => state.setShowCreateChannel
  )
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

  const [getAllSimpleProfiles, { loading }] = useSimpleProfilesLazyQuery()

  const isAdmin = ADMIN_IDS.includes(selectedSimpleProfile?.id)

  const onSelectChannel = (profile: Profile) => {
    setActiveChannel(profile)
    // hand picked attributes to persist, to not bloat storage
    setSelectedSimpleProfile({
      handle: profile.handle,
      id: profile.id,
      isDefault: profile.isDefault,
      ownedBy: profile.ownedBy,
      stats: profile.stats,
      dispatcher: profile.dispatcher,
      picture: profile.picture
    })
    setShowAccountSwitcher(false)
    Analytics.track(TRACK.CHANNEL.SWITCH)
  }

  const onSelectSwitchChannel = async () => {
    try {
      setShowAccountSwitcher(true)
      const { data } = await getAllSimpleProfiles({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'network-only'
      })
      const allChannels = data?.profiles?.items as Profile[]
      setChannels(allChannels)
    } catch {}
  }

  const logout = () => {
    disconnect?.()
    signOut()
    setActiveChannel(null)
    setSelectedSimpleProfile(null)
    Analytics.track(TRACK.AUTH.SIGN_OUT)
  }

  return (
    <DropMenu
      trigger={
        <button
          onClick={() => Analytics.track(TRACK.CLICK_USER_MENU)}
          className="btn-primary flex-none ring-gray-200 hover:ring-4 dark:ring-gray-800"
        >
          <img
            className="h-8 w-8 rounded-full bg-white object-cover dark:bg-black md:h-9 md:w-9"
            src={getProfilePicture(selectedSimpleProfile as Profile)}
            alt={selectedSimpleProfile?.handle}
            draggable={false}
          />
        </button>
      }
    >
      <div className="mt-2 w-56 overflow-hidden rounded-xl border bg-gray-100 shadow dark:border-gray-800 dark:bg-black">
        <div className="m-1.5 overflow-hidden rounded-xl bg-white dark:bg-black">
          {showAccountSwitcher ? (
            <>
              <button
                type="button"
                className="flex items-center space-x-2 pl-2 opacity-70 outline-none"
                onClick={() => setShowAccountSwitcher(false)}
              >
                <ChevronLeftOutline className="h-3 w-3" />
                <span className="py-2 text-sm">Channels</span>
              </button>
              <div className="py-1 text-sm">
                {loading && !channels.length ? (
                  <div className="py-10">
                    <Loader />
                  </div>
                ) : null}
                {channels?.map((channel) => (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                  >
                    <span className="inline-flex items-center space-x-1.5">
                      <img
                        className="h-6 w-6 flex-none rounded-full"
                        src={getProfilePicture(channel)}
                        alt={channel.handle}
                        draggable={false}
                      />
                      <span className="truncate whitespace-nowrap">
                        {trimLensHandle(channel.handle)}
                      </span>
                    </span>
                    {selectedSimpleProfile?.id === channel.id && (
                      <CheckOutline className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col space-y-1 rounded-lg text-sm transition duration-150 ease-in-out">
                <div className="inline-flex items-center space-x-2 rounded-lg p-3">
                  <Link
                    href={`/channel/${trimLensHandle(
                      selectedSimpleProfile?.handle
                    )}`}
                  >
                    <img
                      className="h-9 w-9 flex-none rounded-full object-cover"
                      src={getProfilePicture(
                        selectedSimpleProfile as Profile,
                        'AVATAR'
                      )}
                      alt={selectedSimpleProfile?.handle}
                      draggable={false}
                    />
                  </Link>
                  <div className="grid">
                    <span className="text-xs leading-4 opacity-70">
                      <Trans>Connected as</Trans>
                    </span>
                    <Link
                      href={`/channel/${trimLensHandle(
                        selectedSimpleProfile?.handle
                      )}`}
                    >
                      <h6
                        title={selectedSimpleProfile?.handle}
                        className="truncate text-base"
                      >
                        {trimLensHandle(selectedSimpleProfile?.handle)}
                      </h6>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                {isAdmin && (
                  <Menu.Item
                    as={NextLink}
                    href="/mod"
                    className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <GraphOutline className="h-4 w-4" />
                    <span className="truncate whitespace-nowrap">
                      <Trans>App Info</Trans>
                    </span>
                  </Menu.Item>
                )}
                {selectedSimpleProfile && (
                  <>
                    <Menu.Item
                      as={NextLink}
                      href={`/channel/${trimLensHandle(
                        selectedSimpleProfile?.handle
                      )}`}
                      className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChannelOutline className="h-4 w-4" />
                      <span className="truncate whitespace-nowrap">
                        <Trans>Your Channel</Trans>
                      </span>
                    </Menu.Item>
                    <Menu.Item
                      as={NextLink}
                      href="/channel/saved"
                      className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <SaveToListOutline className="h-4 w-4" />
                      <span className="truncate whitespace-nowrap">
                        <Trans>Saved Videos</Trans>
                      </span>
                    </Menu.Item>
                    <button
                      type="button"
                      className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => onSelectSwitchChannel()}
                    >
                      <SwitchChannelOutline className="h-4 w-4" />
                      <span className="truncate whitespace-nowrap">
                        <Trans>Switch channel</Trans>
                      </span>
                    </button>
                  </>
                )}
                {!IS_MAINNET && (
                  <button
                    type="button"
                    className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setShowCreateChannel(true)}
                  >
                    <PlusOutline className="h-4 w-4" />
                    <span className="truncate whitespace-nowrap">
                      <Trans>Create Channel</Trans>
                    </span>
                  </button>
                )}
                <Menu.Item
                  as="a"
                  href="/settings"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <CogOutline className="h-4 w-4" />
                  <span className="truncate whitespace-nowrap">
                    <Trans>Channel Settings</Trans>
                  </span>
                </Menu.Item>
                <Menu.Item
                  as="button"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    const selected = theme === 'dark' ? 'light' : 'dark'
                    setTheme(selected)
                    Analytics.track(TRACK.SYSTEM.TOGGLE_THEME, {
                      selected_theme: selected
                    })
                  }}
                >
                  {theme === 'dark' ? (
                    <SunOutline className="h-4 w-4" />
                  ) : (
                    <MoonOutline className="h-4 w-4" />
                  )}
                  <span className="truncate whitespace-nowrap">
                    {theme === 'light' ? t`Switch to Dark` : t`Switch to Light`}
                  </span>
                </Menu.Item>
                <Menu.Item
                  as="button"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => logout()}
                >
                  <HandWaveOutline className="h-4 w-4" />
                  <span className="truncate whitespace-nowrap">
                    <Trans>Sign out</Trans>
                  </span>
                </Menu.Item>
              </div>
            </>
          )}
        </div>
      </div>
    </DropMenu>
  )
}

export default UserMenu
