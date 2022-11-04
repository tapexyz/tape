import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import SubscribersList from '@components/Common/SubscribersList'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import getCoverPicture from '@utils/functions/getCoverPicture'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { Mixpanel, TRACK } from '@utils/track'
import { SETTINGS } from '@utils/url-path'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import { Profile } from 'src/types'

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
    Mixpanel.track(TRACK.CLICK_CHANNEL_SETTINGS)
    router.push(SETTINGS)
  }

  return (
    <div className="flex">
      <div className="relative w-full">
        <span>
          <div
            style={{
              backgroundImage: `url(${imageCdn(getCoverPicture(channel))})`
            }}
            className="absolute w-full bg-white bg-center bg-no-repeat bg-cover rounded-lg dark:bg-gray-900 h-44 md:h-72"
          >
            <CoverLinks channel={channel} />
          </div>
        </span>
        <div className="flex items-center pt-2 md:pt-0 md:pl-4 mt-44 md:mt-72">
          <div className="flex-none z-[1] mr-4 md:mr-6">
            <img
              src={getProfilePicture(channel, 'avatar_lg')}
              className="object-cover w-24 h-24 bg-white border-4 border-white dark:border-black rounded-xl dark:bg-gray-900 md:-mt-10 md:w-32 md:h-32"
              draggable={false}
              alt="channel picture"
            />
          </div>
          <div className="flex flex-wrap justify-between flex-1 py-2 space-y-3">
            <div className="flex flex-col items-start mr-3">
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
                <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
                  <SubscribersList channel={channel} />
                </div>
              </Modal>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSubscribersModal(true)}
                  className="outline-none"
                >
                  <span className="inline-flex items-center space-x-1 text-sm whitespace-nowrap md:text-base">
                    {channel?.stats.totalFollowers} subscribers
                  </span>
                </button>
                {channel.isFollowing && (
                  <span className="px-2 py-0.5 text-xs dark:bg-gray-800 bg-gray-100 rounded-full">
                    Subscribed you
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center ml-auto space-x-3">
              {channel?.id && !isOwnChannel ? (
                <MutualSubscribers viewingChannelId={channel.id} />
              ) : null}
              {isOwnChannel && (
                <Tooltip content="Channel settings" placement="top">
                  <Button
                    variant="outlined"
                    onClick={() => onClickCustomize()}
                    className="!p-2 md:!p-2.5"
                  >
                    <FiSettings className="text-lg" />
                  </Button>
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
