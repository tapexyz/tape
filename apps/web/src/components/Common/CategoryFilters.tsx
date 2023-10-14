import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import clsx from 'clsx'
import React, { useRef } from 'react'

import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'

const CategoryFilters = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag)
    Analytics.track(TRACK.FILTER_CATEGORIES)
  }

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  return (
    <div className="ultrawide:pt-8 laptop:pt-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xl">
          <h1 className="font-bold text-blue-400">
            <Trans>Explore</Trans>
          </h1>
          <h1>
            <Trans>Categories</Trans>
          </h1>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => scroll(-scrollOffset)}
            className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-900"
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(scrollOffset)}
            className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-900"
          >
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={sectionRef}
        className="no-scrollbar ultrawide:py-8 laptop:py-6 flex touch-pan-x items-center overflow-x-auto scroll-smooth py-4 md:mx-auto"
      >
        <button
          className={clsx(
            'whitespace-nowrap px-6 py-2.5 font-bold',
            activeTagFilter === 'all'
              ? 'from-brand-100 border-brand-400 via-brand-50 border-b-2 bg-gradient-to-t to-transparent'
              : 'border-b opacity-50'
          )}
          onClick={() => onFilter('all')}
        >
          <Trans>All</Trans>
        </button>
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <button
            key={category.tag}
            className={clsx(
              'whitespace-nowrap px-6 py-2.5 font-bold',
              activeTagFilter === category.tag
                ? 'from-brand-100 border-brand-400 via-brand-50 border-b-2 bg-gradient-to-t to-transparent'
                : 'border-b opacity-50'
            )}
            onClick={() => onFilter(category.tag)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilters
