import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import {
  ADMIN_IDS,
  Analytics,
  LENSTUBE_APP_ID,
  TRACK
} from '@lenstube/constants'
import type { GlobalProtocolStats } from '@lenstube/lens'
import { useGlobalProtocolStatsQuery } from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'

import Deployment from './Deployment'
import Recents from './Recents'
import StatCard from './StatCard'

const Mod = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.MOD })
  }, [])

  const { data, loading } = useGlobalProtocolStatsQuery({
    variables: {
      request: {
        sources: [LENSTUBE_APP_ID]
      }
    }
  })

  if (!ADMIN_IDS.includes(selectedChannel?.id)) {
    return <Custom404 />
  }

  if (loading) {
    return <TimelineShimmer />
  }

  const stats = data?.globalProtocolStats as GlobalProtocolStats
  const bytesStats = data?.bytesStats as GlobalProtocolStats

  return (
    <>
      <MetaTags title={t`Lenstube Stats`} />
      <Deployment />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard count={stats?.totalPosts} text={t`total videos`} />
        <StatCard count={stats?.totalComments} text={t`total comments`} />
        <StatCard count={stats?.totalMirrors} text={t`total mirrors`} />
        <StatCard count={bytesStats?.totalPosts} text={t`total bytes`} />
        <StatCard count={stats?.totalFollows} text={t`total subscriptions`} />
        <StatCard count={stats?.totalCollects} text={t`total collects`} />
      </div>
      <Recents />
    </>
  )
}

export default Mod
