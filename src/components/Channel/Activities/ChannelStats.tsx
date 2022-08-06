import StatCard from '@components/Stats/StatCard'
import useAppStore from '@lib/store'
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
  const { channels } = useAppStore()

  return (
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
        count={channels.length}
        text="total channels"
      />
    </div>
  )
}

export default ChannelStats
