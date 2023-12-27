import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import SplitOutline from '@components/Common/Icons/SplitOutline'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useCollectStore from '@lib/store/idb/collect'
import useProfileStore from '@lib/store/idb/profile'
import { Button, Checkbox, Dialog, Flex, Text } from '@radix-ui/themes'
import { EVENTS, Tower } from '@tape.xyz/generic'
import { LimitType, useEnabledCurrenciesQuery } from '@tape.xyz/lens'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
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
  const setPersistedCollectModule = useCollectStore(
    (state) => state.setCollectModule
  )
  const saveAsDefault = useCollectStore((state) => state.saveAsDefault)
  const setSaveAsDefault = useCollectStore((state) => state.setSaveAsDefault)

  const setCollectType = (data: CollectModuleType) => {
    const collectModule = { ...uploadedMedia.collectModule, ...data }
    setUploadedMedia({ collectModule })
    if (saveAsDefault) {
      setPersistedCollectModule(collectModule)
    }
  }

  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    },
    skip: !activeProfile?.id
  })

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedMedia.collectModule.followerOnlyCollect
    const timeLimitEnabled = uploadedMedia.collectModule.timeLimitEnabled
    const collectLimitEnabled = uploadedMedia.collectModule.collectLimitEnabled
    const isFeeCollect = uploadedMedia.collectModule.isFeeCollect
    const collectLimit = uploadedMedia.collectModule.collectLimit
    const timeLimit = uploadedMedia.collectModule.timeLimit
    const multiRecipients = uploadedMedia.collectModule.multiRecipients
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
      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Trigger>
          <Button
            variant="surface"
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            <Flex align="center" width="100%" justify="between">
              <span>{getSelectedCollectType()}</span>
              <ChevronRightOutline className="size-3" />
            </Flex>
          </Button>
        </Dialog.Trigger>

        <Dialog.Content
          style={{ maxWidth: 550 }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Dialog.Title>Collectible</Dialog.Title>
          <Dialog.Description mb="4">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox
                  highContrast
                  variant="soft"
                  onCheckedChange={(checked) => {
                    setSaveAsDefault(checked as boolean)
                    Tower.track(EVENTS.PUBLICATION.SAVE_AS_DEFAULT_COLLECT)
                  }}
                  checked={saveAsDefault}
                />{' '}
                Save as default settings
              </Flex>
            </Text>
          </Dialog.Description>
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
                      setCollectType={setCollectType}
                      setShowModal={setShowModal}
                      enabledCurrencies={enabledCurrencies.currencies.items}
                    />
                  ) : (
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        highContrast
                        onClick={() => {
                          if (saveAsDefault) {
                            setPersistedCollectModule(
                              uploadedMedia.collectModule
                            )
                          }
                          setShowModal(false)
                        }}
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
