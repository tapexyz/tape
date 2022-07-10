import clsx from 'clsx'
import React, { FC } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { CollectModuleType, UploadedVideo } from 'src/types/local'

type Props = {
  uploadedVideo: UploadedVideo
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void
}

const LimitQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to limit the mint duration?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isTimedFeeCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500':
                !uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>No Limit</span>
          {!uploadedVideo.collectModule.isTimedFeeCollect && <AiOutlineCheck />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isTimedFeeCollect: true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500': uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>Limit to 24 hours</span>
          {uploadedVideo.collectModule.isTimedFeeCollect && <AiOutlineCheck />}
        </button>
      </div>
    </div>
  )
}

export default LimitQuestion
