import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import SubscribersList from '@components/Common/SubscribersList'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import {
  getChannelCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'

import MutualSubscribers from '../Mutual/MutualSubscribers'
import CoverLinks from './CoverLinks'

type Props = {
  channel: Profile
}

const BasicInfo: FC<Props> = ({ channel }) => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const [showSubscribersModal, setShowSubscribersModal] = useState(false)

  const isOwnChannel = channel?.id === selectedChannel?.id
  const subscribeType = channel?.followModule?.__typename
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getChannelCoverPicture(channel))
  )

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${coverImage})`
        }}
        className="ultrawide:h-[35vh] relative h-44 w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900 md:h-[20vw]"
      >
        <CoverLinks channel={channel} />
      </div>
      <div className="container mx-auto flex max-w-[85rem] space-x-3 p-2 md:items-center md:space-x-5 md:py-5">
        <div className="flex-none">
          <img
            className="ultrawide:h-32 ultrawide:w-32 h-24 w-24 rounded-full bg-white object-cover dark:bg-gray-900"
            src={getProfilePicture(channel, 'AVATAR_LG')}
            draggable={false}
            alt={channel?.handle}
          />
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-between space-y-3 py-2">
          <div className="mr-3 flex flex-col items-start">
            {channel.name && (
              <h1 className="flex items-center space-x-1.5 font-medium md:text-2xl">
                {channel.name}
              </h1>
            )}
            <h2
              className="flex items-center space-x-1.5 md:text-lg"
              data-testid="channel-name"
            >
              <span>@{channel?.handle}</span>
              <Tooltip content={t`Verified`} placement="right">
                <span>
                  <IsVerified id={channel?.id} size="md" />
                </span>
              </Tooltip>
            </h2>
            <Modal
              title={t`Subscribers`}
              onClose={() => setShowSubscribersModal(false)}
              show={showSubscribersModal}
              panelClassName="max-w-md"
            >
              <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
                <SubscribersList channel={channel} />
              </div>
            </Modal>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowSubscribersModal(true)}
                className="outline-none"
              >
                <span className="inline-flex items-center space-x-1 whitespace-nowrap">
                  {channel?.stats.totalFollowers} <Trans>subscribers</Trans>
                </span>
              </button>
              {channel.isFollowing && (
                <span className="rounded-full border border-gray-400 px-2 text-xs dark:border-gray-600">
                  <Trans>Subscriber</Trans>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            {channel?.id && !isOwnChannel ? (
              <MutualSubscribers viewingChannelId={channel.id} />
            ) : null}
            <SubscribeActions channel={channel} subscribeType={subscribeType} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BasicInfo
