import useAppStore from '@lib/store'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Analytics, TRACK } from 'utils'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'
import useHorizontalScroll from 'utils/hooks/useHorizantalScroll'

import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'

const CategoryFilters = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)

  const [scrollX, setScrollX] = useState(0)
  const [scrollEnd, setScrollEnd] = useState(false)

  const scrollRef = useHorizontalScroll()

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag)
    Analytics.track(TRACK.FILTER_CATEGORIES)
  }

  const sectionOffsetWidth = scrollRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  useEffect(() => {
    if (
      scrollRef.current &&
      scrollRef?.current?.scrollWidth === scrollRef?.current?.offsetWidth
    ) {
      setScrollEnd(true)
    } else {
      setScrollEnd(false)
    }
  }, [scrollRef])

  const slide = (shift: number) => {
    Analytics.track(TRACK.CLICK_CATEGORIES_SCROLL_BUTTON)
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += shift
      const scrollLeft = scrollRef.current.scrollLeft
      setScrollX(scrollLeft === 0 ? 0 : scrollX + shift)
      if (
        Math.floor(
          scrollRef.current.scrollWidth - scrollRef.current.scrollLeft
        ) <= scrollRef.current.offsetWidth
      ) {
        setScrollEnd(true)
      } else {
        setScrollEnd(false)
      }
    }
  }

  return (
    <div className="relative flex pt-4">
      {scrollX !== 0 && (
        <div className="bg-transparent sticky right-0 bottom-0 px-2">
          <button
            type="button"
            className="hover:bg-gray-500 hidden md:block focus:outline-none hover:bg-opacity-20 backdrop-blur-xl rounded-full p-2"
            onClick={() => slide(-scrollOffset)}
          >
            <ChevronLeftOutline className="w-4 h-4" />
          </button>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex items-center px-2 scroll-smooth overflow-x-auto touch-pan-x no-scrollbar gap-2 ultrawide:max-w-[110rem] md:mx-auto"
      >
        <button
          type="button"
          onClick={() => onFilter('all')}
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
            onClick={() => onFilter(category.tag)}
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
      {!scrollEnd && (
        <div className="bg-transparent sticky right-0 bottom-0 px-2">
          <button
            type="button"
            className="hover:bg-gray-500 hidden md:block focus:outline-none hover:bg-opacity-20 backdrop-blur-xl rounded-full p-2"
            onClick={() => slide(scrollOffset)}
          >
            <ChevronRightOutline className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryFilters
