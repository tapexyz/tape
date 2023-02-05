import CheckOutline from '@components/Common/Icons/CheckOutline'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import type { CollectModuleType, UploadedVideo } from 'utils'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const ChargeQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to set collect price for this video?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: true,
              isFeeCollect: false
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm hover:!border-indigo-500 focus:outline-none dark:border-gray-800',
            {
              '!border-indigo-500': uploadedVideo.collectModule.isFreeCollect
            }
          )}
        >
          <span>Collect for Free</span>
          {uploadedVideo.collectModule.isFreeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: false,
              isFeeCollect: true
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm hover:!border-indigo-500 focus:outline-none dark:border-gray-800',
            {
              '!border-indigo-500': uploadedVideo.collectModule.isFeeCollect
            }
          )}
        >
          <span>Yes, Some Price</span>
          {uploadedVideo.collectModule.isFeeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default ChargeQuestion
