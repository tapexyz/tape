import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { getPermanentVideoUrl } from '@utils/functions/getVideoUrl'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiExternalLink } from 'react-icons/fi'
import { useHidePublicationMutation } from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

import FlagOutline from '../Icons/FlagOutline'
import ShareOutline from '../Icons/ShareOutline'
import ThreeDotsOutline from '../Icons/ThreeDotsOutline'

const VideoOptions = ({
  video,
  setShowShare,
  setShowReport,
  showOnHover = true
}: {
  video: LenstubePublication
  setShowShare: React.Dispatch<boolean>
  setShowReport: React.Dispatch<boolean>
  showOnHover?: boolean
}) => {
  const router = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const isVideoOwner = selectedChannel?.id === video?.profile?.id

  const [hideVideo] = useHidePublicationMutation({
    onCompleted: () => {
      toast.success('Video deleted')
      Analytics.track(TRACK.DELETE_VIDEO)
      router.reload()
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

  return (
    <DropMenu
      trigger={
        <div
          onClick={() => Analytics.track(TRACK.CLICK_VIDEO_OPTIONS)}
          className={clsx(
            'p-1 text-white md:text-inherit group-hover:visible',
            {
              'lg:invisible': showOnHover
            }
          )}
        >
          <ThreeDotsOutline className="w-3.5 h-3.5" />
        </div>
      }
    >
      <div className="p-1 mt-0.5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ShareOutline className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          {isVideoOwner && (
            <>
              <Menu.Item
                as={NextLink}
                href={getPermanentVideoUrl(video)}
                target="_blank"
              >
                <div className="flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiExternalLink className="text-base" />
                  <span className="whitespace-nowrap">Raw Video</span>
                </div>
              </Menu.Item>
              <button
                type="button"
                onClick={() => onHideVideo()}
                className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg text-red-500 opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <AiOutlineDelete className="text-base" />
                <span className="whitespace-nowrap">Delete</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="inline-flex hover:text-red-500 items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FlagOutline className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </DropMenu>
  )
}

export default VideoOptions
