import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import useAppStore from '@lib/store'
import { Button, Text } from '@radix-ui/themes'
import React from 'react'

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
          color={!uploadedMedia.collectModule.isFeeCollect ? 'blue' : 'gray'}
          highContrast
          onClick={() =>
            setCollectType({
              isFeeCollect: false,
              isMultiRecipientFeeCollect: false,
              isSimpleCollect: true
            })
          }
          type="button"
          variant="surface"
        >
          Free
        </Button>
        <Button
          className="flex-1"
          color={uploadedMedia.collectModule.isFeeCollect ? 'blue' : 'gray'}
          highContrast
          onClick={() =>
            setCollectType({
              isFeeCollect: true,
              isSimpleCollect: true
            })
          }
          type="button"
          variant="surface"
        >
          Set Price
        </Button>
      </div>
    </div>
  )
}

export default ChargeQuestion
