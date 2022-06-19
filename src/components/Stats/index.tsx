import { useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import {
  ADMIN_IDS,
  GIT_DEPLOYED_BRANCH,
  GIT_DEPLOYED_COMMIT_SHA,
  IS_MAINNET,
  LENSTUBE_APP_ID,
  VERCEL_DEPLOYED_ENV
} from '@utils/constants'
import { GET_LENSTUBE_STATS } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import Link from 'next/link'
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
        <>
          <div className="flex items-center mb-4 space-x-2">
            <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
              {IS_MAINNET ? 'mainnet' : 'testnet'}
            </span>
            {VERCEL_DEPLOYED_ENV && (
              <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg">
                {VERCEL_DEPLOYED_ENV}
              </span>
            )}
            {GIT_DEPLOYED_BRANCH && (
              <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg">
                {GIT_DEPLOYED_BRANCH}
              </span>
            )}
            {GIT_DEPLOYED_COMMIT_SHA && (
              <Link
                href={`https://github.com/sasicodes/lenstube/commit/${GIT_DEPLOYED_COMMIT_SHA}`}
              >
                <a target="_blank">
                  <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg">
                    {GIT_DEPLOYED_COMMIT_SHA?.substring(0, 6)}
                  </span>
                </a>
              </Link>
            )}
          </div>
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
    </Layout>
  )
}

export default Stats
