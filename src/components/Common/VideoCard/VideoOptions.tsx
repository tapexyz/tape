import { useMutation } from '@apollo/client'
import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import { getPermanentVideoUrl } from '@utils/functions/getVideoUrl'
import { isAlreadyAddedToWatchLater } from '@utils/functions/isAlreadyAddedToWatchLater'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiExternalLink, FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineWatchLater } from 'react-icons/md'
import { RiShareForwardLine } from 'react-icons/ri'
import { HidePublicationDocument } from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

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
  const addToWatchLater = usePersistStore((state) => state.addToWatchLater)
  const watchLater = usePersistStore((state) => state.watchLater)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const removeFromWatchLater = usePersistStore(
    (state) => state.removeFromWatchLater
  )

  const router = useRouter()
  const isVideoOwner = selectedChannel?.id === video?.profile?.id

  const [hideVideo] = useMutation(HidePublicationDocument, {
    onCompleted: () => {
      toast.success('Video deleted')
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

  const onClickWatchLater = () => {
    isAlreadyAddedToWatchLater(video, watchLater)
      ? removeFromWatchLater(video)
      : addToWatchLater(video)
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
          <HiOutlineDotsVertical />
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
            <RiShareForwardLine className="text-base" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          <button
            type="button"
            onClick={() => onClickWatchLater()}
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdOutlineWatchLater className="text-base" />
            <span className="whitespace-nowrap">
              {isAlreadyAddedToWatchLater(video, watchLater)
                ? 'Remove from Watch Later'
                : 'Watch Later'}
            </span>
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
            <FiFlag className="text-sm ml-0.5" />
            <span className="whitespace-nowrap">Report</span>
          </button>
        </div>
      </div>
    </DropMenu>
  )
}

export default VideoOptions
