import { Trans } from '@lingui/macro'
import { Button, Text } from '@radix-ui/themes'
import type {
  CollectModuleType,
  UploadedVideo
} from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React from 'react'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        <Trans>Who can collect?</Trans>
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          className="flex-1"
          type="button"
          highContrast
          color={
            !uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect
              ? 'blue'
              : 'gray'
          }
          variant="surface"
          size="3"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isRevertCollect: false,
              followerOnlyCollect: false
            })
          }
        >
          <Trans>Anyone</Trans>
        </Button>
        <Button
          className="flex-1"
          type="button"
          size="3"
          color={
            uploadedVideo.collectModule.followerOnlyCollect &&
            !uploadedVideo.collectModule.isRevertCollect
              ? 'blue'
              : 'gray'
          }
          variant="surface"
          highContrast
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              followerOnlyCollect: true,
              isRevertCollect: false
            })
          }
        >
          <Trans>Only Followers</Trans>
        </Button>
      </div>
    </div>
  )
}

export default PermissionQuestion
