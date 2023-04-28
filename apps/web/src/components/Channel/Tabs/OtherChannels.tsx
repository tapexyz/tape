import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import type { Profile } from 'lens'
import { useAllProfilesQuery } from 'lens'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'

const OtherChannelCard = dynamic(() => import('./OtherChannelCard'))

type Props = {
  channel: Profile
}

const OtherChannels: FC<Props> = ({ channel }) => {
  const { data, loading } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: channel?.ownedBy }
    },
    skip: !channel?.ownedBy
  })
  const allChannels = data?.profiles?.items as Profile[]

  if (loading) {
    return <OtherChannelsShimmer />
  }

  if (allChannels?.length === 1) {
    return <NoDataFound isCenter withImage text={t`No other channels found`} />
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      {allChannels?.map(
        (chnl) =>
          chnl.id !== channel.id && (
            <OtherChannelCard channel={chnl} key={chnl.id} />
          )
      )}
    </div>
  )
}

export default OtherChannels
