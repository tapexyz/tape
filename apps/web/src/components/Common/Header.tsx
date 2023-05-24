import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import { useLatestNotificationIdQuery } from 'lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'
import Login from './Auth/Login'
import CategoryFilters from './CategoryFilters'
import BellOutline from './Icons/BellOutline'
import NewVideoOutline from './Icons/NewVideoOutline'
import SearchOutline from './Icons/SearchOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: React.FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const showFilter =
    pathname === '/' || pathname === '/explore' || pathname === '/feed'

    const hasNewNotification = useChannelStore(
      (state) => state.hasNewNotification
    )
    const selectedChannelId = useAuthPersistStore(
      (state) => state.selectedChannelId
    )
    const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const latestNotificationId = usePersistStore(
    (state) => state.latestNotificationId
  )
  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )
  const setHasNewNotification = useChannelStore(
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
        'bg-theme sticky top-0 left-0 right-0 z-10 flex w-full items-center py-2.5',
        className
      )}
    >
      <div className="w-full">
        <div className="ultrawide:px-6 flex w-full items-center justify-between px-2">
          {/* <div className="md:w-[330px]">
            <Link href="/" className="block md:invisible">
              <img
                src={`${FALLBACK_COVER_URL}`}
                draggable={false}
                className="h-5 w-5"
                alt="dragverse"
              />
            </Link>
          </div> */}
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
            {/* <Tooltip content="Roadmap & Feedback">
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
            </Tooltip> */}
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
                      <span className="absolute right-0.5 top-0.5 flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                </Link>
                <Link href="/upload">
                  <Button
                    className="hidden md:block"
                    icon={<NewVideoOutline className="h-4 w-4" />}
                  >
                    <span>
                      <Trans>New video</Trans>
                    </span>
                  </Button>
                </Link>
                {/* <Link
                  href="/livestream"
                  onClick={() => Analytics.track(TRACK.CLICK_UPLOAD_VIDEO)}
                >
                  <Button
                    className="hidden md:block"
                    icon={<NewVideoOutline className="h-4 w-4" />}
                  >
                    <span>
                      <Trans>New livestream</Trans>
                    </span>
                  </Button>
                </Link> */}
              </>
            ) : null}
            <Login />
          </div>
        </div>
        {showFilter && <CategoryFilters />}
      </div>
      <Modal
        title={t`Search`}
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
