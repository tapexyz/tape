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
  FcSynchronize,
  FcVideoCall
} from 'react-icons/fc'
import Custom404 from 'src/pages/404'
import { GlobalProtocolStats } from 'src/types'

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
        <div className="flex flex-wrap justify-center gap-4">
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
            icon={<FcCollect />}
            count={stats?.totalCollects}
            text="total collects"
          />
          <StatCard
            icon={<FcSynchronize />}
            count={stats?.totalMirrors}
            text="total mirrors"
          />
          <StatCard
            icon={<FcCamcorderPro />}
            count={stats?.totalProfiles}
            text="total channels"
          />
        </div>
      )}
    </Layout>
  )
}

export default Stats
