import { Input } from '@components/UIElements/Input'
import { trimify } from '@dragverse/generic'
import type { CollectModuleType } from '@dragverse/lens/custom-types'
import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
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
      <Text size="2" weight="medium">
        Collect duration
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          type="button"
          highContrast
          color={
            !uploadedMedia.collectModule.timeLimitEnabled ? 'purple' : 'gray'
          }
          variant="surface"
          className="flex-1"
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
        <Button
          type="button"
          onClick={() => {
            setCollectType({
              timeLimitEnabled: true,
              isSimpleCollect: true
            })
            setShowDayPicker(true)
          }}
          highContrast
          color={
            uploadedMedia.collectModule.timeLimitEnabled ? 'purple' : 'gray'
          }
          variant="surface"
          className="flex-1"
        >
          Custom
        </Button>
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
