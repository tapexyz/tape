import { useQuery } from '@apollo/client'
import StatCard from '@components/Stats/StatCard'
import { PROFILES_QUERY } from '@gql/queries'
import React, { FC } from 'react'
import {
  FcCamcorderPro,
  FcCollect,
  FcComments,
  FcLikePlaceholder,
  FcSynchronize,
  FcVideoCall
} from 'react-icons/fc'
import { Profile, ProfileStats } from 'src/types'

type Props = {
  channel: Profile
}

const ChannelStats: FC<Props> = ({ channel }) => {
  const stats: ProfileStats = channel.stats

  const { data } = useQuery(PROFILES_QUERY, {
    variables: {
      request: { ownedBy: channel?.ownedBy }
    },
    skip: !channel?.ownedBy
  })
  const allChannels: Profile[] = data?.profiles?.items || []

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 md:grid-cols-3">
      <StatCard
        icon={<FcVideoCall />}
        count={stats?.totalPosts}
        text="total posts"
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
        icon={<FcLikePlaceholder />}
        count={stats?.totalFollowers}
        text="total subscriptions"
      />
      <StatCard
        icon={<FcCollect />}
        count={stats?.totalCollects}
        text="total collects"
      />
      <StatCard
        icon={<FcCamcorderPro />}
        count={allChannels?.length}
        text="total channels"
      />
    </div>
  )
}

export default ChannelStats
