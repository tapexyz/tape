import React from 'react'

import ChannelCardShimmer from './ChannelCardShimmer'

const OtherChannelsShimmer = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start md:space-x-3">
      <ChannelCardShimmer />
      <ChannelCardShimmer />
      <ChannelCardShimmer />
      <ChannelCardShimmer />
    </div>
  )
}

export default OtherChannelsShimmer
