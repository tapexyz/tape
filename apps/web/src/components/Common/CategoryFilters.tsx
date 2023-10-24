import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import clsx from 'clsx'
import React, { useRef } from 'react'

import HorizantalScroller from './HorizantalScroller'

const CategoryFilters = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const setActiveTagFilter = useAppStore((state) => state.setActiveTagFilter)

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag)
    Tower.track(EVENTS.FILTER_CATEGORIES)
  }

  return (
    <div className="laptop:pt-6 dark:bg-bunker sticky -top-4 z-[9] bg-white pt-4">
      <HorizantalScroller
        sectionRef={sectionRef}
        heading={t`Explore`}
        subheading={t`Categories`}
      />
      <div
        ref={sectionRef}
        className="no-scrollbar laptop:pt-6 flex items-center overflow-x-auto scroll-smooth pt-4 md:mx-auto"
      >
        <button
          className={clsx(
            'whitespace-nowrap px-10 py-2.5 font-bold',
            activeTagFilter === 'all'
              ? 'from-brand-50 border-brand-400 dark:from-brand-950 border-b-2 bg-gradient-to-t to-transparent'
              : 'border-b opacity-50 dark:border-gray-600'
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
                ? 'from-brand-50 border-brand-400 dark:from-brand-950 border-b-2 bg-gradient-to-t to-transparent'
                : 'border-b opacity-50 dark:border-gray-600'
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
