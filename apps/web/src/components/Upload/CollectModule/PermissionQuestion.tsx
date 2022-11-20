import CheckOutline from '@components/Common/Icons/CheckOutline'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import type { CollectModuleType, UploadedVideo } from 'utils'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Who can collect this publication?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: true,
              isRevertCollect: false,
              isFeeCollect: false,
              followerOnlyCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                !uploadedVideo.collectModule.followerOnlyCollect &&
                !uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>Anyone</span>
          {!uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect && (
              <CheckOutline className="w-3 h-3" />
            )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              followerOnlyCollect: true,
              isRevertCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                uploadedVideo.collectModule.followerOnlyCollect &&
                !uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>Subscribers</span>
          {uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect && (
              <CheckOutline className="w-3 h-3" />
            )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isRevertCollect: true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500': uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>None</span>
          {uploadedVideo.collectModule.isRevertCollect && (
            <CheckOutline className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default PermissionQuestion
