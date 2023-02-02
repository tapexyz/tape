import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import { useLatestNotificationIdQuery } from 'lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useState } from 'react'
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  LENSTUBE_ROADMAP_URL,
  STATIC_ASSETS,
  TRACK
} from 'utils'

import Login from './Auth/Login'
import CategoryFilters from './CategoryFilters'
import BellOutline from './Icons/BellOutline'
import NewVideoOutline from './Icons/NewVideoOutline'
import RoadmapOutline from './Icons/RoadmapOutline'
import SearchOutline from './Icons/SearchOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const showFilter =
    pathname === '/' || pathname === '/explore' || pathname === '/feed'

  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const latestNotificationId = usePersistStore(
    (state) => state.latestNotificationId
  )
  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )

  useLatestNotificationIdQuery({
    variables: {
      request: {
        profileId: selectedChannel?.id,
        sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        customFilters: LENS_CUSTOM_FILTERS,
        limit: 1
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedChannel?.id,
    onCompleted: (notificationsData) => {
      if (selectedChannel && notificationsData) {
        const id = notificationsData?.notifications?.items[0].notificationId
        setHasNewNotification(latestNotificationId !== id)
        setLatestNotificationId(id)
      }
    }
  })

  return (
    <div
      className={clsx(
        'dark:bg-theme sticky top-0 left-0 right-0 z-10 flex w-full items-center bg-white py-2.5',
        className
      )}
    >
      <div className="w-full">
        <div className="ultrawide:px-6 flex w-full items-center justify-between px-2">
          <div className="md:w-[330px]">
            <Link href="/" className="block md:invisible">
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
                draggable={false}
                className="h-5 w-5"
                alt="lenstube"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:w-96 md:space-x-3">
            <button
              onClick={() => setSearchModal(true)}
              className="btn-hover p-2.5 md:hidden"
            >
              <SearchOutline className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              className="hidden rounded-lg opacity-80 hover:opacity-100 lg:block"
              href={LENSTUBE_ROADMAP_URL}
              onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)}
              target="_blank"
            >
              <button className="btn-hover p-2.5">
                <RoadmapOutline className="h-4 w-4" />
              </button>
            </Link>
            {selectedChannelId ? (
              <>
                <Link
                  onClick={() =>
                    Analytics.track(TRACK.NOTIFICATIONS.CLICK_NOTIFICATIONS)
                  }
                  href="/notifications"
                  className="relative"
                >
                  <button className="btn-hover p-2.5">
                    <BellOutline className="h-4 w-4" />
                    {hasNewNotification && (
                      <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                </Link>
                <Link
                  href="/upload"
                  onClick={() => Analytics.track(TRACK.CLICK_UPLOAD_VIDEO)}
                >
                  <Button
                    className="hidden md:block"
                    icon={<NewVideoOutline className="h-4 w-4" />}
                  >
                    <span>New video</span>
                  </Button>
                </Link>
              </>
            ) : null}
            <Login />
          </div>
        </div>

        {showFilter && <CategoryFilters />}
      </div>

      <Modal
        title="Search"
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default Header
