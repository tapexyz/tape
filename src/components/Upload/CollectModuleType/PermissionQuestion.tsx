import clsx from 'clsx'
import React, { FC } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { CollectModuleType, UploadedVideo } from 'src/types/local'

type Props = {
  uploadedVideo: UploadedVideo
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Who can mint this publication?</h6>
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
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500':
                !uploadedVideo.collectModule.followerOnlyCollect &&
                !uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>Anyone</span>
          {!uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect && <AiOutlineCheck />}
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
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500':
                uploadedVideo.collectModule.followerOnlyCollect &&
                !uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>Subscribers</span>
          {uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect && <AiOutlineCheck />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isRevertCollect: true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500': uploadedVideo.collectModule.isRevertCollect
            }
          )}
        >
          <span>None</span>
          {uploadedVideo.collectModule.isRevertCollect && <AiOutlineCheck />}
        </button>
      </div>
    </div>
  )
}

export default PermissionQuestion
