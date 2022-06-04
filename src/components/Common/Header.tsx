import useAppStore from '@lib/store'
import { HOME } from '@utils/url-path'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'

import GlobalSearch from './GlobalSearch'
import Login from './Login'

const NewVideoTrigger = dynamic(
  () => import('../../components/Channel/NewVideoTrigger')
)
const NotificationTrigger = dynamic(
  () => import('../../components/Notifications/NotificationTrigger')
)

const Header = () => {
  const { selectedChannel } = useAppStore()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="fixed z-10 flex right-2 md:right-4 md:left-[84px] left-2 items-center justify-between bg-gray-100 dark:bg-[#010101] h-14">
      <div className="flex items-center flex-1 space-x-4">
        <div className="flex items-center">
          <Link href={HOME}>
            <a className="block md:hidden">
              <img
                src="/lenstube.svg"
                draggable={false}
                className="w-5 h-5"
                alt=""
              />
            </a>
          </Link>
          {showSearch && <GlobalSearch setShowSearch={setShowSearch} />}
          <button
            onClick={() => setShowSearch(true)}
            className="px-2 hidden text-sm opacity-60 hover:opacity-100 md:flex focus:outline-none items-center space-x-1 text-left py-1.5 rounded"
          >
            <BiSearch />
            <span>Search</span>
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-3">
        <button
          onClick={() => setShowSearch(true)}
          className="flex self-center p-2 rounded-lg md:hidden focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <BiSearch />
        </button>
        {selectedChannel && <NewVideoTrigger />}
        {selectedChannel && <NotificationTrigger />}
        <Login />
      </div>
    </div>
  )
}

export default Header
