import { Analytics, TRACK, useHorizontalScroll } from '@lenstube/browser'
import { CREATOR_VIDEO_CATEGORIES } from '@lenstube/constants'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Badge, IconButton } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'

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
      const scrolled = scrollRef.current.scrollLeft + shift
      scrollRef.current.scrollLeft += shift

      setScrollX(scrolled <= 0 ? 0 : scrollX + shift)

      if (
        Math.floor(scrollRef.current.scrollWidth - scrolled) <=
        scrollRef.current.offsetWidth
      ) {
        setScrollEnd(true)
      } else {
        setScrollEnd(false)
      }
    }
  }

  return (
    <div className="ultrawide:max-w-[90rem] relative mx-auto flex pb-5">
      {scrollX !== 0 && (
        <div className="ultrawide:pl-0 sticky bottom-0 right-0 hidden items-center bg-transparent px-2 md:flex">
          <IconButton
            color="gray"
            variant="ghost"
            onClick={() => slide(-scrollOffset)}
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </IconButton>
        </div>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar flex touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth md:mx-auto"
      >
        <Badge
          color="gray"
          radius="full"
          highContrast={activeTagFilter === 'all'}
          variant={activeTagFilter === 'all' ? 'outline' : 'soft'}
          onClick={() => onFilter('all')}
        >
          <Trans>All</Trans>
        </Badge>
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <Badge
            key={category.tag}
            radius="full"
            highContrast={activeTagFilter === category.tag}
            variant={activeTagFilter === category.tag ? 'outline' : 'soft'}
            onClick={() => onFilter(category.tag)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      {!scrollEnd && (
        <div className="ultrawide:pr-0 sticky bottom-0 right-0 hidden items-center bg-transparent px-2 md:flex">
          <IconButton
            variant="ghost"
            color="gray"
            onClick={() => slide(scrollOffset)}
          >
            <ChevronRightOutline className="h-4 w-4" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default CategoryFilters
