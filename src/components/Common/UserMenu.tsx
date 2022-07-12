import { useLazyQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import Popover from '@components/UIElements/Popover'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { ADMIN_IDS, IS_MAINNET } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import { LENSTUBE_PATH, SETTINGS } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlinePlus, AiOutlineUserSwitch } from 'react-icons/ai'
import { BiArrowBack, BiCheck, BiMoviePlay } from 'react-icons/bi'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { Profile } from 'src/types'
import { useAccount, useDisconnect } from 'wagmi'

const UserMenu = () => {
  const { channels, setShowCreateChannel, setChannels } = useAppStore()
  const { setSelectedChannel, selectedChannel, setIsAuthenticated } =
    usePersistStore()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const { disconnect } = useDisconnect()
  const [getChannels] = useLazyQuery(CURRENT_USER_QUERY)
  const { address } = useAccount()
  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  const logout = () => {
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
      console.log(error)
    }
  }

  if (!selectedChannel) return null

  return (
    <Popover
      trigger={
        <Button className="!p-0">
          <img
            className="object-cover bg-white rounded-lg dark:bg-black w-7 h-7 md:rounded-xl md:w-9 md:h-9"
            src={getProfilePicture(selectedChannel)}
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
              {channels?.map((channel, idx) => (
                <button
                  className={clsx(
                    'flex w-full justify-between items-center px-2 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  key={idx}
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
                  src={getProfilePicture(selectedChannel)}
                  alt="channel picture"
                  draggable={false}
                />
                <div className="flex flex-col items-start">
                  <h6 className="text-base truncate whitespace-nowrap">
                    {selectedChannel?.handle}
                  </h6>
                  <Link href={SETTINGS}>
                    <a className="text-xs font-medium text-indigo-500">
                      Settings
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="py-1 text-sm">
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
                onClick={() => {
                  onSelectSwitchChannel()
                }}
              >
                <AiOutlineUserSwitch className="text-lg" />
                <span className="truncate whitespace-nowrap">
                  Switch channel
                </span>
              </button>
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
