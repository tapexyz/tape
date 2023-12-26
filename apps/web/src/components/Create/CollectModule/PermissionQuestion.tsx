import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import React from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ setCollectType }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        Who can collect?
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          className="flex-1"
          color={
            !uploadedMedia.collectModule.followerOnlyCollect &&
            !uploadedMedia.collectModule.isRevertCollect
              ? 'blue'
              : 'gray'
          }
          highContrast
          onClick={() =>
            setCollectType({
              followerOnlyCollect: false,
              isRevertCollect: false,
              isSimpleCollect: true
            })
          }
          type="button"
          variant="surface"
        >
          Anyone
        </Button>
        <Button
          className="flex-1"
          color={
            uploadedMedia.collectModule.followerOnlyCollect &&
            !uploadedMedia.collectModule.isRevertCollect
              ? 'blue'
              : 'gray'
          }
          highContrast
          onClick={() =>
            setCollectType({
              followerOnlyCollect: true,
              isRevertCollect: false,
              isSimpleCollect: true
            })
          }
          type="button"
          variant="surface"
        >
          Only Followers
        </Button>
      </div>
    </div>
  )
}

export default PermissionQuestion
