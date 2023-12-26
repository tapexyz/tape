import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import { trimify } from '@tape.xyz/generic'
import React, { useState } from 'react'

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
          className="flex-1"
          color={
            !uploadedMedia.collectModule.timeLimitEnabled ? 'blue' : 'gray'
          }
          highContrast
          onClick={() => {
            setCollectType({
              isSimpleCollect: true,
              timeLimitEnabled: false
            })
            setShowDayPicker(false)
          }}
          type="button"
          variant="surface"
        >
          Forever
        </Button>
        <Button
          className="flex-1"
          color={uploadedMedia.collectModule.timeLimitEnabled ? 'blue' : 'gray'}
          highContrast
          onClick={() => {
            setCollectType({
              isSimpleCollect: true,
              timeLimitEnabled: true
            })
            setShowDayPicker(true)
          }}
          type="button"
          variant="surface"
        >
          Custom
        </Button>
      </div>
      {showDayPicker && (
        <div>
          <Input
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
            placeholder="Number of days"
            suffix="days"
            type="number"
            value={uploadedMedia.collectModule.timeLimit}
          />
        </div>
      )}
    </div>
  )
}

export default CollectDuration
