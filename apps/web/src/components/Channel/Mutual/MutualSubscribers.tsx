import ChannelCirclesShimmer from '@components/Shimmers/ChannelCirclesShimmer'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import { getProfilePicture } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useMutualFollowersQuery } from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'

import MutualSubscribersList from './MutualSubscribersList'
type Props = {
  viewingChannelId: string
}

const FETCH_COUNT = 5

const MutualSubscribers: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const [showMutualSubscribersModal, setShowMutualSubscribersModal] =
    useState(false)

  const { data, loading } = useMutualFollowersQuery({
    variables: {
      request: {
        viewingProfileId: viewingChannelId,
        yourProfileId: selectedChannel?.id,
        limit: FETCH_COUNT
      }
    },
    skip: !viewingChannelId || !selectedChannel?.id
  })

  const onClickMutuals = () => {
    setShowMutualSubscribersModal(true)
    Analytics.track(TRACK.OPENED_MUTUAL_CHANNELS)
  }

  const mutualSubscribers = data?.mutualFollowersProfiles?.items as Profile[]

  if (loading) {
    return <ChannelCirclesShimmer />
  }

  if (!mutualSubscribers?.length) {
    return null
  }

  return (
    <div className="flex">
      <Tooltip content="Your friends already watching!" placement="top">
        <button
          type="button"
          className="flex cursor-pointer -space-x-1.5"
          onClick={() => onClickMutuals()}
        >
          {mutualSubscribers.slice(0, 4)?.map((channel: Profile) => (
            <img
              key={channel?.id}
              title={channel?.handle}
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(channel)}
              draggable={false}
              alt={channel?.handle}
            />
          ))}
          {mutualSubscribers.length === FETCH_COUNT && (
            <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800">
              <span role="img" className="text-sm">
                👀
              </span>
            </div>
          )}
        </button>
      </Tooltip>
      <Modal
        title={t`People you may know`}
        onClose={() => setShowMutualSubscribersModal(false)}
        show={showMutualSubscribersModal}
        panelClassName="max-w-md"
      >
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
          <MutualSubscribersList viewingChannelId={viewingChannelId} />
        </div>
      </Modal>
    </div>
  )
}

export default MutualSubscribers
