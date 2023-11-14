import Follow from '@components/Profile/BasicInfo/Follow'
import SuperFollow from '@components/Profile/BasicInfo/SuperFollow'
import UnFollow from '@components/Profile/BasicInfo/UnFollow'
import { FollowModuleType, type Profile } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  size?: '1' | '2' | '3'
  profile: Profile
  showUnfollow?: boolean
}

const FollowActions: FC<Props> = ({
  profile,
  size = '2',
  showUnfollow = true
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
        size={size}
        profile={profile}
        onUnSubscribe={() => setSubscriber(false)}
      />
    ) : null
  ) : followModule === FollowModuleType.FeeFollowModule ? (
    <SuperFollow
      size={size}
      profile={profile}
      onJoin={() => setSubscriber(true)}
    />
  ) : !followModule ? (
    <Follow
      size={size}
      profile={profile}
      onSubscribe={() => setSubscriber(true)}
    />
  ) : null
}

export default FollowActions
