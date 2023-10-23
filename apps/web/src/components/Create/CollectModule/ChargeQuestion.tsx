import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Button, Text } from '@radix-ui/themes'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React from 'react'

type Props = {
  setCollectType: (data: CollectModuleType) => void
}

const ChargeQuestion: FC<Props> = ({ setCollectType }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  return (
    <div className="space-y-1">
      <Text size="2" weight="medium">
        <Trans>Price</Trans>
      </Text>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <Button
          className="flex-1"
          type="button"
          size="3"
          highContrast
          color={!uploadedVideo.collectModule.isFeeCollect ? 'blue' : 'gray'}
          variant="surface"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isMultiRecipientFeeCollect: false,
              isFeeCollect: false
            })
          }
        >
          <Trans>Free</Trans>
        </Button>
        <Button
          className="flex-1"
          type="button"
          size="3"
          highContrast
          color={uploadedVideo.collectModule.isFeeCollect ? 'blue' : 'gray'}
          variant="surface"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isFeeCollect: true
            })
          }
        >
          <Trans>Set Price</Trans>
        </Button>
      </div>
    </div>
  )
}

export default ChargeQuestion
