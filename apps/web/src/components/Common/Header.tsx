import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@lenstube/constants'
import { useLatestNotificationIdQuery } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useState } from 'react'

import Login from './Auth/Login'
import CategoryFilters from './CategoryFilters'
import BellOutline from './Icons/BellOutline'
import NewVideoOutline from './Icons/NewVideoOutline'
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

  const hasNewNotification = useChannelStore(
    (state) => state.hasNewNotification
  )
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
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
        where: {
          publishedOn: IS_MAINNET
            ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
            : undefined,
          customFilters: LENS_CUSTOM_FILTERS
        }
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedSimpleProfile?.id,
    onCompleted: (notificationsData) => {
      if (selectedSimpleProfile && notificationsData) {
        const id = notificationsData?.notifications?.items[0].id
        setHasNewNotification(latestNotificationId !== id)
        setLatestNotificationId(id)
      }
    }
  })

  return (
    <div
      className={clsx(
        'dark:bg-theme/90 sticky left-0 right-0 top-0 z-10 flex w-full items-center bg-white/90 py-2.5 backdrop-blur-xl',
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
            {selectedSimpleProfile?.id ? (
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
