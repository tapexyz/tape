import { useQuery } from '@apollo/client'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { Profile } from 'src/types'

const OtherChannelCard = dynamic(() => import('./OtherChannelCard'))

type Props = {
  channel: Profile
}

const OtherChannels: FC<Props> = ({ channel }) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: channel.ownedBy },
    skip: !channel?.ownedBy
  })
  const allChannels: Profile[] = data?.profiles?.items

  if (loading) return <OtherChannelsShimmer />

  if (data?.profiles?.items?.length === 1) {
    return <NoDataFound text="No other channels found." />
  }

  return (
    <div className="flex flex-wrap justify-center space-y-3 md:space-y-0 md:justify-start md:space-x-3">
      {allChannels.map(
        (el, idx) =>
          el.id !== channel.id && <OtherChannelCard channel={el} key={idx} />
      )}
    </div>
  )
}

export default OtherChannels
