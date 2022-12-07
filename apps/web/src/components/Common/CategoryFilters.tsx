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
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += shift
      setScrollX(scrollX + shift)
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
    <div
      ref={scrollRef}
      className="flex relative items-center px-2 scroll-smooth overflow-x-auto touch-pan-x no-scrollbar pt-4 space-x-2 ultrawide:max-w-[110rem] mx-auto"
    >
      {scrollX !== 0 && (
        <button
          type="button"
          className="bg-gray-500 hidden md:block sticky left-0 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
          onClick={() => slide(-scrollOffset)}
        >
          <ChevronLeftOutline className="w-4 h-4" />
        </button>
      )}
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
      {!scrollEnd && (
        <button
          type="button"
          className="bg-gray-500 hidden md:block sticky right-0 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
          onClick={() => slide(scrollOffset)}
        >
          <ChevronRightOutline className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default CategoryFilters
