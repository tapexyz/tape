import MetaTags from '@components/Common/MetaTags'
import { StreamChannelType } from '@tape.xyz/lens/custom-types'
import { useRouter } from 'next/router'
import React from 'react'

import Rad from './Channel/Rad'
import Unlonely from './Channel/Unlonely'

const WatchStream = () => {
  const {
    query: { slug }
  } = useRouter()
  const channel = (slug as string[])[1]

  return (
    <>
      <MetaTags title="Live" />
      <div className="ultrawide:max-w-screen-ultrawide max-w-screen-desktop mx-auto">
        {channel === StreamChannelType.Unlonely && (
          <Unlonely channel={channel} />
        )}
        {channel === StreamChannelType.Rad && <Rad />}
      </div>
    </>
  )
}

export default WatchStream
