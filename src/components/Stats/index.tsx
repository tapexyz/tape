import { useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import { ADMIN_IDS, LENSTUBE_APP_ID } from '@utils/constants'
import { GET_LENSTUBE_STATS } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import React from 'react'
import {
  FcCamcorderPro,
  FcCollect,
  FcComments,
  FcLikePlaceholder,
  FcSynchronize,
  FcVideoCall
} from 'react-icons/fc'
import Custom404 from 'src/pages/404'
import { Erc20Amount, GlobalProtocolStats } from 'src/types'

import StatCard from './StatCard'

const Stats = () => {
  const { selectedChannel } = useAppStore()
  const { mounted } = useIsMounted()
  const { data, loading } = useQuery(GET_LENSTUBE_STATS, {
    variables: {
      request: {
        sources: [LENSTUBE_APP_ID]
      }
    }
  })

  if (!ADMIN_IDS.includes(selectedChannel?.id) && mounted) {
    return <Custom404 />
  }
  const stats: GlobalProtocolStats = data?.globalProtocolStats

  return (
    <Layout>
      <MetaTags title="Lenstube Stats" />
      {loading && !mounted ? (
        <Loader />
      ) : (
        <>
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
              icon={<FcLikePlaceholder />}
              count={stats?.totalFollows}
              text="total subscriptions"
            />
            <StatCard
              icon={<FcCollect />}
              count={stats?.totalCollects}
              text="total collects"
            />
            <StatCard
              icon={<FcCamcorderPro />}
              count={stats?.totalProfiles}
              text="total channels"
            />
            <StatCard
              icon={<FcSynchronize />}
              count={stats?.totalMirrors}
              text="total mirrors"
            />
          </div>
          <div className="p-5 mt-4 space-y-3 bg-gray-100 rounded-xl dark:bg-[#181818]">
            <span className="text-xs uppercase opacity-70">Total Revenue</span>
            <div className="flex flex-wrap gap-3">
              {data?.globalProtocolStats.totalRevenue.map(
                (r: Erc20Amount, i: number) => (
                  <div key={i}>
                    <span className="inline-flex px-4 py-2 space-x-2 bg-white rounded-lg">
                      <b>{r.value}</b> <span>{r.asset.symbol}</span>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default Stats
