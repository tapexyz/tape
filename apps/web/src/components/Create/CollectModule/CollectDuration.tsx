import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Button, Text } from '@radix-ui/themes'
import { trimify } from '@tape.xyz/generic'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const CollectDuration: FC<Props> = ({ setCollectType }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  const [showDayPicker, setShowDayPicker] = useState(
    uploadedVideo.collectModule.timeLimitEnabled
  )
  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        <Trans>Collect duration</Trans>
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          size="3"
          type="button"
          highContrast
          color={
            !uploadedVideo.collectModule.timeLimitEnabled ? 'blue' : 'gray'
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
          <Trans>Forever</Trans>
        </Button>
        <Button
          size="3"
          type="button"
          onClick={() => {
            setCollectType({
              timeLimitEnabled: true,
              isSimpleCollect: true
            })
            setShowDayPicker(true)
          }}
          highContrast
          color={uploadedVideo.collectModule.timeLimitEnabled ? 'blue' : 'gray'}
          variant="surface"
          className="flex-1"
        >
          <Trans>Custom</Trans>
        </Button>
      </div>
      {showDayPicker && (
        <div>
          <Input
            type="number"
            min="1"
            size="3"
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
            value={uploadedVideo.collectModule.timeLimit}
            placeholder="Number of days"
            suffix="days"
          />
        </div>
      )}
    </div>
  )
}

export default CollectDuration
