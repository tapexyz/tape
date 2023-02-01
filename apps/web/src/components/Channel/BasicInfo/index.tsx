import CogOutline from '@components/Common/Icons/CogOutline'
import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import SubscribersList from '@components/Common/SubscribersList'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import type { Profile } from 'lens'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Analytics, TRACK } from 'utils'
import getChannelCoverPicture from 'utils/functions/getChannelCoverPicture'
import getProfilePicture from 'utils/functions/getProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'

import MutualSubscribers from '../Mutual/MutualSubscribers'

const CoverLinks = dynamic(() => import('./CoverLinks'))

type Props = {
  channel: Profile
}

const BasicInfo: FC<Props> = ({ channel }) => {
  const router = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showSubscribersModal, setShowSubscribersModal] = useState(false)

  const isOwnChannel = channel?.id === selectedChannel?.id
  const subscribeType = channel?.followModule?.__typename

  const onClickCustomize = () => {
    Analytics.track(TRACK.CLICK_CHANNEL_SETTINGS)
    router.push('/settings')
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${imageCdn(
            sanitizeIpfsUrl(getChannelCoverPicture(channel))
          )})`
        }}
        className="ultrawide:h-[35vh] relative h-44 w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900 md:h-[20vw]"
      >
        <CoverLinks channel={channel} />
      </div>
      <div className="container mx-auto flex max-w-[85rem] space-x-3 p-2 md:items-center md:space-x-5 md:py-5">
        <div className="flex-none">
          <img
            className="ultrawide:h-32 ultrawide:w-32 h-24 w-24 rounded-full bg-white object-cover dark:bg-gray-900"
            src={getProfilePicture(channel, 'avatar_lg')}
            draggable={false}
            alt={channel?.handle}
          />
        </div>
        <div className="flex flex-1 flex-wrap justify-between space-y-3 py-2">
          <div className="mr-3 flex flex-col items-start">
            {channel.name && (
              <h1 className="flex items-center space-x-1.5 font-medium md:text-2xl">
                {channel.name}
              </h1>
            )}
            <h2 className="flex items-center space-x-1.5 md:text-lg">
              <span>@{channel?.handle}</span>
              <Tooltip content="Verified" placement="right">
                <span>
                  <IsVerified id={channel?.id} size="md" />
                </span>
              </Tooltip>
            </h2>
            <Modal
              title="Subscribers"
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
                  {channel?.stats.totalFollowers} subscribers
                </span>
              </button>
              {channel.isFollowing && (
                <span className="rounded-full border border-gray-400 px-2 text-xs dark:border-gray-600">
                  Subscriber
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            {channel?.id && !isOwnChannel ? (
              <MutualSubscribers viewingChannelId={channel.id} />
            ) : null}
            {isOwnChannel && (
              <Tooltip content="Channel settings" placement="top">
                <button
                  onClick={() => onClickCustomize()}
                  className="btn-hover p-2 md:p-2.5"
                >
                  <CogOutline className="h-5 w-5" />
                </button>
              </Tooltip>
            )}
            <SubscribeActions channel={channel} subscribeType={subscribeType} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BasicInfo
