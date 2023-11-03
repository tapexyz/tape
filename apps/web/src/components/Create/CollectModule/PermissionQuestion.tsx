import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ setCollectType }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        Who can collect?
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
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isRevertCollect: false,
              followerOnlyCollect: false
            })
          }
        >
          Anyone
        </Button>
        <Button
          className="flex-1"
          type="button"
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
          Only Followers
        </Button>
      </div>
    </div>
  )
}

export default PermissionQuestion
