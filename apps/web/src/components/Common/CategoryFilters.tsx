import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
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
        className="no-scrollbar ultrawide:py-8 laptop:py-6 flex touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth py-4 md:mx-auto"
      >
        <Button
          highContrast={activeTagFilter === 'all'}
          variant={activeTagFilter === 'all' ? 'outline' : 'soft'}
          onClick={() => onFilter('all')}
        >
          <Trans>All</Trans>
        </Button>
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <Button
            key={category.tag}
            highContrast={activeTagFilter === category.tag}
            variant={activeTagFilter === category.tag ? 'outline' : 'soft'}
            onClick={() => onFilter(category.tag)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilters
