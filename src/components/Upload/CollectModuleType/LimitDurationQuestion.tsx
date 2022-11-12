import clsx from 'clsx'
import React, { FC } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { CollectModuleType, UploadedVideo } from 'src/types/local'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const LimitDurationQuestion: FC<Props> = ({
  uploadedVideo,
  setCollectType
}) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to limit the collect duration?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isTimedFeeCollect: false,
              isFeeCollect: false,
              isFreeCollect: uploadedVideo.collectModule.isLimitedFeeCollect
                ? false
                : true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                !uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>Unlimited</span>
          {!uploadedVideo.collectModule.isTimedFeeCollect && <AiOutlineCheck />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isTimedFeeCollect: true,
              isLimitedFeeCollect: uploadedVideo.collectModule
                .isLimitedFeeCollect
                ? true
                : false,
              isFeeCollect: true,
              isFreeCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>Limit to 24 hours sale</span>
          {uploadedVideo.collectModule.isTimedFeeCollect && <AiOutlineCheck />}
        </button>
      </div>
    </div>
  )
}

export default LimitDurationQuestion
