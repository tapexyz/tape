import { EXPLORE, HOME, LIBRARY, NOTIFICATIONS } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CgBell } from 'react-icons/cg'
import { FiHome } from 'react-icons/fi'
import { MdOutlineVideoLibrary } from 'react-icons/md'
import { RiLeafLine } from 'react-icons/ri'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
      <div
        className={clsx(
          'grid grid-cols-4 py-2 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-black space-between'
        )}
      >
        <Link href={HOME}>
          <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <FiHome
              className={clsx('text-xl opacity-60', {
                'text-indigo-500 opacity-100': isActivePath(HOME)
              })}
            />
          </a>
        </Link>
        <Link href={EXPLORE}>
          <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <RiLeafLine
              className={clsx('text-xl opacity-60', {
                'text-indigo-500 opacity-100': isActivePath(EXPLORE)
              })}
            />
          </a>
        </Link>
        <Link href={NOTIFICATIONS}>
          <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <CgBell
              className={clsx('text-xl opacity-60', {
                'text-indigo-500 opacity-100': isActivePath(NOTIFICATIONS)
              })}
            />
          </a>
        </Link>
        <Link href={LIBRARY}>
          <a className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <MdOutlineVideoLibrary
              className={clsx('text-xl opacity-60', {
                'text-indigo-500 opacity-100': isActivePath(LIBRARY)
              })}
            />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
