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
    <div className="ultrawide:max-w-[110rem] relative mx-auto flex pt-4">
      {scrollX !== 0 && (
        <div className="ultrawide:pl-0 sticky right-0 bottom-0 bg-transparent px-2 ">
          <button
            type="button"
            className="hidden rounded-full p-2 backdrop-blur-xl hover:bg-gray-500 hover:bg-opacity-20 focus:outline-none md:block"
            onClick={() => slide(-scrollOffset)}
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
        </div>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar ultrawide:px-0 flex touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth px-2 md:mx-auto"
      >
        <button
          type="button"
          onClick={() => onFilter('all')}
          className={clsx(
            'rounded-full border border-gray-200 px-3.5 py-1 text-xs capitalize dark:border-gray-700',
            activeTagFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 dark:bg-gray-800'
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
              'whitespace-nowrap rounded-full border border-gray-200 px-3.5 py-1 text-xs capitalize dark:border-gray-700',
              activeTagFilter === category.tag
                ? 'bg-black text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
      {!scrollEnd && (
        <div className="ultrawide:pr-0 sticky right-0 bottom-0 bg-transparent px-2">
          <button
            type="button"
            className="hidden rounded-full p-2 backdrop-blur-xl hover:bg-gray-500 hover:bg-opacity-20 focus:outline-none md:block"
            onClick={() => slide(scrollOffset)}
          >
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryFilters
