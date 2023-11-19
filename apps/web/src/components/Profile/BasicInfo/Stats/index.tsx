import type { Profile } from '@dragverse/lens'
import { Flex } from '@radix-ui/themes'
import type { FC } from 'react'

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
