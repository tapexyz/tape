import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import type { ButtonSizes, ButtonVariants } from '@components/UIElements/Button'
import type { Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  channel: Profile
  subscribeType: string | undefined
  variant?: ButtonVariants
  size?: ButtonSizes
  showText?: boolean
}

const SubscribeActions: FC<Props> = ({
  channel,
  subscribeType,
  variant,
  size,
  showText
}) => {
  const isSubscriber = channel?.isFollowedByMe
  const [subscriber, setSubscriber] = useState(isSubscriber)

  useEffect(() => {
    setSubscriber(isSubscriber)
  }, [isSubscriber])

  return subscriber ? (
    <UnSubscribe
      variant={variant}
      showText={showText}
      size={size}
      channel={channel}
      onUnSubscribe={() => setSubscriber(false)}
    />
  ) : subscribeType === 'FeeFollowModuleSettings' ? (
    <JoinChannel
      variant={variant}
      showText={showText}
      size={size}
      channel={channel}
      onJoin={() => setSubscriber(true)}
    />
  ) : (
    <Subscribe
      variant={variant}
      showText={showText}
      size={size}
      channel={channel}
      onSubscribe={() => setSubscriber(true)}
    />
  )
}

export default SubscribeActions
