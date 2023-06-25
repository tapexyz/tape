import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'

import OtherChannelCard from './OtherChannelCard'

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
