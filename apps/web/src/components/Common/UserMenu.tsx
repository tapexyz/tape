import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAuthPersistStore, { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import clsx from 'clsx'
import type { Profile } from 'lens'
import { useAllProfilesLazyQuery } from 'lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import type { CustomErrorWithData } from 'utils'
import {
  ADMIN_IDS,
  Analytics,
  HEALTH_URL,
  IS_MAINNET,
  LENSTUBE_STATUS_PAGE,
  TRACK
} from 'utils'
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

  const setChannels = useChannelStore((state) => state.setChannels)
  const setShowCreateChannel = useChannelStore(
    (state) => state.setShowCreateChannel
  )
  const channels = useChannelStore((state) => state.channels)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const selectedChannel = useChannelStore(
    (state) => state.selectedChannel as Profile
  )
  const setSelectedChannelId = useAuthPersistStore(
    (state) => state.setSelectedChannelId
  )

  const { data: statusData } = useSWR(
    IS_MAINNET ? HEALTH_URL : null,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: true }
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
    Analytics.track(TRACK.CHANNEL.SWITCH)
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
        <button
          onClick={() => Analytics.track(TRACK.CLICK_USER_MENU)}
          className="btn-primary flex-none ring-gray-200 hover:ring-4 dark:ring-gray-800"
        >
          <img
            className="dark:bg-theme h-8 w-8 rounded-full bg-white object-cover md:h-9 md:w-9"
            src={getProfilePicture(selectedChannel)}
            alt={selectedChannel.handle}
            draggable={false}
          />
        </button>
      }
    >
      <div className="mt-2 w-56 overflow-hidden rounded-xl border bg-gray-100 shadow dark:border-gray-800 dark:bg-black">
        <div className="dark:bg-theme m-1.5 overflow-hidden rounded-xl bg-white">
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
                {channels?.map((channel) => (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                  >
                    <span className="inline-flex items-center space-x-1.5">
                      <img
                        className="h-6 w-6 rounded-lg"
                        src={getProfilePicture(channel)}
                        alt={channel.handle}
                        draggable={false}
                      />
                      <span className="truncate whitespace-nowrap">
                        {channel.handle}
                      </span>
                    </span>
                    {selectedChannel?.id === channel.id && (
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
                  <Link href={`/channel/${selectedChannel?.handle}`}>
                    <img
                      className="h-9 w-9 rounded-full object-cover"
                      src={getProfilePicture(selectedChannel, 'avatar')}
                      alt={selectedChannel.handle}
                      draggable={false}
                    />
                  </Link>
                  <div className="grid">
                    <span className="text-xs opacity-70">Connected as</span>
                    <Link href={`/channel/${selectedChannel?.handle}`}>
                      <h6
                        title={selectedChannel?.handle}
                        className="truncate text-base leading-4"
                      >
                        {selectedChannel?.handle}
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
                    <span className="truncate whitespace-nowrap">Firehose</span>
                  </Menu.Item>
                )}
                {selectedChannel && (
                  <>
                    <Menu.Item
                      as={NextLink}
                      href={`/channel/${selectedChannel?.handle}`}
                      className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ChannelOutline className="h-4 w-4" />
                      <span className="truncate whitespace-nowrap">
                        Your Channel
                      </span>
                    </Menu.Item>
                    <button
                      type="button"
                      className="inline-flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => onSelectSwitchChannel()}
                    >
                      <SwitchChannelOutline className="h-4 w-4" />
                      <span className="truncate whitespace-nowrap">
                        Switch channel
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
                      Create Channel
                    </span>
                  </button>
                )}
                <Link
                  href="/settings"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <CogOutline className="h-4 w-4" />
                  <span className="truncate whitespace-nowrap">
                    Channel Settings
                  </span>
                </Link>
                <button
                  type="button"
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
                    {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    disconnect?.()
                    signOut()
                    Analytics.track(TRACK.AUTH.SIGN_OUT)
                  }}
                >
                  <HandWaveOutline className="h-4 w-4" />
                  <span className="truncate whitespace-nowrap">Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
        {IS_MAINNET && (
          <Link
            className="m-0.5 flex items-center space-x-2 px-5 pb-3 pt-2"
            href={LENSTUBE_STATUS_PAGE}
            target="_blank"
            onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)}
          >
            <span
              className={clsx(
                'h-2 w-2 rounded-full',
                statusData?.ok ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            <span className="text-xs">
              {statusData?.ok
                ? 'All services are online'
                : 'Some services are offline'}
            </span>
          </Link>
        )}
      </div>
    </DropMenu>
  )
}

export default UserMenu
