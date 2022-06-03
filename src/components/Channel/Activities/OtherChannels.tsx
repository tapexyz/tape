import { useQuery } from '@apollo/client'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import Link from 'next/link'
import React, { FC } from 'react'
import { Profile } from 'src/types'

import Subscribe from '../BasicInfo/Subscribe'

type Props = {
  channel: Profile
}

const OtherChannels: FC<Props> = ({ channel }) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: channel.ownedBy },
    skip: !channel?.ownedBy
  })
  const allChannels: Profile[] = data?.profiles?.items

  if (loading) {
    return <OtherChannelsShimmer />
  }
  if (data?.profiles?.items?.length === 1) {
    return <NoDataFound text="No other channels found." />
  }

  return (
    <div className="flex flex-wrap justify-center md:justify-start md:space-x-3">
      {allChannels.map(
        (el, idx) =>
          el.id !== channel.id && (
            <div
              key={idx}
              className="flex w-40 flex-col justify-center p-1.5 border border-gray-100 rounded-md dark:border-gray-900"
            >
              <img
                className="object-cover h-32 rounded-md"
                src={imageCdn(getProfilePicture(el))}
                alt=""
                draggable={false}
              />
              <div className="px-1 py-2 overflow-hidden">
                <Link href={`/${el.handle}`}>
                  <a className="block font-medium truncate">{el.handle}</a>
                </Link>
                <span className="text-xs opacity-70">
                  {el.stats.totalFollowers} subscribers
                </span>
              </div>
              <Subscribe channel={el} />
            </div>
          )
      )}
    </div>
  )
}

export default OtherChannels
