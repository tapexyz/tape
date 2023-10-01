import CheckOutline from '@components/Common/Icons/CheckOutline'
import SplitOutline from '@components/Common/Icons/SplitOutline'
import Tooltip from '@components/UIElements/Tooltip'
import { LimitType, useEnabledCurrenciesQuery } from '@lenstube/lens'
import type { CollectModuleType } from '@lenstube/lens/custom-types'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import React, { useState } from 'react'

import ChargeQuestion from './ChargeQuestion'
import FeeCollectForm from './FeeCollectForm'
import LimitDurationQuestion from './LimitDurationQuestion'
import LimitQuestion from './LimitQuestion'
import PermissionQuestion from './PermissionQuestion'

const CollectModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const setCollectType = (data: CollectModuleType) => {
    setUploadedVideo({
      collectModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    },
    skip: !selectedSimpleProfile?.id
  })

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedVideo.collectModule.followerOnlyCollect
    const timeLimitEnabled = uploadedVideo.collectModule.timeLimitEnabled
    const collectLimitEnabled = uploadedVideo.collectModule.collectLimitEnabled
    const isFeeCollect = uploadedVideo.collectModule.isFeeCollect
    const collectLimit = uploadedVideo.collectModule.collectLimit
    const multiRecipients = uploadedVideo.collectModule.multiRecipients
    if (uploadedVideo.collectModule.isRevertCollect) {
      return t`No one can collect this publication`
    }
    return (
      <div className="flex items-center space-x-1">
        <span>
          {followerOnlyCollect ? t`Subscribers` : t`Anyone`}{' '}
          <Trans>can collect</Trans>{' '}
          {collectLimitEnabled ? `maximum of ${collectLimit}` : ''}{' '}
          {isFeeCollect ? t`for given fees` : t`for free`}{' '}
          {timeLimitEnabled ? t`within 24hrs` : ''}
        </span>
        {uploadedVideo.collectModule.isMultiRecipientFeeCollect && (
          <Tooltip
            content={`Split revenue enabled with ${multiRecipients?.length} recipients`}
          >
            <span>
              <SplitOutline
                className="mr-2 h-5 w-5 rotate-90"
                outline={false}
              />
            </span>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          <Trans>Collect Type</Trans>
        </div>
      </div>
      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Trigger>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-left text-sm focus:outline-none dark:border-gray-700"
          >
            <span>{getSelectedCollectType()}</span>
            <CheckOutline className="h-3 w-3" />
          </button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Collect Settings</Dialog.Title>
          <Flex direction="column" gap="3">
            <div className="no-scrollbar mt-2 max-h-[80vh] space-y-4 overflow-y-auto p-0.5">
              <PermissionQuestion
                setCollectType={setCollectType}
                uploadedVideo={uploadedVideo}
              />
              {!uploadedVideo.collectModule.isRevertCollect && (
                <LimitDurationQuestion
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              )}
              {!uploadedVideo.collectModule.isRevertCollect && (
                <LimitQuestion
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              )}
              {!uploadedVideo.collectModule.isRevertCollect && (
                <ChargeQuestion
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                />
              )}
              {(uploadedVideo.collectModule.isFeeCollect ||
                uploadedVideo.collectModule.collectLimitEnabled) &&
              !uploadedVideo.collectModule.isRevertCollect &&
              enabledCurrencies ? (
                <FeeCollectForm
                  setCollectType={setCollectType}
                  uploadedVideo={uploadedVideo}
                  setShowModal={setShowModal}
                  enabledCurrencies={enabledCurrencies.currencies.items}
                />
              ) : (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="classic"
                    highContrast
                    onClick={() => setShowModal(false)}
                  >
                    <Trans>Set Collect Type</Trans>
                  </Button>
                </div>
              )}
            </div>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default CollectModule
