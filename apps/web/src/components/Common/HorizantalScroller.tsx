import type { FC, RefObject } from 'react'
import React from 'react'

import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'

type Props = {
  heading: string
  subheading: string
  sectionRef: RefObject<HTMLDivElement>
}

const HorizantalScroller: FC<Props> = ({ heading, subheading, sectionRef }) => {
  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 text-xl">
        <h1 className="text-brand-400 font-bold">{heading}</h1>
        <h1>{subheading}</h1>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => scroll(-scrollOffset)}
          className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
        >
          <ChevronLeftOutline className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll(scrollOffset)}
          className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
        >
          <ChevronRightOutline className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default HorizantalScroller
