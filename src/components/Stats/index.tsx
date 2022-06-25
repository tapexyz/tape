import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import usePersistStore from '@lib/store/persist'
import { ADMIN_IDS, LENSTUBE_APP_ID } from '@utils/constants'
import { GET_LENSTUBE_STATS } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import dynamic from 'next/dynamic'
import React from 'react'
import {
  FcCamcorderPro,
  FcCollect,
  FcComments,
  FcLikePlaceholder,
  FcSynchronize,
  FcVideoCall
} from 'react-icons/fc'
import { GlobalProtocolStats } from 'src/types'

const StatCard = dynamic(() => import('./StatCard'))
const Deployment = dynamic(() => import('./Deployment'))
const Custom404 = dynamic(() => import('../../pages/404'))

const Stats = () => {
  const { selectedChannel } = usePersistStore()
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
        </>
      )}
    </>
  )
}

export default Stats
