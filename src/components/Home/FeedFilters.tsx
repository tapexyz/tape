import { MOBILE_VIEW_CATEGORIES } from '@utils/data/categories'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { RiLeafLine } from 'react-icons/ri'

const FeedFilters = () => {
  return (
    <div className="flex mb-3 space-x-2 overflow-x-scroll md:hidden touch-pan-x no-scrollbar">
      {MOBILE_VIEW_CATEGORIES.map(({ path, name }) => (
        <Link
          href={path}
          key={name}
          className={clsx(
            'rounded-full border text-xs border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181818] px-3 py-1 transition duration-300 ease-in-out',
            {
              'space-x-1 flex items-center': path === '/explore'
            }
          )}
        >
          {path === '/explore' && <RiLeafLine />}
          <span>{name}</span>
        </Link>
      ))}
    </div>
  )
}

export default FeedFilters
