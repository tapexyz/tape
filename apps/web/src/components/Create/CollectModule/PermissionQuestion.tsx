import type { CollectModuleType } from '@dragverse/lens/custom-types'
import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import type { FC } from 'react'

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
          type="button"
          highContrast
          color={
            !uploadedMedia.collectModule.followerOnlyCollect &&
            !uploadedMedia.collectModule.isRevertCollect
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
            uploadedMedia.collectModule.followerOnlyCollect &&
            !uploadedMedia.collectModule.isRevertCollect
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
