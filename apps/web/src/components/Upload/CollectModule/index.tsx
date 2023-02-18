import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
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
  const selectedChannel = useAppStore((state) => state.selectedChannel)

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
    const isTimedFeeCollect = uploadedVideo.collectModule.isTimedFeeCollect
    const isLimitedFeeCollect = uploadedVideo.collectModule.isLimitedFeeCollect
    const collectLimit = uploadedVideo.collectModule.collectLimit
    if (uploadedVideo.collectModule.isRevertCollect) {
      return 'No one can collect this publication'
    }
    if (uploadedVideo.collectModule.isFreeCollect) {
      return `${
        followerOnlyCollect ? 'Only Subscribers' : 'Anyone'
      } can collect for free ${isTimedFeeCollect ? 'within 24hrs' : ''}`
    }
    if (!uploadedVideo.collectModule.isFreeCollect) {
      return `${
        followerOnlyCollect ? 'Only Subscribers' : 'Anyone'
      } can collect ${
        isLimitedFeeCollect ? `maximum of ${collectLimit}` : ''
      } for given fees ${isTimedFeeCollect ? 'within 24hrs' : ''}`
    }
  }

  return (
    <>
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          Collect Type
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
        title={
          <span className="text-sm uppercase tracking-wider opacity-70">
            Select collect type
          </span>
        }
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
          {!uploadedVideo.collectModule.isRevertCollect &&
            !uploadedVideo.collectModule.isTimedFeeCollect &&
            !uploadedVideo.collectModule.isLimitedFeeCollect && (
              <ChargeQuestion
                setCollectType={setCollectType}
                uploadedVideo={uploadedVideo}
              />
            )}
          {!uploadedVideo.collectModule.isFreeCollect &&
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
                Set Collect Type
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default CollectModule
