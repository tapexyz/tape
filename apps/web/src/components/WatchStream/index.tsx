import MetaTags from '@components/Common/MetaTags'
import { EVENTS, Tower } from '@dragverse/generic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Channel from './Channel'

const WatchStream = () => {
  const {
    query: { slug }
  } = useRouter()
  const channelId = (slug as string[])?.[1]

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.WATCH_STREAM })
  }, [])

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
