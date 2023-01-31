import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import type { Profile } from 'lens'
import { useMutualFollowersQuery } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Analytics, TRACK } from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'

import MutualSubscribersList from './MutualSubscribersList'
type Props = {
  viewingChannelId: string
}

const FETCH_COUNT = 4

const MutualSubscribers: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showMutualSubscribersModal, setShowMutualSubscribersModal] =
    useState(false)

  const { data } = useMutualFollowersQuery({
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
  const totalCount = data?.mutualFollowersProfiles?.pageInfo?.totalCount ?? 0
  const moreCount = totalCount - FETCH_COUNT > 0 ? totalCount - FETCH_COUNT : 0

  return (
    <div className="mt-1 flex space-x-2 text-sm">
      <Tooltip content="Your friends already watching!" placement="top">
        <button
          type="button"
          className="flex cursor-pointer -space-x-1.5"
          onClick={() => onClickMutuals()}
        >
          {mutualSubscribers?.map((channel: Profile) => (
            <img
              key={channel?.id}
              title={channel?.handle}
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(channel)}
              draggable={false}
              alt={channel?.handle}
            />
          ))}
          {moreCount ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-white dark:border-gray-700/80 dark:bg-gray-900">
              <span className="text-[10px]">+ {moreCount}</span>
            </div>
          ) : null}
        </button>
      </Tooltip>
      <Modal
        title="Channels you may know"
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
