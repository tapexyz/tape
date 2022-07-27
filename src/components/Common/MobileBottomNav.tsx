import { BYTES, FEED, HOME, LIBRARY, UPLOAD } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsPlusCircle } from 'react-icons/bs'
import { FiHome } from 'react-icons/fi'
import {
  MdOutlineSubscriptions,
  MdOutlineVideoLibrary,
  MdSlowMotionVideo
} from 'react-icons/md'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
      <div
        className={clsx(
          'grid grid-cols-5 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-black space-between'
        )}
      >
        <Link href={HOME}>
          <a className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <FiHome
              className={clsx('text-lg opacity-80', {
                'text-indigo-500 opacity-100': isActivePath(HOME)
              })}
            />
            <span className="text-[9px]">Home</span>
          </a>
        </Link>
        <Link href={BYTES}>
          <a className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <MdSlowMotionVideo
              className={clsx('text-xl opacity-80', {
                'text-indigo-500 opacity-100': isActivePath(BYTES)
              })}
            />
            <span className="text-[9px]">Bytes</span>
          </a>
        </Link>
        <Link href={UPLOAD}>
          <a className="flex flex-col items-center justify-center w-full text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <BsPlusCircle className="text-3xl opacity-80" />
          </a>
        </Link>
        <Link href={FEED}>
          <a className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <MdOutlineSubscriptions
              className={clsx('text-xl opacity-80', {
                'text-indigo-500 opacity-100': isActivePath(FEED)
              })}
            />
            <span className="text-[9px]">Feed</span>
          </a>
        </Link>
        <Link href={LIBRARY}>
          <a className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid">
            <MdOutlineVideoLibrary
              className={clsx('text-xl opacity-80', {
                'text-indigo-500 opacity-100': isActivePath(LIBRARY)
              })}
            />
            <span className="text-[9px]">Library</span>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
