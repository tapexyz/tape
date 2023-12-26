import type { CollectModuleType } from '@tape.xyz/lens/custom-types'

import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import SplitOutline from '@components/Common/Icons/SplitOutline'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useCollectStore from '@lib/store/idb/collect'
import useProfileStore from '@lib/store/idb/profile'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { LimitType, useEnabledCurrenciesQuery } from '@tape.xyz/lens'
import React, { useState } from 'react'

import ChargeQuestion from './ChargeQuestion'
import CollectDuration from './CollectDuration'
import EditionSize from './EditionSize'
import FeeCollectForm from './FeeCollectForm'
import PermissionQuestion from './PermissionQuestion'

const CollectModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const setCollectModule = useCollectStore((state) => state.setCollectModule)

  const setCollectType = (data: CollectModuleType) => {
    const collectModule = { ...uploadedMedia.collectModule, ...data }
    setUploadedMedia({ collectModule })
    setCollectModule(collectModule)
  }

  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    skip: !activeProfile?.id,
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    }
  })

  const getSelectedCollectType = () => {
    const { followerOnlyCollect } = uploadedMedia.collectModule
    const { timeLimitEnabled } = uploadedMedia.collectModule
    const { collectLimitEnabled } = uploadedMedia.collectModule
    const { isFeeCollect } = uploadedMedia.collectModule
    const { collectLimit } = uploadedMedia.collectModule
    const { timeLimit } = uploadedMedia.collectModule
    const { multiRecipients } = uploadedMedia.collectModule
    if (uploadedMedia.collectModule.isRevertCollect) {
      return `No one can collect this publication`
    }
    return (
      <div className="flex items-center space-x-1">
        <span>
          {followerOnlyCollect ? `Only followers` : `Anyone`} can collect{' '}
          {collectLimitEnabled ? `the ${collectLimit} editions` : ''}{' '}
          {isFeeCollect ? `for set price` : `for free`}{' '}
          {timeLimitEnabled ? `within ${timeLimit} days` : ''}
        </span>
        {uploadedMedia.collectModule.isMultiRecipientFeeCollect && (
          <Tooltip
            content={`Split revenue enabled with ${multiRecipients?.length} recipients`}
          >
            <span>
              <SplitOutline className="mr-2 size-5 rotate-90" outline={false} />
            </span>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <div className="mt-2 pb-2">
      <Dialog.Root onOpenChange={setShowModal} open={showModal}>
        <Dialog.Trigger>
          <Button
            className="w-full"
            onClick={() => setShowModal(true)}
            type="button"
            variant="surface"
          >
            <Flex align="center" justify="between" width="100%">
              <span>{getSelectedCollectType()}</span>
              <ChevronRightOutline className="size-3" />
            </Flex>
          </Button>
        </Dialog.Trigger>

        <Dialog.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          style={{ maxWidth: 550 }}
        >
          <Dialog.Title>Collectible</Dialog.Title>
          <Flex direction="column" gap="3">
            <div className="no-scrollbar max-h-[80vh] space-y-2 overflow-y-auto p-0.5">
              <PermissionQuestion setCollectType={setCollectType} />
              {!uploadedMedia.collectModule.isRevertCollect && (
                <CollectDuration setCollectType={setCollectType} />
              )}
              {!uploadedMedia.collectModule.isRevertCollect && (
                <EditionSize setCollectType={setCollectType} />
              )}
              {!uploadedMedia.collectModule.isRevertCollect && (
                <div className="space-y-2">
                  <ChargeQuestion setCollectType={setCollectType} />
                  {(uploadedMedia.collectModule.isFeeCollect ||
                    uploadedMedia.collectModule.collectLimitEnabled) &&
                  !uploadedMedia.collectModule.isRevertCollect &&
                  enabledCurrencies ? (
                    <FeeCollectForm
                      enabledCurrencies={enabledCurrencies.currencies.items}
                      setCollectType={setCollectType}
                      setShowModal={setShowModal}
                    />
                  ) : (
                    <div className="flex justify-end pt-4">
                      <Button
                        highContrast
                        onClick={() => {
                          setCollectModule(uploadedMedia.collectModule)
                          setShowModal(false)
                        }}
                        type="button"
                      >
                        Set Collect Type
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export default CollectModule
