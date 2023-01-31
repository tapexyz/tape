import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Publication } from 'lens'
import { useHidePublicationMutation } from 'lens'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { Analytics, SIGN_IN_REQUIRED_MESSAGE, TRACK } from 'utils'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'

import ExternalOutline from '../Icons/ExternalOutline'
import FlagOutline from '../Icons/FlagOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'
import TrashOutline from '../Icons/TrashOutline'

type Props = {
  video: Publication
  setShowShare: React.Dispatch<boolean>
  setShowReport: React.Dispatch<boolean>
  showOnHover?: boolean
}

const VideoOptions: FC<Props> = ({
  video,
  setShowShare,
  setShowReport,
  showOnHover = true
}) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const isVideoOwner = selectedChannel?.id === video?.profile?.id

  const [hideVideo] = useHidePublicationMutation({
    update(cache) {
      const normalizedId = cache.identify({ id: video?.id, __typename: 'Post' })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onCompleted: () => {
      toast.success('Video deleted')
      Analytics.track(TRACK.DELETE_VIDEO)
    }
  })

  const onHideVideo = () => {
    if (
      confirm(
        'This will hide your video from lens, are you sure want to continue?\n\nNote: This cannot be reverted.'
      )
    ) {
      hideVideo({ variables: { request: { publicationId: video?.id } } })
    }
  }

  const onClickReport = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setShowReport(true)
  }

  return (
    <DropMenu
      trigger={
        <div
          onClick={() => Analytics.track(TRACK.CLICK_VIDEO_OPTIONS)}
          className={clsx(
            'py-1 text-white group-hover:visible md:text-inherit',
            {
              'lg:invisible': showOnHover
            }
          )}
          role="button"
        >
          <ThreeDotsOutline className="h-3.5 w-3.5" />
        </div>
      }
    >
      <div className="bg-secondary mt-0.5 overflow-hidden rounded-xl border border-gray-200 p-1 shadow dark:border-gray-800">
        <div className="flex flex-col rounded-lg text-sm transition duration-150 ease-in-out">
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 opacity-70 hover:bg-gray-100 hover:opacity-100 dark:hover:bg-gray-800"
          >
            <ShareOutline className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          {isVideoOwner && (
            <>
              <Menu.Item
                as={NextLink}
                href={getPublicationMediaUrl(video)}
                target="_blank"
              >
                <div className="flex items-center space-x-2 rounded-lg px-3 py-1.5 opacity-70 hover:bg-gray-100 hover:opacity-100 dark:hover:bg-gray-800">
                  <ExternalOutline className="h-3 w-3" />
                  <span className="whitespace-nowrap">Raw Video</span>
                </div>
              </Menu.Item>
              <button
                type="button"
                onClick={() => onHideVideo()}
                className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <TrashOutline className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">Delete</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onClickReport()}
            className="inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 opacity-70 hover:bg-gray-100 hover:text-red-500 hover:opacity-100 dark:hover:bg-gray-800"
          >
            <FlagOutline className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </DropMenu>
  )
}

export default VideoOptions
