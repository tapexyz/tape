import type { Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React from 'react'

import Timeline from '../home/Timeline'

type Props = {
  profile: Profile
}

const Replies: FC<Props> = () => {
  return <Timeline />
}

export default Replies
