import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  onClickVideo: () => void
}

const TopOverlay: FC<Props> = ({ onClickVideo }) => {
  return (
    <div
      role="button"
      onClick={() => onClickVideo()}
      className="absolute inset-0 z-[1] w-full cursor-default outline-none"
    >
      <Link href="/" className="flex p-4 md:hidden">
        <ChevronLeftOutline className="h-4 w-4 text-white" />
      </Link>
    </div>
  )
}

export default TopOverlay
