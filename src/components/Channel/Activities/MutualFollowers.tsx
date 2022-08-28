import { useQuery } from '@apollo/client'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import { MUTUAL_SUBSCRIBERS_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import getProfilePicture from '@utils/functions/getProfilePicture'
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

  const mutualSubscribers = data?.mutualFollowersProfiles?.items as Profile[]
  const totalCount = data?.mutualFollowersProfiles?.pageInfo?.totalCount
  const moreCount = totalCount - 5 > 0 ? totalCount - 5 : 0

  return (
    <div className="flex mt-1 space-x-2 text-sm">
      <div
        className="flex -space-x-1.5 cursor-pointer"
        onClick={() => {
          setShowMutualSubscribersModal(true)
        }}
      >
        {mutualSubscribers?.map((channel: Profile) => (
          <Tooltip key={channel?.id} content={channel?.handle} placement="top">
            <img
              key={channel?.id}
              className="border rounded-full w-7 h-7 dark:border-gray-700/80"
              src={getProfilePicture(channel)}
              draggable={false}
              alt={channel?.handle}
            />
          </Tooltip>
        ))}
        {moreCount ? (
          <Tooltip content="Also watching this channel" placement="top">
            <div className="flex items-center justify-center bg-white border rounded-full dark:bg-gray-900 w-7 h-7 dark:border-gray-700/80">
              <span className="text-[10px]">+ {moreCount}</span>
            </div>
          </Tooltip>
        ) : null}
      </div>

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
