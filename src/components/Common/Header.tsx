import { useQuery } from '@apollo/client'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { PING_QUERY } from '@utils/gql/queries'
import { HOME, NOTIFICATIONS } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'
import { FC } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgBell } from 'react-icons/cg'

import Login from './Login'

const GlobalSearchBar = dynamic(() => import('./Search/GlobalSearchBar'))
const NewVideoTrigger = dynamic(
  () => import('../../components/Channel/NewVideoTrigger')
)
const NotificationTrigger = dynamic(
  () => import('../../components/Notifications/NotificationTrigger')
)

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const isAuthenticated = usePersistStore((state) => state.isAuthenticated)
  const [showShowModal, setSearchModal] = useState(false)

  useQuery(PING_QUERY, {
    pollInterval: 600_000,
    skip: !selectedChannel
  })

  return (
    <div
      className={clsx(
        'sticky top-0 left-0 right-0 z-10 flex w-full items-center bg-white dark:bg-black h-14 md:h-16',
        className
      )}
    >
      <div className="flex justify-between flex-1 md:w-3/4 md:justify-end">
        <div className="flex items-center space-x-1.5 md:space-x-0">
          <Link href={HOME}>
            <a className="block md:hidden">
              <img
                src="/lenstube.svg"
                draggable={false}
                className="w-5 h-5"
                alt="lenstube"
              />
            </a>
          </Link>
          <span />
        </div>
        <div className="hidden md:block">
          <GlobalSearchBar />
        </div>
      </div>
      <div className="flex flex-row items-center justify-end space-x-3 md:w-2/5">
        <button
          type="button"
          onClick={() => setSearchModal(true)}
          className="outline-none md:hidden"
        >
          <AiOutlineSearch className="text-lg" aria-hidden="true" />
        </button>
        {isAuthenticated && <NotificationTrigger />}
        {isAuthenticated && (
          <Link href={NOTIFICATIONS}>
            <a className="relative p-1 md:hidden">
              <CgBell className="text-lg" />
              {hasNewNotification && (
                <span className="absolute flex w-1.5 h-1.5 bg-red-500 rounded-full top-0 right-0" />
              )}
            </a>
          </Link>
        )}
        {isAuthenticated && <NewVideoTrigger />}
        <Login />
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
