import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import React, { FC, useEffect, useState } from 'react'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
  subscribeType: string | undefined
}

const SubscribeActions: FC<Props> = ({ channel, subscribeType }) => {
  const isSubscriber = channel.isFollowedByMe
  const [subscriber, setSubscriber] = useState(isSubscriber)

  useEffect(() => {
    setSubscriber(isSubscriber)
  }, [isSubscriber])

  return subscriber ? (
    <UnSubscribe channel={channel} onUnSubscribe={() => setSubscriber(false)} />
  ) : subscribeType === 'FeeFollowModuleSettings' ? (
    <JoinChannel channel={channel} onJoin={() => setSubscriber(true)} />
  ) : (
    <Subscribe channel={channel} onSubscribe={() => setSubscriber(true)} />
  )
}

export default SubscribeActions
