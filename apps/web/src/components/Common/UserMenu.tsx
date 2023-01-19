import { Button } from '@components/UIElements/Button'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAppStore from '@lib/store'
import usePersistStore, { signOut } from '@lib/store/persist'
import type { Profile } from 'lens'
import { useAllProfilesLazyQuery } from 'lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import { ADMIN_IDS, Analytics, IS_MAINNET, TRACK } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { useAccount, useDisconnect } from 'wagmi'

import ChannelOutline from './Icons/ChannelOutline'
import CheckOutline from './Icons/CheckOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import MoonOutline from './Icons/MoonOutline'
import PlusOutline from './Icons/PlusOutline'
import SunOutline from './Icons/SunOutline'
import SwitchChannelOutline from './Icons/SwitchChannelOutline'

const UserMenu = () => {
  const { theme, setTheme } = useTheme()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

  const setChannels = useAppStore((state) => state.setChannels)
  const setShowCreateChannel = useAppStore(
    (state) => state.setShowCreateChannel
  )
  const channels = useAppStore((state) => state.channels)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const selectedChannel = useAppStore(
    (state) => state.selectedChannel as Profile
  )
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const [getChannels] = useAllProfilesLazyQuery()
  const { address } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })

  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  const onSelectChannel = (channel: Profile) => {
    setSelectedChannel(channel)
    setSelectedChannelId(channel.id)
    setShowAccountSwitcher(false)
  }

  const onSelectSwitchChannel = async () => {
    try {
      setShowAccountSwitcher(true)
      const { data } = await getChannels({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'no-cache'
      })
      const allChannels = data?.profiles?.items as Profile[]
      setChannels(allChannels)
    } catch {}
  }

  return (
    <DropMenu
      trigger={
        <Button
          onClick={() => Analytics.track(TRACK.CLICK_USER_MENU)}
          className="!p-0 flex-none"
        >
          <img
            className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
            src={getProfilePicture(selectedChannel)}
            alt={selectedChannel.handle}
            draggable={false}
          />
        </Button>
      }
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-800 bg-secondary dark:bg-theme">
        {showAccountSwitcher ? (
          <>
            <button
              type="button"
              className="flex opacity-70 pl-2 outline-none items-center space-x-2"
              onClick={() => setShowAccountSwitcher(false)}
            >
              <ChevronLeftOutline className="w-3 h-3" />
              <span className="py-2 text-sm">Channels</span>
            </button>
            <div className="py-1 text-sm">
              {channels?.map((channel) => (
                <button
                  type="button"
                  className="flex w-full justify-between items-center px-2 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                >
                  <span className="inline-flex items-center space-x-1.5">
                    <img
                      className="w-6 h-6 rounded-lg"
                      src={getProfilePicture(channel)}
                      alt={channel.handle}
                      draggable={false}
                    />
                    <span className="truncate whitespace-nowrap">
                      {channel.handle}
                    </span>
                  </span>
                  {selectedChannel?.id === channel.id && (
                    <CheckOutline className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
              <div className="inline-flex items-center p-2 py-3 space-x-2 rounded-lg">
                <img
                  className="object-cover rounded-full w-9 h-9"
                  src={getProfilePicture(selectedChannel, 'avatar')}
                  alt={selectedChannel.handle}
                  draggable={false}
                />
                <div className="grid">
                  <span className="text-xs opacity-70">Connected as</span>
                  <Link href={`/channel/${selectedChannel?.handle}`}>
                    <h6
                      title={selectedChannel?.handle}
                      className="text-base truncate leading-4"
                    >
                      {selectedChannel?.handle}
                    </h6>
                  </Link>
                </div>
              </div>
            </div>
            <div className="py-1 text-sm">
              {isAdmin && (
                <Menu.Item
                  as={NextLink}
                  href="/stats"
                  className="inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <GraphOutline className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">App Info</span>
                </Menu.Item>
              )}
              {selectedChannel && (
                <>
                  <Menu.Item
                    as={NextLink}
                    href={`/channel/${selectedChannel?.handle}`}
                    className="inline-flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ChannelOutline className="w-4 h-4" />
                    <span className="truncate whitespace-nowrap">
                      Your Channel
                    </span>
                  </Menu.Item>
                  <button
                    type="button"
                    className="inline-flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      onSelectSwitchChannel()
                      Analytics.track(TRACK.CLICK_SWITCH_CHANNEL)
                    }}
                  >
                    <SwitchChannelOutline className="w-4 h-4" />
                    <span className="truncate whitespace-nowrap">
                      Switch channel
                    </span>
                  </button>
                </>
              )}
              {!IS_MAINNET && (
                <button
                  type="button"
                  className="flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowCreateChannel(true)}
                >
                  <PlusOutline className="w-4 h-4" />
                  <span className="truncate whitespace-nowrap">
                    Create Channel
                  </span>
                </button>
              )}
              <Link
                href="/settings"
                className="flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <CogOutline className="w-4 h-4" />
                <span className="truncate whitespace-nowrap">
                  Channel Settings
                </span>
              </Link>
              <button
                type="button"
                className="flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark')
                  Analytics.track(
                    theme === 'dark'
                      ? TRACK.SYSTEM.THEME.DARK
                      : TRACK.SYSTEM.THEME.LIGHT
                  )
                }}
              >
                {theme === 'dark' ? (
                  <SunOutline className="w-4 h-4" />
                ) : (
                  <MoonOutline className="w-4 h-4" />
                )}
                <span className="truncate whitespace-nowrap">
                  {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                </span>
              </button>
              <button
                type="button"
                className="flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  disconnect?.()
                  signOut()
                  Analytics.track(TRACK.AUTH.CLICK_SIGN_OUT)
                }}
              >
                <HandWaveOutline className="w-4 h-4" />
                <span className="truncate whitespace-nowrap">Sign out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </DropMenu>
  )
}

export default UserMenu
