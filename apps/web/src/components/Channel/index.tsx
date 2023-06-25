import MetaTags from '@components/Common/MetaTags'
import ChannelShimmer from '@components/Shimmers/ChannelShimmer'
import { Analytics, TRACK } from '@lenstube/constants'
import type { Profile } from '@lenstube/lens'
import { useProfileQuery } from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import BasicInfo from './BasicInfo'
import Tabs from './Tabs'

const Channel = () => {
  const { query } = useRouter()
  const handle = query.channel ?? ''
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.CHANNEL })
  }, [])

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle },
      who: selectedChannel?.id ?? null
    },
    skip: !handle
  })

  if (error) {
    return <Custom500 />
  }
  if (loading || !data) {
    return <ChannelShimmer />
  }
  if (!data?.profile) {
    return <Custom404 />
  }

  const channel = data?.profile as Profile

  return (
    <>
      <MetaTags title={channel?.handle} />
      {!loading && !error && channel ? (
        <>
          <BasicInfo channel={channel} />
          <Tabs channel={channel} />
        </>
      ) : null}
    </>
  )
}

export default Channel
