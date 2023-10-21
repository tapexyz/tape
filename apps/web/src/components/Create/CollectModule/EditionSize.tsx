import { Input } from '@components/UIElements/Input'
import { Trans } from '@lingui/macro'
import { Button, Text } from '@radix-ui/themes'
import { trimify } from '@tape.xyz/generic'
import type {
  CollectModuleType,
  UploadedMedia
} from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  uploadedVideo: UploadedMedia
  setCollectType: (data: CollectModuleType) => void
}

const EditionSize: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  const [showSizePicker, setShowSizePicker] = useState(
    uploadedVideo.collectModule.collectLimitEnabled
  )
  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        <Trans>Edition Size</Trans>
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
          size="3"
          highContrast
          color={
            !uploadedVideo.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          variant="surface"
          className="flex-1"
        >
          <Trans>Open</Trans>
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
          size="3"
          highContrast
          color={
            uploadedVideo.collectModule.collectLimitEnabled ? 'blue' : 'gray'
          }
          variant="surface"
          className="flex-1"
        >
          <Trans>Fixed</Trans>
        </Button>
      </div>
      {showSizePicker && (
        <div className="mt-2">
          <Input
            type="number"
            placeholder="5000"
            suffix="editions"
            min="0"
            size="3"
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
