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

const EditionSize: FC<Props> = ({ setCollectType }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const [showSizePicker, setShowSizePicker] = useState(
    uploadedMedia.collectModule.collectLimitEnabled
  )

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        Edition Size
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          className="flex-1"
          color={
            !uploadedMedia.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          highContrast
          onClick={() => {
            setCollectType({
              collectLimitEnabled: false,
              isSimpleCollect: true
            })
            setShowSizePicker(false)
          }}
          type="button"
          variant="surface"
        >
          Open
        </Button>
        <Button
          className="flex-1"
          color={
            uploadedMedia.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          highContrast
          onClick={() => {
            setCollectType({
              collectLimitEnabled: true,
              isSimpleCollect: true
            })
            setShowSizePicker(true)
          }}
          type="button"
          variant="surface"
        >
          Fixed
        </Button>
      </div>
      {showSizePicker && (
        <div className="mt-2">
          <Input
            autoComplete="off"
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
            placeholder="5000"
            suffix="editions"
            type="number"
            value={uploadedMedia.collectModule.collectLimit}
          />
        </div>
      )}
    </div>
  )
}

export default EditionSize
