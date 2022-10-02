import { useMutation } from '@apollo/client'
import Popover from '@components/UIElements/Popover'
import { HIDE_PUBLICATION } from '@gql/queries'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { getPermanentVideoUrl } from '@utils/functions/getVideoUrl'
import { isAlreadyAddedToWatchLater } from '@utils/functions/isAlreadyAddedToWatchLater'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiExternalLink, FiFlag } from 'react-icons/fi'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineWatchLater } from 'react-icons/md'
import { RiShareForwardLine } from 'react-icons/ri'
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

  const [hideVideo] = useMutation(HIDE_PUBLICATION, {
    onCompleted() {
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

  return (
    <Popover
      trigger={
        <div
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
      panelClassName="right-0"
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
            onClick={() => {
              isAlreadyAddedToWatchLater(video, watchLater)
                ? removeFromWatchLater(video)
                : addToWatchLater(video)
            }}
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
              <Link href={getPermanentVideoUrl(video)} target="_blank">
                <div className="flex items-center px-3 py-1.5 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiExternalLink className="text-base" />
                  <span className="whitespace-nowrap">Raw Video</span>
                </div>
              </Link>
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
    </Popover>
  )
}

export default VideoOptions
