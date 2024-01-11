import useAppStore from '@lib/store'
import useCollectStore from '@lib/store/idb/collect'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import {
  Button,
  Checkbox,
  ChevronRightOutline,
  Modal,
  SplitOutline,
  Tooltip
} from '@tape.xyz/ui'
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
      <Button
        type="button"
        variant="secondary"
        className="!font-normal"
        onClick={() => setShowModal(true)}
      >
        <div className="flex w-full items-center justify-between">
          <span>{getSelectedCollectType()}</span>
          <ChevronRightOutline className="size-3" />
        </div>
      </Button>
      <Modal
        title="Collectible"
        description={
          <Checkbox
            label="Save as default settings"
            onCheckedChange={(checked) => {
              setSaveAsDefault(checked as boolean)
              Tower.track(EVENTS.PUBLICATION.SAVE_AS_DEFAULT_COLLECT)
            }}
            checked={saveAsDefault}
          />
        }
        show={showModal}
        setShow={setShowModal}
        locked
      >
        <div className="no-scrollbar max-h-[70vh] space-y-2 overflow-y-auto p-0.5">
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
              !uploadedMedia.collectModule.isRevertCollect ? (
                <FeeCollectForm
                  setCollectType={setCollectType}
                  setShowModal={setShowModal}
                />
              ) : (
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      if (saveAsDefault) {
                        setPersistedCollectModule(uploadedMedia.collectModule)
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
      </Modal>
    </div>
  )
}

export default CollectModule
