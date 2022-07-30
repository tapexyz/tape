import { useLazyQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { ADMIN_IDS, IS_MAINNET } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import { LENSTUBE_PATH, SETTINGS } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlinePlus, AiOutlineUserSwitch } from 'react-icons/ai'
import { BiArrowBack, BiCheck, BiMoviePlay } from 'react-icons/bi'
import { BsSun } from 'react-icons/bs'
import { IoAnalyticsOutline, IoMoonOutline } from 'react-icons/io5'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { Profile } from 'src/types'
import { useAccount, useDisconnect } from 'wagmi'

const UserMenu = () => {
  const { channels, setShowCreateChannel, setChannels } = useAppStore()
  const {
    setSelectedChannel,
    selectedChannel,
    setIsAuthenticated,
    setIsSignedUser
  } = usePersistStore()
  const { theme, setTheme } = useTheme()

  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const { disconnect } = useDisconnect({
    onError(error: any) {
      toast.error(error?.data?.message || error?.message)
    }
  })
  const [getChannels] = useLazyQuery(CURRENT_USER_QUERY)
  const { address } = useAccount()
  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  const logout = () => {
    setIsSignedUser(false)
    setIsAuthenticated(false)
    setSelectedChannel(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    if (disconnect) disconnect()
  }

  const onSelectChannel = (channel: Profile) => {
    setSelectedChannel(channel)
    setShowAccountSwitcher(false)
  }

  const onSelectSwitchChannel = async () => {
    try {
      setShowAccountSwitcher(true)
      const { data } = await getChannels({
        variables: { ownedBy: address },
        fetchPolicy: 'no-cache'
      })
      const allChannels: Profile[] = data?.profiles?.items
      setChannels(allChannels)
    } catch (error) {
      logger.error('[Error Get Channels]', error)
    }
  }

  return (
    <Popover
      trigger={
        <Button className="!p-0">
          <img
            className="object-cover bg-white rounded-lg dark:bg-black w-7 h-7 md:rounded-xl md:w-9 md:h-9"
            src={
              selectedChannel
                ? getProfilePicture(selectedChannel)
                : imageCdn(
                    `https://cdn.stamp.fyi/avatar/eth:${address}?s=100`,
                    'avatar'
                  )
            }
            alt="channel picture"
            draggable={false}
          />
        </Button>
      }
      triggerClassName="right-0 flex item-center"
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow-xl max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-800 bg-secondary">
        {showAccountSwitcher ? (
          <>
            <div className="flex opacity-70 items-centerspace-x-2">
              <button
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
                  className={clsx(
                    'flex w-full justify-between items-center px-2 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
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
              <div className="inline-flex items-center p-2 py-4 space-x-2 rounded-lg">
                <img
                  className="object-cover rounded-xl w-9 h-9"
                  src={
                    selectedChannel
                      ? getProfilePicture(selectedChannel, 'avatar')
                      : imageCdn(
                          `https://cdn.stamp.fyi/avatar/eth:${address}?s=100`,
                          'avatar'
                        )
                  }
                  alt="channel picture"
                  draggable={false}
                />
                <div className="flex flex-col items-start">
                  {address && (
                    <h6 className="text-base truncate whitespace-nowrap">
                      {selectedChannel
                        ? selectedChannel?.handle
                        : shortenAddress(address)}
                    </h6>
                  )}
                  {selectedChannel && (
                    <Link href={SETTINGS}>
                      <a className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                        Settings
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="py-1 text-sm">
              {isAdmin && (
                <Link href={LENSTUBE_PATH}>
                  <a
                    className={clsx(
                      'inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <IoAnalyticsOutline className="text-lg" />
                    <span className="truncate whitespace-nowrap">App Info</span>
                  </a>
                </Link>
              )}
              {selectedChannel && (
                <>
                  <Link href={`/${selectedChannel?.handle}`}>
                    <a
                      className={clsx(
                        'inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <BiMoviePlay className="text-lg" />
                      <span className="truncate whitespace-nowrap">
                        Your Channel
                      </span>
                    </a>
                  </Link>
                  <button
                    className={clsx(
                      'inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
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
                  className={clsx(
                    'flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  onClick={() => setShowCreateChannel(true)}
                >
                  <AiOutlinePlus className="text-lg" />
                  <span className="truncate whitespace-nowrap">
                    Create Channel
                  </span>
                </button>
              )}
              <button
                className={clsx(
                  'flex md:hidden items-center w-full px-2.5 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
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
                className={clsx(
                  'flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => logout()}
              >
                <VscDebugDisconnect className="text-lg" />
                <span className="truncate whitespace-nowrap">Disconnect</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Popover>
  )
}

export default UserMenu
