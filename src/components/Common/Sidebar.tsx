import SquareButtonShimmer from '@components/Shimmers/SquareButtonShimmer'
import Tooltip from '@components/UIElements/Tooltip'
import { EXPLORE, HOME, LIBRARY } from '@utils/url-path'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FiHome } from 'react-icons/fi'
import { MdOutlineVideoLibrary } from 'react-icons/md'
import { RiLeafLine } from 'react-icons/ri'

const ToggleTheme = dynamic(() => import('./ToggleTheme'), {
  loading: () => <SquareButtonShimmer />,
  ssr: false
})

const Sidebar = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 items-center justify-between hidden w-16 px-4 py-2.5 bg-gray-100 dark:bg-black md:flex md:flex-col">
      <div className="flex flex-col items-center space-y-5">
        <Link href={HOME}>
          <a className="mt-2">
            <img
              src="/lenstube.svg"
              draggable={false}
              className="w-6 h-6"
              alt=""
            />
          </a>
        </Link>
        <div className="flex flex-col items-center space-y-3">
          <Tooltip content="Home" placement="right">
            <span className="p-1.5 rounded-md cursor-pointer hover:bg-white dark:hover:bg-gray-900 scale-animation">
              <Link href={HOME} passHref>
                <FiHome className="!text-xl group-hover:opacity-100 opacity-80" />
              </Link>
            </span>
          </Tooltip>
          <Tooltip content="Explore" placement="right">
            <span className="p-1.5 rounded-md cursor-pointer hover:bg-white dark:hover:bg-gray-900 scale-animation">
              <Link href={EXPLORE} passHref>
                <RiLeafLine className="!text-xl group-hover:opacity-100 opacity-80" />
              </Link>
            </span>
          </Tooltip>
          <Tooltip content="Library" placement="right">
            <span className="p-1.5 rounded-md cursor-pointer hover:bg-white dark:hover:bg-gray-900 scale-animation">
              <Link href={LIBRARY} passHref>
                <MdOutlineVideoLibrary className="!text-xl group-hover:opacity-100 opacity-80" />
              </Link>
            </span>
          </Tooltip>
        </div>
      </div>
      <ToggleTheme />
    </div>
  )
}

export default Sidebar
