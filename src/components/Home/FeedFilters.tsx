import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import { EXPLORE } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { RiLeafLine } from 'react-icons/ri'

const FeedFilters = () => {
  return (
    <div className="flex mb-3 space-x-2 overflow-x-scroll md:hidden touch-pan-x no-scrollbar">
      <Link
        href={EXPLORE}
        className="rounded-full border space-x-1 flex items-center text-xs border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181818] px-3 py-1 transition duration-300 ease-in-out"
      >
        <RiLeafLine />
        <span>Explore</span>
      </Link>
      {CREATOR_VIDEO_CATEGORIES.map(({ tag }) => (
        <Link
          href={tag}
          key={tag}
          className="rounded-full border text-xs border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181818] px-3 py-1 transition duration-300 ease-in-out"
        >
          <span className="capitalize">{tag}</span>
        </Link>
      ))}
    </div>
  )
}

export default FeedFilters
