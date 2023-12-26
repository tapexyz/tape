import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import { Flex } from '@radix-ui/themes'
import React from 'react'

import Followers from './Followers'
import Following from './Following'

type Props = {
  profile: Profile
}

const Stats: FC<Props> = ({ profile }) => {
  return (
    <Flex gap="3">
      <Followers profileId={profile.id} stats={profile.stats} />
      <Following profileId={profile.id} stats={profile.stats} />
    </Flex>
  )
}

export default Stats
