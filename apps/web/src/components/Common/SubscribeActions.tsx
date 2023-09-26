import Follow from '@components/Channel/BasicInfo/Follow'
import SuperFollow from '@components/Channel/BasicInfo/SuperFollow'
import UnFollow from '@components/Channel/BasicInfo/UnFollow'
import type { Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  size?: '1' | '2' | '3'
  profile: Profile
}

const SubscribeActions: FC<Props> = ({ profile, size = '2' }) => {
  const isSubscriber = profile?.operations.isFollowedByMe.value
  const [subscriber, setSubscriber] = useState(isSubscriber)
  const subscribeType = profile?.followModule?.__typename

  useEffect(() => {
    setSubscriber(isSubscriber)
  }, [isSubscriber])

  return subscriber ? (
    <UnFollow
      size={size}
      profile={profile}
      onUnSubscribe={() => setSubscriber(false)}
    />
  ) : subscribeType === 'FeeFollowModuleSettings' ? (
    <SuperFollow
      size={size}
      profile={profile}
      onJoin={() => setSubscriber(true)}
    />
  ) : (
    <Follow
      size={size}
      profile={profile}
      onSubscribe={() => setSubscriber(true)}
    />
  )
}

export default SubscribeActions
