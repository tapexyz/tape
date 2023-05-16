import CheckOutline from '@components/Common/Icons/CheckOutline'
import SplitOutline from '@components/Common/Icons/SplitOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useEnabledModuleCurrrenciesQuery } from 'lens'
import React, { useState } from 'react'
import type { CollectModuleType } from 'utils'

import ChargeQuestion from './ChargeQuestion'
import FeeCollectForm from './FeeCollectForm'
import LimitDurationQuestion from './LimitDurationQuestion'
import LimitQuestion from './LimitQuestion'
import PermissionQuestion from './PermissionQuestion'

const CollectModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const setCollectType = (data: CollectModuleType) => {
    setUploadedVideo({
      collectModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const { data: enabledCurrencies } = useEnabledModuleCurrrenciesQuery({
    variables: { request: { profileIds: selectedChannel?.id } },
    skip: !selectedChannel?.id
  })

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedVideo.collectModule.followerOnlyCollect
    const timeLimitEnabled = uploadedVideo.collectModule.timeLimitEnabled
    const collectLimitEnabled = uploadedVideo.collectModule.collectLimitEnabled
    const collectLimit = uploadedVideo.collectModule.collectLimit
    const multiRecipients = uploadedVideo.collectModule.multiRecipients
    if (uploadedVideo.collectModule.isRevertCollect) {
      return t`No one can collect this publication`
    }
    if (Boolean(uploadedVideo.collectModule.amount?.value)) {
      return `${
        followerOnlyCollect ? t`Subscribers` : t`Anyone`
      } can collect for free ${timeLimitEnabled ? t`within 24hrs` : ''}`
    }
    if (!Boolean(uploadedVideo.collectModule.amount?.value)) {
      return (
        <div className="flex items-center space-x-1">
          <span>
            {followerOnlyCollect ? t`Subscribers` : t`Anyone`}{' '}
            <Trans>can collect</Trans>{' '}
            {collectLimitEnabled ? `maximum of ${collectLimit}` : ''}{' '}
            <Trans>for given fees</Trans>{' '}
            {timeLimitEnabled ? t`within 24hrs` : ''}
          </span>
          {uploadedVideo.collectModule.isMultiRecipientFeeCollect && (
            <Tooltip
              content={`Split revenue enabled with ${multiRecipients?.length} recipients`}
            >
              <span>
                <SplitOutline className="h-5 w-5 rotate-90" outline={false} />
              </span>
            </Tooltip>
          )}
        </div>
      )
    }
  }

  return (
    <>
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          <Trans>Collect Type</Trans>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-left text-sm focus:outline-none dark:border-gray-700"
      >
        <span>{getSelectedCollectType()}</span>
        <CheckOutline className="h-3 w-3" />
      </button>
      <Modal
        title={t`Select collect type`}
        panelClassName="max-w-lg"
        show={showModal}
      >
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
          {uploadedVideo.collectModule.isFeeCollect &&
          !uploadedVideo.collectModule.isRevertCollect &&
          enabledCurrencies ? (
            <FeeCollectForm
              setCollectType={setCollectType}
              uploadedVideo={uploadedVideo}
              setShowModal={setShowModal}
              enabledCurrencies={enabledCurrencies}
            />
          ) : (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setShowModal(false)}>
                <Trans>Set Collect Type</Trans>
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default CollectModule
