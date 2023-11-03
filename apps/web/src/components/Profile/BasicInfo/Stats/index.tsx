import { Flex } from '@radix-ui/themes'
import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import Followers from './Followers'
import Following from './Following'

type Props = {
  profile: Profile
}

const Stats: FC<Props> = ({ profile }) => {
  return (
    <Flex gap="3">
      <Followers stats={profile.stats} profileId={profile.id} />
      <Following stats={profile.stats} profileId={profile.id} />
    </Flex>
  )
}

export default Stats
