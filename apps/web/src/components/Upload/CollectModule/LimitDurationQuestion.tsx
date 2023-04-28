import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import type { CollectModuleType, UploadedVideo } from 'utils'

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
      <h6>
        <Trans>Would you like to limit the collect duration?</Trans>
      </h6>
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
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-indigo-500':
                !uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>
            <Trans>Unlimited duration</Trans>
          </span>
          {!uploadedVideo.collectModule.isTimedFeeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
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
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-indigo-500':
                uploadedVideo.collectModule.isTimedFeeCollect
            }
          )}
        >
          <span>
            <Trans>Limit to 24 hours sale</Trans>
          </span>
          {uploadedVideo.collectModule.isTimedFeeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default LimitDurationQuestion
