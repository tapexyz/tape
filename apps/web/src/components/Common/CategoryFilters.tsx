import useAppStore from '@lib/store'
import { tw } from '@tape.xyz/browser'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { FC } from 'react'
import { useRef } from 'react'

import HorizontalScroller from './HorizontalScroller'

type Props = {
  heading?: string
}

const CategoryFilters: FC<Props> = ({ heading }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { activeTagFilter, setActiveTagFilter } = useAppStore()

  const onFilter = (tag: string) => {
    setActiveTagFilter(tag)
    Tower.track(EVENTS.FILTER_CATEGORIES)
  }

  return (
    <div className="sticky top-0 z-[9] bg-white dark:bg-black">
      <HorizontalScroller
        sectionRef={sectionRef}
        heading={heading ?? 'Explore'}
      />
      <div
        ref={sectionRef}
        className="no-scrollbar flex items-center overflow-x-auto scroll-smooth pt-4 md:mx-auto"
      >
        <button
          className={tw(
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
            key={category.tag}
            className={tw(
              'whitespace-nowrap px-6 py-2.5 font-medium',
              activeTagFilter === category.tag
                ? 'from-brand-50 border-brand-400 dark:from-brand-950 border-b-2 bg-gradient-to-t to-transparent'
                : 'border-b dark:border-gray-800'
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
