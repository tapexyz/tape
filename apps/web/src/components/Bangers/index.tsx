import { EVENTS, Tower } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import Feed from './Feed'
import New from './New'

const Bangers = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.FEED })
  }, [])

  return (
    <div>
      <New />
      <div className="tape-border container mx-auto max-w-screen-sm !border-y-0">
        <Feed />
      </div>
    </div>
  )
}

export default Bangers
