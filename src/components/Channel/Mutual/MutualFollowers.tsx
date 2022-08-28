import { useQuery } from '@apollo/client'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import { MUTUAL_SUBSCRIBERS_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { Mixpanel, TRACK } from '@utils/track'
import React, { FC, useState } from 'react'
import { Profile } from 'src/types'

import MutualFollowersList from './MutualFollowersList'
type Props = {
  viewingChannelId: string
}

const MutualFollowers: FC<Props> = ({ viewingChannelId }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showMutualSubscribersModal, setShowMutualSubscribersModal] =
    useState(false)

  const { data } = useQuery(MUTUAL_SUBSCRIBERS_QUERY, {
    variables: {
      request: {
        viewingProfileId: viewingChannelId,
        yourProfileId: selectedChannel?.id,
        limit: 5
      }
    },
    skip: !viewingChannelId
  })

  const onClickMutuals = () => {
    setShowMutualSubscribersModal(true)
    Mixpanel.track(TRACK.OPENED_MUTUAL_CHANNELS)
  }

  const mutualSubscribers = data?.mutualFollowersProfiles?.items as Profile[]
  const totalCount = data?.mutualFollowersProfiles?.pageInfo?.totalCount
  const moreCount = totalCount - 5 > 0 ? totalCount - 5 : 0

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
          <MutualFollowersList viewingChannelId={viewingChannelId} />
        </div>
      </Modal>
    </div>
  )
}

export default MutualFollowers
