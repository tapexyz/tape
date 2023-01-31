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
    <div className="flex">
      <div className="relative w-full">
        <div
          style={{
            backgroundImage: `url(${imageCdn(
              sanitizeIpfsUrl(getChannelCoverPicture(channel))
            )})`
          }}
          className="relative h-44 w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900 md:h-[20vw] xl:h-[30vh]"
        >
          <CoverLinks channel={channel} />
        </div>
        <div className="container mx-auto my-4 flex max-w-[100rem] items-center space-x-3 md:space-x-5 xl:my-6">
          <div className="flex-none">
            <img
              src={getProfilePicture(channel, 'avatar_lg')}
              className="h-24 w-24 rounded-full border-4 border-gray-300 bg-white object-cover dark:border-black dark:bg-gray-900 md:h-32 md:w-32"
              draggable={false}
              alt={channel?.handle}
            />
          </div>
          <div className="flex flex-1 flex-wrap justify-between space-y-3 py-2">
            <div className="mr-3 flex flex-col items-start">
              <h1 className="flex items-center space-x-1.5 font-semibold md:text-2xl">
                <span>{channel?.handle}</span>
                <Tooltip content="Verified Creator" placement="right">
                  <span>
                    <IsVerified id={channel?.id} size="lg" />
                  </span>
                </Tooltip>
              </h1>
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
                  <span className="inline-flex items-center space-x-1 whitespace-nowrap text-sm md:text-base">
                    {channel?.stats.totalFollowers} subscribers
                  </span>
                </button>
                {channel.isFollowing && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
                    Subscriber
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto flex items-start space-x-3">
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
              <SubscribeActions
                channel={channel}
                subscribeType={subscribeType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo
