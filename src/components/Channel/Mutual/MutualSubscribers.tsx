import { useQuery } from '@apollo/client'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import getProfilePicture from '@utils/functions/getProfilePicture'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { Profile } from 'src/types/lens'
import { MutualFollowersDocument } from 'src/types/lens'

import MutualSubscribersList from './MutualSubscribersList'
type Props = {
  viewingChannelId: string
}

const FETCH_COUNT = 4

const MutualSubscribers: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showMutualSubscribersModal, setShowMutualSubscribersModal] =
    useState(false)

  const { data } = useQuery(MutualFollowersDocument, {
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
    <div className="flex mt-1 space-x-2 text-sm">
      <Tooltip content="Being watched by channels" placement="top">
        <button
          type="button"
          className="flex -space-x-1.5 cursor-pointer"
          onClick={() => onClickMutuals()}
        >
          {mutualSubscribers?.map((channel: Profile) => (
            <img
              key={channel?.id}
              title={channel?.handle}
              className="border rounded-full w-7 h-7 dark:border-gray-700/80"
              src={getProfilePicture(channel)}
              draggable={false}
              alt={channel?.handle}
            />
          ))}
          {moreCount ? (
            <div className="flex items-center justify-center bg-white border rounded-full dark:bg-gray-900 w-7 h-7 dark:border-gray-700/80">
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
        <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
          <MutualSubscribersList viewingChannelId={viewingChannelId} />
        </div>
      </Modal>
    </div>
  )
}

export default MutualSubscribers
