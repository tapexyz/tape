import ButtonShimmer from '@components/Shimmers/ButtonShimmer'
import SquareButtonShimmer from '@components/Shimmers/SquareButtonShimmer'
import { HOME } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import Login from './Login'
import GlobalSearchBar from './Search/GlobalSearchBar'

const MoreTrigger = dynamic(
  () => import('../../components/Common/MoreTrigger'),
  { loading: () => <SquareButtonShimmer /> }
)
const NewVideoTrigger = dynamic(
  () => import('../../components/Channel/NewVideoTrigger'),
  { loading: () => <ButtonShimmer /> }
)
const NotificationTrigger = dynamic(
  () => import('../../components/Notifications/NotificationTrigger'),
  { loading: () => <SquareButtonShimmer /> }
)

const Header = () => {
  return (
    <div
      className={clsx(
        'fixed z-10 flex md:left-[94px] right-2 left-2 md:right-4 items-center justify-between bg-white dark:bg-black h-14 md:h-16'
      )}
    >
      <div className="flex items-center space-x-1.5 md:space-x-0">
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
        <MoreTrigger />
      </div>
      <div className="hidden md:block">
        <GlobalSearchBar />
      </div>
      <div className="flex flex-row items-center space-x-3">
        <NotificationTrigger />
        <NewVideoTrigger />
        <Login />
      </div>
    </div>
  )
}

export default Header
