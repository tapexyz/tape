import useAppStore from '@lib/store'
import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'
import clsx from 'clsx'
import React from 'react'

const TagFilters = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)

  return (
    <div className="flex px-2 scroll-smooth overflow-x-auto touch-pan-x no-scrollbar pt-4 space-x-2 ultrawide:max-w-[110rem] mx-auto">
      <button
        type="button"
        onClick={() => setActiveTagFilter('all')}
        className={clsx(
          'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full',
          activeTagFilter === 'all'
            ? 'bg-black text-white'
            : 'dark:bg-gray-800 bg-gray-100'
        )}
      >
        All
      </button>
      {CREATOR_VIDEO_CATEGORIES.map((category) => (
        <button
          type="button"
          onClick={() => setActiveTagFilter(category.tag)}
          key={category.tag}
          className={clsx(
            'px-3.5 capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap',
            activeTagFilter === category.tag
              ? 'bg-black text-white'
              : 'dark:bg-gray-800 bg-gray-100'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default TagFilters
