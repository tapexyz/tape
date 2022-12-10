import StatCard from '@components/Stats/StatCard'
import type { Profile, ProfileStats } from 'lens'
import { useAllProfilesQuery } from 'lens'
import type { FC } from 'react'
import React from 'react'
import {
  FcCamcorderPro,
  FcCollect,
  FcComments,
  FcLikePlaceholder,
  FcSynchronize,
  FcVideoCall
} from 'react-icons/fc'

type Props = {
  channel: Profile
}

const ChannelStats: FC<Props> = ({ channel }) => {
  const stats: ProfileStats = channel.stats

  const { data } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: channel?.ownedBy }
    },
    skip: !channel?.ownedBy
  })

  const allChannels = data?.profiles?.items as Profile[]

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
