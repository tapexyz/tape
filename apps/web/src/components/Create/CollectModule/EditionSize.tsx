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

const EditionSize: FC<Props> = ({ setCollectType }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const [showSizePicker, setShowSizePicker] = useState(
    uploadedMedia.collectModule.collectLimitEnabled
  )

  return (
    <div className="space-y-1">
      <span className="text-sm font-medium">Edition Size</span>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <div className="flex-1">
          <Button
            type="button"
            onClick={() => {
              setCollectType({
                isSimpleCollect: true,
                collectLimitEnabled: false
              })
              setShowSizePicker(false)
            }}
            className={tw(
              !uploadedMedia.collectModule.collectLimitEnabled &&
                'border-brand-500'
            )}
            variant="secondary"
          >
            Open
          </Button>
        </div>
        <div className="flex-1">
          <Button
            type="button"
            onClick={() => {
              setCollectType({
                isSimpleCollect: true,
                collectLimitEnabled: true
              })
              setShowSizePicker(true)
            }}
            className={tw(
              uploadedMedia.collectModule.collectLimitEnabled &&
                'border-brand-500'
            )}
            variant="secondary"
          >
            Fixed
          </Button>
        </div>
      </div>
      {showSizePicker && (
        <div className="mt-2">
          <Input
            type="number"
            placeholder="5000"
            suffix="editions"
            min="0"
            onBlur={(e) => {
              const { value } = e.target
              setCollectType({
                collectLimit:
                  !trimify(value) || Number(value) <= 0
                    ? '0'
                    : String(parseInt(value))
              })
            }}
            onChange={(e) => {
              const { value } = e.target
              setCollectType({
                collectLimit: Number(value) <= 0 ? '' : String(parseInt(value))
              })
            }}
            value={uploadedMedia.collectModule.collectLimit}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  )
}

export default EditionSize
