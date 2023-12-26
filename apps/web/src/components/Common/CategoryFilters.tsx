import type { FC } from 'react'

import useAppStore from '@lib/store'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import clsx from 'clsx'
import React, { useRef } from 'react'

import HorizantalScroller from './HorizantalScroller'

type Props = {
  heading?: string
  subheading?: string
}

const CategoryFilters: FC<Props> = ({ heading, subheading }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { activeTagFilter, setActiveTagFilter } = useAppStore()

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag)
    Tower.track(EVENTS.FILTER_CATEGORIES)
  }

  return (
    <div className="sticky top-0 z-[9] bg-white dark:bg-black">
      <HorizantalScroller
        heading={heading ?? 'Explore'}
        sectionRef={sectionRef}
        subheading={subheading ?? 'Categories'}
      />
      <div
        className="no-scrollbar laptop:pt-6 flex items-center overflow-x-auto scroll-smooth pt-4 md:mx-auto"
        ref={sectionRef}
      >
        <button
          className={clsx(
            'whitespace-nowrap px-10 py-2.5 font-medium',
            activeTagFilter === 'all'
              ? 'from-brand-50 border-brand-400 dark:from-brand-950 border-b-2 bg-gradient-to-t to-transparent'
              : 'border-b dark:border-gray-800'
          )}
          onClick={() => onFilter('all')}
        >
          All
        </button>
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <button
            className={clsx(
              'whitespace-nowrap px-6 py-2.5 font-medium',
              activeTagFilter === category.tag
                ? 'from-brand-50 border-brand-400 dark:from-brand-950 border-b-2 bg-gradient-to-t to-transparent'
                : 'border-b dark:border-gray-800'
            )}
            key={category.tag}
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
