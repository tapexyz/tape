import { Analytics, TRACK, useHorizontalScroll } from '@lenstube/browser'
import { CREATOR_VIDEO_CATEGORIES } from '@lenstube/constants'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Badge, IconButton } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'

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
    <div
      className="ultrawide:max-w-[90rem] relative mx-auto flex px-2 pt-4"
      data-testid="category-filters"
    >
      {scrollX !== 0 && (
        <div className="ultrawide:pl-0 sticky bottom-0 right-0 hidden items-center bg-transparent px-2 md:flex">
          <IconButton
            color="gray"
            variant="ghost"
            onClick={() => slide(-scrollOffset)}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar ultrawide:px-0 flex touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth md:mx-auto"
      >
        <Badge
          color="gray"
          variant={activeTagFilter === 'all' ? 'solid' : 'outline'}
          onClick={() => onFilter('all')}
        >
          <Trans>All</Trans>
        </Badge>
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <Badge
            key={category.tag}
            color="gray"
            variant={activeTagFilter === category.tag ? 'solid' : 'outline'}
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
            <ChevronRightIcon />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default CategoryFilters
