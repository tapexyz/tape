import { useQuery } from '@apollo/client'
import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import ButtonShimmer from '@components/Shimmers/ButtonShimmer'
import useAppStore from '@lib/store'
import { ZERO_ADDRESS } from '@utils/constants'
import { DOES_FOLLOW } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
  subscribeType: string | undefined
}

const SubscribeActions: FC<Props> = ({ channel, subscribeType }) => {
  const { selectedChannel } = useAppStore()
  const {
    query: { id }
  } = useRouter()
  const channelId = channel?.id || id?.toString().split('-')[0]
  const { data, loading } = useQuery(DOES_FOLLOW, {
    variables: {
      request: {
        followInfos: {
          followerAddress: selectedChannel?.ownedBy ?? ZERO_ADDRESS,
          profileId: channelId
        }
      }
    },
    skip: !selectedChannel || !channelId
  })

  const isSubscriber = (data?.doesFollow[0].follows as boolean) ?? false
  const [subscriber, setSubscriber] = useState(isSubscriber)

  useEffect(() => {
    setSubscriber(isSubscriber)
  }, [data, isSubscriber])

  return loading ? (
    <ButtonShimmer />
  ) : (
    <>
      {subscriber ? (
        <UnSubscribe
          channel={channel}
          onUnSubscribe={() => setSubscriber(false)}
        />
      ) : subscribeType === 'FeeFollowModuleSettings' ? (
        <JoinChannel channel={channel} onJoin={() => setSubscriber(true)} />
      ) : (
        <Subscribe channel={channel} onSubscribe={() => setSubscriber(true)} />
      )}
    </>
  )
}

export default SubscribeActions
