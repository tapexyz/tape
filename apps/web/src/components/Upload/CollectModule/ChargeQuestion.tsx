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

const ChargeQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>
        <Trans>Would you like to set collect price for this video?</Trans>
      </h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isMultiRecipientFeeCollect: false,
              isFeeCollect: false
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none dark:border-gray-800',
            {
              '!border-indigo-500': !uploadedVideo.collectModule.isFeeCollect
            }
          )}
        >
          <span>
            <Trans>Collect for Free</Trans>
          </span>
          {!uploadedVideo.collectModule.isFeeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isFeeCollect: true
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none dark:border-gray-800',
            {
              '!border-indigo-500': uploadedVideo.collectModule.isFeeCollect
            }
          )}
        >
          <span>
            <Trans>Yes, Some Price</Trans>
          </span>
          {uploadedVideo.collectModule.isFeeCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default ChargeQuestion
