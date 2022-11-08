import { useLazyQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { ADMIN_IDS, IS_MAINNET } from '@utils/constants'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { shortenAddress } from '@utils/functions/shortenAddress'
import { Mixpanel, TRACK } from '@utils/track'
import { LENSTUBE_STATS, SETTINGS } from '@utils/url-path'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlinePlus, AiOutlineUserSwitch } from 'react-icons/ai'
import { BiArrowBack, BiCheck, BiMoviePlay } from 'react-icons/bi'
import { BsSun } from 'react-icons/bs'
import { IoAnalyticsOutline, IoMoonOutline } from 'react-icons/io5'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { AllProfilesDocument, Profile } from 'src/types/lens'
import { CustomErrorWithData } from 'src/types/local'
import { useAccount, useDisconnect } from 'wagmi'

const UserMenu = () => {
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

  const { theme, setTheme } = useTheme()

  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })
  const [getChannels] = useLazyQuery(AllProfilesDocument)
  const { address } = useAccount()
  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  const logout = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
    clearLocalStorage()
    disconnect?.()
  }

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
    } catch (error) {
      logger.error('[Error Get Channels]', error)
    }
  }

  return (
    <DropMenu
      trigger={
        <Button className="!p-0 flex-none">
          <img
            className="object-cover bg-white rounded-lg dark:bg-black w-7 h-7 md:rounded-xl md:w-9 md:h-9"
            src={getProfilePicture(selectedChannel)}
            alt="channel picture"
            draggable={false}
          />
        </Button>
      }
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow-xl max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-800 bg-secondary">
        {showAccountSwitcher ? (
          <>
            <div className="flex opacity-70 items-centerspace-x-2">
              <button
                type="button"
                className="p-2 outline-none"
                onClick={() => setShowAccountSwitcher(false)}
              >
                <BiArrowBack />
              </button>
              <span className="py-2 text-sm">Channels</span>
            </div>
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
                      alt="channel picture"
                      draggable={false}
                    />
                    <span className="truncate whitespace-nowrap">
                      {channel.handle}
                    </span>
                  </span>
                  {selectedChannel?.id === channel.id && <BiCheck />}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
              <div className="inline-flex items-center p-2 py-3 space-x-2 rounded-lg">
                <img
                  className="object-cover rounded-xl w-9 h-9"
                  src={getProfilePicture(selectedChannel, 'avatar')}
                  alt="channel picture"
                  draggable={false}
                />
                <div className="grid">
                  {address && (
                    <h6
                      title={
                        selectedChannel
                          ? selectedChannel?.handle
                          : shortenAddress(address)
                      }
                      className="text-base truncate"
                    >
                      {selectedChannel
                        ? selectedChannel?.handle
                        : shortenAddress(address)}
                    </h6>
                  )}
                  {selectedChannel && (
                    <Menu.Item
                      as={NextLink}
                      onClick={() =>
                        Mixpanel.track(TRACK.CLICK_CHANNEL_SETTINGS)
                      }
                      href={SETTINGS}
                      className="text-xs font-medium text-indigo-500 dark:text-indigo-400"
                    >
                      Settings
                    </Menu.Item>
                  )}
                </div>
              </div>
            </div>
            <div className="py-1 text-sm">
              {isAdmin && (
                <Menu.Item
                  as={NextLink}
                  href={LENSTUBE_STATS}
                  className="inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <IoAnalyticsOutline className="text-lg" />
                  <span className="truncate whitespace-nowrap">App Info</span>
                </Menu.Item>
              )}
              {selectedChannel && (
                <>
                  <Menu.Item
                    as={NextLink}
                    href={`/${selectedChannel?.handle}`}
                    className="inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <BiMoviePlay className="text-lg" />
                    <span className="truncate whitespace-nowrap">
                      Your Channel
                    </span>
                  </Menu.Item>
                  <button
                    type="button"
                    className="inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onSelectSwitchChannel()}
                  >
                    <AiOutlineUserSwitch className="text-lg" />
                    <span className="truncate whitespace-nowrap">
                      Switch channel
                    </span>
                  </button>
                </>
              )}
              {!IS_MAINNET && (
                <button
                  type="button"
                  className="flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowCreateChannel(true)}
                >
                  <AiOutlinePlus className="text-lg" />
                  <span className="truncate whitespace-nowrap">
                    Create Channel
                  </span>
                </button>
              )}
              <button
                type="button"
                className="flex md:hidden items-center w-full px-2.5 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'light' ? (
                  <IoMoonOutline className="text-base" />
                ) : (
                  <BsSun className="text-base" />
                )}
                <span className="truncate whitespace-nowrap">
                  {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                </span>
              </button>
              <button
                type="button"
                className="flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => logout()}
              >
                <VscDebugDisconnect className="text-lg" />
                <span className="truncate whitespace-nowrap">Disconnect</span>
              </button>
            </div>
          </>
        )}
      </div>
    </DropMenu>
  )
}

export default UserMenu
