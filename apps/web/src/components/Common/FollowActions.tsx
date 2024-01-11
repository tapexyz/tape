import Follow from '@components/Profile/BasicInfo/Follow'
import SuperFollow from '@components/Profile/BasicInfo/SuperFollow'
import UnFollow from '@components/Profile/BasicInfo/UnFollow'
import { FollowModuleType, type Profile } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  profile: Profile
}

const FollowActions: FC<Props> = ({ profile }) => {
  const isFollowedByMe = profile?.operations.isFollowedByMe.value
  const [subscriber, setSubscriber] = useState(isFollowedByMe)
  const followModule = profile?.followModule?.type

  useEffect(() => {
    setSubscriber(isFollowedByMe)
  }, [isFollowedByMe])

  return subscriber ? (
    <UnFollow profile={profile} onUnSubscribe={() => setSubscriber(false)} />
  ) : followModule === FollowModuleType.FeeFollowModule ? (
    <SuperFollow profile={profile} onJoin={() => setSubscriber(true)} />
  ) : !followModule ? (
    <Follow profile={profile} onSubscribe={() => setSubscriber(true)} />
  ) : null
}

export default FollowActions
