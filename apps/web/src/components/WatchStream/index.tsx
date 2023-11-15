import MetaTags from '@components/Common/MetaTags'
import { useRouter } from 'next/router'
import React from 'react'

import Channel from './Channel'

const WatchStream = () => {
  const {
    query: { slug }
  } = useRouter()
  const channelId = (slug as string[])?.[1]

  return (
    <>
      <MetaTags title="Live" />
      <div className="ultrawide:max-w-screen-ultrawide max-w-screen-desktop mx-auto">
        <Channel id={channelId} />
      </div>
    </>
  )
}

export default WatchStream
