import type { FC } from 'react'

import React from 'react'

type Props = {
  onClickVideo: () => void
}

const TopOverlay: FC<Props> = ({ onClickVideo }) => {
  return (
    <div
      className="absolute inset-0 z-[1] w-full cursor-default outline-none"
      onClick={() => onClickVideo()}
      role="button"
      tabIndex={0}
    />
  )
}

export default TopOverlay
