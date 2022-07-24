import { useQuery } from '@apollo/client'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { PROFILE_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { Profile } from 'src/types'

const OtherChannelCard = dynamic(() => import('./OtherChannelCard'))

type Props = {
  channel: Profile
}

const OtherChannels: FC<Props> = ({ channel }) => {
  const { data, loading } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { ownedBy: channel?.ownedBy }
    },
    skip: !channel?.ownedBy
  })
  const allChannels: Profile[] = data?.profiles?.items

  if (loading) return <OtherChannelsShimmer />

  if (data?.profiles?.items?.length === 1) {
    return <NoDataFound isCenter withImage text="No other channels found" />
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
