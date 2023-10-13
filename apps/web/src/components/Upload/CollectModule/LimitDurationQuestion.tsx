import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Input } from '@components/UIElements/Input'
import { Trans } from '@lingui/macro'
import type {
  CollectModuleType,
  UploadedVideo
} from '@tape.xyz/lens/custom-types'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const LimitDurationQuestion: FC<Props> = ({
  uploadedVideo,
  setCollectType
}) => {
  const [showDayPicker, setShowDayPicker] = useState(false)
  return (
    <div className="space-y-2">
      <h6>
        <Trans>Would you like to limit the collect duration?</Trans>
      </h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() => {
            setCollectType({
              timeLimitEnabled: false,
              isSimpleCollect: true
            })
            setShowDayPicker(false)
          }}
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-brand-500': !uploadedVideo.collectModule.timeLimitEnabled
            }
          )}
        >
          <span className="whitespace-nowrap">
            <Trans>Unlimited duration</Trans>
          </span>
          {!uploadedVideo.collectModule.timeLimitEnabled && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setCollectType({
              timeLimitEnabled: true,
              isSimpleCollect: true
            })
            setShowDayPicker(true)
          }}
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-brand-500': uploadedVideo.collectModule.timeLimitEnabled
            }
          )}
        >
          <span>
            <Trans>Custom</Trans>
          </span>
          {uploadedVideo.collectModule.timeLimitEnabled && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
        {showDayPicker && (
          <Input
            type="number"
            className="!border-brand-500"
            onChange={(e) => {
              const { value } = e.target
              if (Number(value) > 0) {
                setCollectType({
                  timeLimit: value
                })
              }
            }}
            value={uploadedVideo.collectModule.timeLimit}
            placeholder="number of days"
            suffix="days"
          />
        )}
      </div>
    </div>
  )
}

export default LimitDurationQuestion
