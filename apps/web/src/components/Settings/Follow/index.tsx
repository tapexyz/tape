import MetaTags from '@components/Common/MetaTags'
import type { Profile } from '@tape.xyz/lens'
import React from 'react'

import FeeFollow from './FeeFollow'
import RevertFollow from './RevertFollow'

type Props = {
  profile: Profile
}

const FollowSettings = ({ profile }: Props) => {
  return (
    <>
      <MetaTags title="Follow Settings" />
      <div className="space-y-4">
        <FeeFollow profile={profile} />
        <RevertFollow profile={profile} />
      </div>
    </>
  )
}

export default FollowSettings
