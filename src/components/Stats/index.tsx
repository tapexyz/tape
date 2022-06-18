import { gql, useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import { ADMIN_IDS, LENSTUBE_APP_ID } from '@utils/constants'
import useIsMounted from '@utils/hooks/useIsMounted'
import React from 'react'
import { FcComments, FcVideoCall } from 'react-icons/fc'
import Custom404 from 'src/pages/404'
import { GlobalProtocolStats } from 'src/types'

const GET_GLOBAL_PROTOCOL_STATS = gql`
  query Stats {
    globalProtocolStats(request: { sources: ${LENSTUBE_APP_ID} }) {
      totalProfiles
      totalPosts
      totalBurntProfiles
      totalMirrors
      totalComments
      totalCollects
      totalFollows
      totalRevenue {
        asset {
          symbol
        }
        value
      }
    }
  }
`

const Stats = () => {
  const { selectedChannel } = useAppStore()
  const { mounted } = useIsMounted()
  const { data, loading } = useQuery(GET_GLOBAL_PROTOCOL_STATS)

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
        <div className="flex flex-wrap space-x-4">
          <div className="p-6 space-y-3 w-44 bg-gray-100 rounded-xl dark:bg-[#181818]">
            <span className="inline-flex p-2 bg-white rounded-lg">
              <FcVideoCall />
            </span>
            <div>
              <h6 className="mb-1 text-3xl font-semibold">
                {stats?.totalPosts}
              </h6>
              <div className="text-xs font-medium opacity-70">
                videos posted
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3 w-44 bg-gray-100 rounded-xl dark:bg-[#181818]">
            <span className="inline-flex p-2 bg-white rounded-lg">
              <FcComments />
            </span>
            <div>
              <h6 className="mb-1 text-3xl font-semibold">
                {stats?.totalComments}
              </h6>
              <div className="text-xs font-medium opacity-70">
                comments posted
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Stats
