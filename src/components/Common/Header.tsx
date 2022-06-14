import { Button } from '@components/UIElements/Button'
import { SearchIcon } from '@heroicons/react/outline'
import useAppStore from '@lib/store'
import { HOME } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'

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
    <div
      className={clsx(
        'fixed z-10 flex md:left-[84px] right-2 left-2 md:right-4 items-center justify-between bg-white dark:bg-black h-14'
      )}
    >
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
            className="px-2 hidden text-sm opacity-80 hover:opacity-100 md:flex focus:outline-none items-center space-x-1 text-left py-1.5 rounded"
          >
            <SearchIcon className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-4">
        <Button
          variant="secondary"
          className="!p-0 md:hidden"
          onClick={() => setShowSearch(true)}
        >
          <SearchIcon className="w-5 h-5" />
        </Button>
        {selectedChannel && <NotificationTrigger />}
        {selectedChannel && <NewVideoTrigger />}
        <Login />
      </div>
    </div>
  )
}

export default Header
