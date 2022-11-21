import type { Profile } from 'lens'
import type { FC } from 'react'
import React from 'react'
import getProfilePicture from 'utils/functions/getProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import truncate from 'utils/functions/truncate'

import MetaTags from './MetaTags'

type Props = {
  channel: Profile
}

const Channel: FC<Props> = ({ channel }) => {
  return (
    <div className="relative w-screen h-screen">
      <MetaTags
        title={channel?.name ?? channel.handle}
        description={truncate(channel?.bio as string, 100)}
        image={imageCdn(getProfilePicture(channel), 'avatar_lg')}
      />
      {channel?.name ?? channel.handle}
    </div>
  )
}

export default Channel
