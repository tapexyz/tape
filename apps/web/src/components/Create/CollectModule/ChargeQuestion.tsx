import type { CollectModuleType } from '@dragverse/lens/custom-types'
import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import type { FC } from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const ChargeQuestion: FC<Props> = ({ setCollectType }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        Price
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          className="flex-1"
          type="button"
          highContrast
          color={!uploadedMedia.collectModule.isFeeCollect ? 'purple' : 'gray'}
          variant="surface"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isMultiRecipientFeeCollect: false,
              isFeeCollect: false
            })
          }
        >
          Free
        </Button>
        <Button
          className="flex-1"
          type="button"
          highContrast
          color={uploadedMedia.collectModule.isFeeCollect ? 'purple' : 'gray'}
          variant="surface"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isFeeCollect: true
            })
          }
        >
          Set Price
        </Button>
      </div>
    </div>
  )
}

export default ChargeQuestion
