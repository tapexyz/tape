import NewVideoTrigger from '@components/Channel/NewVideoTrigger'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'
import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import { EXPLORE, HOME, NOTIFICATIONS } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useNotificationCountQuery } from 'src/types/lens'

import Login from './Auth/Login'
import BellOutline from './Icons/BellOutline'
import SearchOutline from './Icons/SearchOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const showFilter = pathname === HOME || pathname === EXPLORE

  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const notificationCount = usePersistStore((state) => state.notificationCount)
  const setNotificationCount = usePersistStore(
    (state) => state.setNotificationCount
  )
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )

  useNotificationCountQuery({
    variables: {
      request: {
        profileId: selectedChannel?.id,
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    skip: !selectedChannel?.id,
    onCompleted: (notificationsData) => {
      if (selectedChannel && notificationsData) {
        const currentCount =
          notificationsData?.notifications?.pageInfo?.totalCount
        const totalCount = notificationsData?.notifications?.pageInfo
          ?.totalCount as number
        setHasNewNotification(notificationCount !== currentCount)
        setNotificationCount(totalCount)
      }
    }
  })

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
              <SearchOutline className="w-4 h-4" aria-hidden="true" />
            </Button>
            {selectedChannelId ? (
              <>
                <Link
                  onClick={() => Analytics.track(TRACK.CLICK_NOTIFICATIONS)}
                  href={NOTIFICATIONS}
                  className="relative p-1"
                >
                  <Button variant="outlined" className="!p-[9px]">
                    <BellOutline className="w-4 h-4" />
                    {hasNewNotification && (
                      <span className="absolute flex w-2 h-2 bg-red-500 rounded-full -top-1 -right-0.5" />
                    )}
                  </Button>
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
              onClick={() => setActiveTagFilter('all')}
              className={clsx(
                'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full',
                activeTagFilter === 'all'
                  ? 'bg-black text-white'
                  : 'dark:bg-gray-800 bg-gray-100'
              )}
            >
              All
            </button>
            {CREATOR_VIDEO_CATEGORIES.map((category) => (
              <button
                type="button"
                onClick={() => setActiveTagFilter(category.tag)}
                key={category.tag}
                className={clsx(
                  'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap',
                  activeTagFilter === category.tag
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
