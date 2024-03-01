import { tw } from '@dragverse/browser'
import { trimify } from '@dragverse/generic'
import type { CollectModuleType } from '@dragverse/lens/custom-types'
import { Button, Input } from '@dragverse/ui'
import useAppStore from '@lib/store'
import type { FC } from 'react'
import { useState } from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const CollectDuration: FC<Props> = ({ setCollectType }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)

  const [showDayPicker, setShowDayPicker] = useState(
    uploadedMedia.collectModule.timeLimitEnabled
  )
  return (
    <div className="space-y-1">
      <span className="text-sm font-medium">Collect duration</span>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <div className="flex-1">
          <Button
            type="button"
            variant="secondary"
            className={tw(
              !uploadedMedia.collectModule.timeLimitEnabled &&
                'border-brand-500'
            )}
            onClick={() => {
              setCollectType({
                timeLimitEnabled: false,
                isSimpleCollect: true
              })
              setShowDayPicker(false)
            }}
          >
            Forever
          </Button>
        </div>
        <div className="flex-1">
          <Button
            type="button"
            onClick={() => {
              setCollectType({
                timeLimitEnabled: true,
                isSimpleCollect: true
              })
              setShowDayPicker(true)
            }}
            className={tw(
              uploadedMedia.collectModule.timeLimitEnabled && 'border-brand-500'
            )}
            variant="secondary"
          >
            Custom
          </Button>
        </div>
      </div>
      {showDayPicker && (
        <div>
          <Input
            type="number"
            min="1"
            onBlur={(e) => {
              const { value } = e.target
              setCollectType({
                timeLimit: !trimify(value) || Number(value) <= 0 ? '1' : value
              })
            }}
            onChange={(e) => {
              const { value } = e.target
              setCollectType({
                timeLimit: Number(value) <= 0 ? '' : value
              })
            }}
            value={uploadedMedia.collectModule.timeLimit}
            placeholder="Number of days"
            suffix="days"
          />
        </div>
      )}
    </div>
  )
}

export default CollectDuration
