import SquareButtonShimmer from '@components/Shimmers/SquareButtonShimmer'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { EXPLORE, HOME, LIBRARY } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { FiHome } from 'react-icons/fi'
import { MdOutlineVideoLibrary } from 'react-icons/md'
import { RiLeafLine } from 'react-icons/ri'

const ToggleTheme = dynamic(() => import('./ToggleTheme'), {
  loading: () => <SquareButtonShimmer />,
  ssr: false
})

const Sidebar = () => {
  const router = useRouter()
  const { isSideBarOpen, setIsSidebarOpen } = useAppStore()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div
      className={clsx(
        'fixed top-0 group bottom-0 left-0 items-start justify-between hidden px-3 py-2.5 bg-white dark:bg-black md:flex md:flex-col',
        {
          'w-44': isSideBarOpen,
          'w-16': !isSideBarOpen
        }
      )}
    >
      <button
        onClick={() => setIsSidebarOpen(!isSideBarOpen)}
        className="absolute invisible group-hover:visible p-0.5 dark:bg-gray-900 bg-white rounded-full bottom-[18px] -right-2.5"
      >
        {isSideBarOpen ? <BiChevronLeft /> : <BiChevronRight />}
      </button>
      <div
        className={clsx('flex flex-col w-full space-y-5', {
          'items-start': isSideBarOpen,
          'items-center': !isSideBarOpen
        })}
      >
        <Link href={HOME}>
          <a
            className={clsx('flex items-center mt-2 space-x-2', {
              'mx-3': isSideBarOpen,
              'mx-1': !isSideBarOpen
            })}
          >
            <img
              src="/lenstube.svg"
              draggable={false}
              className="w-6 h-6"
              alt=""
            />
            {isSideBarOpen && <span className="text-lg">Lenstube</span>}
          </a>
        </Link>
        <div
          className={clsx('flex flex-col items-center w-full', {
            'space-y-2': !isSideBarOpen,
            'space-y-0.5': isSideBarOpen
          })}
        >
          <Tooltip visible={!isSideBarOpen} content="Home" placement="right">
            <div
              className={clsx(
                'rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900',
                {
                  'w-full px-3': isSideBarOpen,
                  'bg-gray-100 dark:bg-gray-900': isActivePath(HOME)
                }
              )}
            >
              <Link href={HOME} passHref>
                <div className="flex items-center p-2 space-x-2 hover:opacity-100 opacity-80">
                  <FiHome className="text-lg" />
                  {isSideBarOpen && <span className="text-sm">Home</span>}
                </div>
              </Link>
            </div>
          </Tooltip>
          <Tooltip visible={!isSideBarOpen} content="Explore" placement="right">
            <div
              className={clsx(
                'rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900',
                {
                  'w-full px-3': isSideBarOpen,
                  'bg-gray-100 dark:bg-gray-900': isActivePath(EXPLORE)
                }
              )}
            >
              <Link href={EXPLORE} passHref>
                <div className="flex items-center p-2 space-x-2 hover:opacity-100 opacity-80">
                  <RiLeafLine className="text-lg" />
                  {isSideBarOpen && <span className="text-sm">Explore</span>}
                </div>
              </Link>
            </div>
          </Tooltip>
          <Tooltip visible={!isSideBarOpen} content="Library" placement="right">
            <div
              className={clsx(
                'rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900',
                {
                  'w-full px-3': isSideBarOpen,
                  'bg-gray-100 dark:bg-gray-900': isActivePath(LIBRARY)
                }
              )}
            >
              <Link href={LIBRARY} passHref>
                <div className="flex items-center p-2 space-x-2 hover:opacity-100 opacity-80">
                  <MdOutlineVideoLibrary className="text-lg" />
                  {isSideBarOpen && <span className="text-sm">Library</span>}
                </div>
              </Link>
            </div>
          </Tooltip>
        </div>
      </div>
      <ToggleTheme />
    </div>
  )
}

export default Sidebar
