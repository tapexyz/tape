import { filters } from '@utils/constants'
import Link from 'next/link'
import React from 'react'

const FeedFilters = () => {
  return (
    <div className="md:hidden flex space-x-2 cursor-pointer touch-pan-x overflow-x-scroll no-scrollbar mb-3">
      {filters.map((filter) => (
        <Link
          href={`/explore/${
            filter.name.includes('Explore') ? '' : filter.name.toLowerCase()
          }`}
          key={filter.name}
        >
          <div className="cursor rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181818] px-3 py-1 transition duration-300 ease-in-out md:hover:scale-105">
            {filter.name}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FeedFilters
