import MetaTags from '@components/Common/MetaTags'
import ChannelShimmer from '@components/Shimmers/ChannelShimmer'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { trimLensHandle } from '@tape.xyz/generic'
import { type Profile, useProfileQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import BasicInfo from './BasicInfo'
import Tabs from './Tabs'

const Channel = () => {
  const { query } = useRouter()
  const handle = query.channel ?? ''

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.CHANNEL })
  }, [])

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { forHandle: `test/@${trimLensHandle(handle as string)}` }
    },
    skip: !handle
  })

  if (error) {
    return <Custom500 />
  }
  if (loading) {
    return <ChannelShimmer />
  }
  if (!data?.profile) {
    return <Custom404 />
  }

  const profile = data?.profile as Profile

  return (
    <>
      <MetaTags title={profile?.handle} />
      {!loading && !error && profile ? (
        <>
          <BasicInfo profile={profile} />
          <Tabs profile={profile} />
        </>
      ) : null}
    </>
  )
}

export default Channel
