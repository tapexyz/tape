import NewVideoTrigger from '@components/Channel/NewVideoTrigger'
import NotificationTrigger from '@components/Notifications/NotificationTrigger'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import { EXPLORE, HOME, NOTIFICATIONS } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { FC } from 'react'
import { CgBell } from 'react-icons/cg'

import Login from './Auth/Login'
import MoonOutline from './Icons/MoonOutline'
import SearchOutline from './Icons/SearchOutline'
import SunOutline from './Icons/SunOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const [showShowModal, setSearchModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const { theme, setTheme } = useTheme()
  const { pathname } = useRouter()

  const showFilter = pathname === HOME || pathname === EXPLORE

  return (
    <div
      className={clsx(
        'sticky top-0 py-2.5 left-0 right-0 z-[5] flex w-full items-center bg-white dark:bg-theme',
        className
      )}
    >
      <div className="w-full">
        <div className="flex ultrawide:px-6 px-2 items-center justify-between w-full">
          <div className="md:w-[330px]">
            <Link href={HOME} className="block md:invisible">
              <img
                src="/lenstube.svg"
                draggable={false}
                className="w-5 h-5"
                alt="lenstube"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:space-x-3 md:w-96">
            <Button
              variant="outlined"
              onClick={() => setSearchModal(true)}
              className="!p-[10px] md:hidden"
            >
              <SearchOutline className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="outlined"
              className="!p-[10px] !"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                Analytics.track(
                  theme === 'dark'
                    ? TRACK.SYSTEM.THEME.LIGHT
                    : TRACK.SYSTEM.THEME.DARK
                )
              }}
            >
              {theme === 'dark' ? (
                <SunOutline className="w-4 h-4" />
              ) : (
                <MoonOutline className="w-4 h-4" />
              )}
            </Button>
            {selectedChannelId ? (
              <>
                <NotificationTrigger />
                <Link
                  onClick={() => Analytics.track(TRACK.CLICK_NOTIFICATIONS)}
                  href={NOTIFICATIONS}
                  className="relative p-1 md:hidden"
                >
                  <CgBell className="text-lg" />
                  {hasNewNotification && (
                    <span className="absolute flex w-1.5 h-1.5 bg-red-500 rounded-full top-0 right-0" />
                  )}
                </Link>
                <NewVideoTrigger />
              </>
            ) : null}
            <Login />
          </div>
        </div>

        {showFilter && (
          <div className="flex px-2 overflow-x-auto touch-pan-x no-scrollbar pt-4 space-x-2 ultrawide:max-w-[110rem] mx-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={clsx(
                'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full',
                activeFilter === 'all'
                  ? 'bg-black text-white'
                  : 'dark:bg-gray-800 bg-gray-100'
              )}
            >
              All
            </button>
            {CREATOR_VIDEO_CATEGORIES.map((category) => (
              <button
                type="button"
                onClick={() => setActiveFilter(category.tag)}
                key={category.tag}
                className={clsx(
                  'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap',
                  activeFilter === category.tag
                    ? 'bg-black text-white'
                    : 'dark:bg-gray-800 bg-gray-100'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Search"
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="max-h-[80vh] overflow-y-auto no-scrollbar">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default Header
