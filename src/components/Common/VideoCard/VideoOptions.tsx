import { useMutation } from '@apollo/client'
import Popover from '@components/UIElements/Popover'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { isAlreadyAddedToWatchLater } from '@utils/functions/isAlreadyAddedToWatchLater'
import { HIDE_PUBLICATION } from '@utils/gql/queries'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineWatchLater } from 'react-icons/md'
import { RiShareForwardLine } from 'react-icons/ri'
import { LenstubePublication } from 'src/types/local'

const VideoOptions = ({
  video,
  setShowShare
}: {
  video: LenstubePublication
  setShowShare: React.Dispatch<boolean>
}) => {
  const { selectedChannel } = useAppStore()
  const { addToWatchLater, removeFromWatchLater, watchLater } =
    usePersistStore()
  const [hideVideo] = useMutation(HIDE_PUBLICATION, {
    onCompleted() {
      toast.success('Video deleted')
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
    <Popover
      trigger={
        <div className="p-1 lg:invisible group-hover:visible">
          <HiOutlineDotsVertical />
        </div>
      }
      panelClassName="right-0"
    >
      <div className="p-1 mt-0.5 overflow-hidden border border-gray-200 rounded-lg shadow dark:border-gray-800 bg-secondary">
        <div className="flex flex-col text-sm transition duration-150 ease-in-out rounded-lg">
          {selectedChannel?.id === video?.profile?.id && (
            <button
              onClick={() => onHideVideo()}
              className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg text-red-500 opacity-70 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <AiOutlineDelete className="text-base" />
              <span className="whitespace-nowrap">Delete</span>
            </button>
          )}
          <button
            onClick={() =>
              isAlreadyAddedToWatchLater(video, watchLater)
                ? removeFromWatchLater(video)
                : addToWatchLater(video)
            }
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdOutlineWatchLater className="text-base" />
            <span className="whitespace-nowrap">
              {isAlreadyAddedToWatchLater(video, watchLater)
                ? 'Remove from Watch Later'
                : 'Watch Later'}
            </span>
          </button>
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RiShareForwardLine className="text-base" />
            <span className="whitespace-nowrap">Share</span>
          </button>
          <Link href={`/report/${video.id}`}>
            <a className="inline-flex hover:text-red-500 items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiFlag className="text-sm ml-0.5" />
              <span className="whitespace-nowrap">Report</span>
            </a>
          </Link>
        </div>
      </div>
    </Popover>
  )
}

export default VideoOptions
