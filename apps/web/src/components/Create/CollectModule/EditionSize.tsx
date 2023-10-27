import { Input } from '@components/UIElements/Input'
import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import { trimify } from '@tape.xyz/generic'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const EditionSize: FC<Props> = ({ setCollectType }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const [showSizePicker, setShowSizePicker] = useState(
    uploadedVideo.collectModule.collectLimitEnabled
  )

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        Edition Size
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          type="button"
          onClick={() => {
            setCollectType({
              isSimpleCollect: true,
              collectLimitEnabled: false
            })
            setShowSizePicker(false)
          }}
          highContrast
          color={
            !uploadedVideo.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          variant="surface"
          className="flex-1"
        >
          Open
        </Button>
        <Button
          type="button"
          onClick={() => {
            setCollectType({
              isSimpleCollect: true,
              collectLimitEnabled: true
            })
            setShowSizePicker(true)
          }}
          highContrast
          color={
            uploadedVideo.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          variant="surface"
          className="flex-1"
        >
          Fixed
        </Button>
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
                  !trimify(value) || Number(value) <= 0 ? '0' : value
              })
            }}
            onChange={(e) => {
              const { value } = e.target
              setCollectType({
                collectLimit: Number(value) <= 0 ? '' : value
              })
            }}
            value={uploadedVideo.collectModule.collectLimit}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  )
}

export default EditionSize
