import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import { ADMIN_IDS, LENSTUBE_APP_ID } from '@utils/constants'
import useIsMounted from '@utils/hooks/useIsMounted'
import dynamic from 'next/dynamic'
import React from 'react'
import {
  FcCollect,
  FcComments,
  FcLikePlaceholder,
  FcSynchronize,
  FcTabletAndroid,
  FcVideoCall
} from 'react-icons/fc'
import type { GlobalProtocolStats } from 'src/types/lens'
import { GlobalProtocolStatsDocument } from 'src/types/lens'

const StatCard = dynamic(() => import('./StatCard'))
const Deployment = dynamic(() => import('./Deployment'))
const Custom404 = dynamic(() => import('../../pages/404'))

const Stats = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const { mounted } = useIsMounted()
  const { data, loading } = useQuery(GlobalProtocolStatsDocument, {
    variables: {
      request: {
        sources: [LENSTUBE_APP_ID]
      }
    }
  })

  if (!ADMIN_IDS.includes(selectedChannel?.id) && mounted) {
    return <Custom404 />
  }
  const stats = data?.globalProtocolStats as GlobalProtocolStats
  const bytesStats = data?.bytesStats as GlobalProtocolStats

  return (
    <>
      <MetaTags title="Lenstube Stats" />
      {loading && !mounted ? (
        <Loader />
      ) : (
        <>
          <Deployment />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 md:grid-cols-3">
            <StatCard
              icon={<FcVideoCall />}
              count={stats?.totalPosts}
              text="total videos"
            />
            <StatCard
              icon={<FcComments />}
              count={stats?.totalComments}
              text="total comments"
            />
            <StatCard
              icon={<FcSynchronize />}
              count={stats?.totalMirrors}
              text="total mirrors"
            />
            <StatCard
              icon={<FcTabletAndroid />}
              count={bytesStats?.totalPosts}
              text="total bytes"
            />
            <StatCard
              icon={<FcLikePlaceholder />}
              count={stats?.totalFollows}
              text="total subscriptions"
            />
            <StatCard
              icon={<FcCollect />}
              count={stats?.totalCollects}
              text="total collects"
            />
          </div>
        </>
      )}
    </>
  )
}

export default Stats
