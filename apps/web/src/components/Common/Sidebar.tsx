import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { DRAGVERSE_SPATIAL_URL, FALLBACK_COVER_URL } from 'utils'
import { getShowFullScreen } from 'utils/functions/getShowFullScreen'
import Footer from './Footer'
import BytesOutline from './Icons/BytesOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import Locale from './Locale'
import MobileBottomNav from './MobileBottomNav'

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar: React.FC = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  const isActivePath = (path: string) => router.pathname === path

  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <CreateChannel />
      <div
        className={clsx(
          'transition-width bg-theme fixed bottom-0 left-0 top-0 z-10 hidden items-start justify-between md:flex md:flex-col',
          sidebarCollapsed ? 'w-[90px]' : 'w-[180px]'
        )}
      >
        <div
          className={clsx(
            'flex flex-col space-y-2',
            sidebarCollapsed ? 'self-center' : 'w-full px-[18px]'
          )}
          data-testid="sidebar-items"
        >
          <div className={clsx('py-3', sidebarCollapsed ? 'px-2' : 'px-3.5')}>
            <Link
              href="/"
              className="flex items-center pt-0.5 focus:outline-none"
            >
              <img
                src={`${FALLBACK_COVER_URL}`}
                draggable={false}
                className="h-8 w-8"
                alt="dragverse"
              />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <Tooltip
              content={t`Home`}
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <HomeOutline className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">
                    <Trans>Home</Trans>
                  </span>
                )}
              </Link>
            </Tooltip>
            <Tooltip
              content={t`Subscriptions`}
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/feed"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/feed')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <FeedOutline className="h-5 w-5 flex-none" />
                {!sidebarCollapsed && (
                  <span className="text-sm">
                    <Trans>Subscriptions</Trans>
                  </span>
                )}
              </Link>
            </Tooltip>
            <Tooltip
              content={t`Bytes`}
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/bytes"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/bytes') || router.pathname === '/bytes/[id]'
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <BytesOutline className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">
                    <Trans>Bytes</Trans>
                  </span>
                )}
              </Link>
            </Tooltip>
            <Tooltip
              content={t`Explore`}
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/explore"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/explore')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <ExploreOutline className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">
                    <Trans>Explore</Trans>
                  </span>
                )}
              </Link>
            </Tooltip>
            {/* <Tooltip
              content="Livestream"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/livestream"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/livestream')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <NewVideoOutline className="h-4 w-4" />
                {!sidebarCollapsed && (
                  <span className="text-sm">Livestream</span>
                )}
              </Link>
            </Tooltip> */}
            <Tooltip
              content="Metaverse"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href={`${DRAGVERSE_SPATIAL_URL}`}
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/explore')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <RiGamepadLine className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">Metaverse</span>
                )}
              </Link>
            </Tooltip>
            {/* {getIsFeatureEnabled(
              FEATURE_FLAGS.LENSTUBE_ECHOS,
              selectedChannel?.id
            ) && (
              <Tooltip
                content="Echos"
                placement="right"
                visible={sidebarCollapsed}
              >
                <Link
                  href="/echos"
                  className={clsx(
                    'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                    isActivePath('/echo')
                      ? 'bg-indigo-50 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                    sidebarCollapsed
                      ? 'w-12 justify-center'
                      : 'w-full space-x-3 px-4'
                  )}
                >
                  <MusicOutline className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="text-sm">Echo</span>}
                </Link>
              </Tooltip>
            )} */}
          </div>
        </div>
        <div
          className={clsx(
            'mb-1 flex flex-col',
            sidebarCollapsed ? 'mx-auto' : 'px-3'
          )}
        >
          {!sidebarCollapsed && <Footer />}
          <Locale />
          <button
            type="button"
            className={clsx(
              'mt-2 flex h-12 items-center justify-center rounded-full p-3.5 opacity-90 hover:bg-gray-50 hover:opacity-100 focus:outline-none dark:hover:bg-gray-800',
              sidebarCollapsed ? 'w-12' : 'w-full'
            )}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRightOutline className="h-3 w-3" />
            ) : (
              <ChevronLeftOutline className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
