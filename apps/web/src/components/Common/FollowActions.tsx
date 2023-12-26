import type { FC } from 'react'

import Follow from '@components/Profile/BasicInfo/Follow'
import SuperFollow from '@components/Profile/BasicInfo/SuperFollow'
import UnFollow from '@components/Profile/BasicInfo/UnFollow'
import { FollowModuleType, type Profile } from '@tape.xyz/lens'
import React, { useEffect, useState } from 'react'

type Props = {
  profile: Profile
  showUnfollow?: boolean
  size?: '1' | '2' | '3'
}

const FollowActions: FC<Props> = ({
  profile,
  showUnfollow = true,
  size = '2'
}) => {
  const isFollowedByMe = profile?.operations.isFollowedByMe.value
  const [subscriber, setSubscriber] = useState(isFollowedByMe)
  const followModule = profile?.followModule?.type

  useEffect(() => {
    setSubscriber(isFollowedByMe)
  }, [isFollowedByMe])

  return subscriber ? (
    showUnfollow ? (
      <UnFollow
        onUnSubscribe={() => setSubscriber(false)}
        profile={profile}
        size={size}
      />
    ) : null
  ) : followModule === FollowModuleType.FeeFollowModule ? (
    <SuperFollow
      onJoin={() => setSubscriber(true)}
      profile={profile}
      size={size}
    />
  ) : !followModule ? (
    <Follow
      onSubscribe={() => setSubscriber(true)}
      profile={profile}
      size={size}
    />
  ) : null
}

export default FollowActions
