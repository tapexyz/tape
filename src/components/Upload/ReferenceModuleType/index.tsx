import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React, { useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { ReferenceModuleType } from 'src/types/local'

const ReferenceModuleType = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const setReferenceType = (data: ReferenceModuleType) => {
    setUploadedVideo({
      referenceModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const getSelectedReferenceType = () => {
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
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          Comments and Mirrors
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-200 focus:outline-none dark:border-gray-800 rounded-xl"
      >
        <span>{getSelectedReferenceType()}</span>
        <AiOutlineCheck />
      </button>
      <Modal
        title="Who can comment or mirror this publication?"
        panelClassName="max-w-lg"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="mt-2 space-y-4">
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: false
              })
            }
            className={clsx(
              'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  !uploadedVideo.referenceModule?.followerOnlyReferenceModule
              }
            )}
          >
            <span>Anyone can comment and mirror</span>
            {!uploadedVideo.referenceModule?.followerOnlyReferenceModule && (
              <AiOutlineCheck />
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: true
              })
            }
            className={clsx(
              'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  uploadedVideo.referenceModule?.followerOnlyReferenceModule
              }
            )}
          >
            <span>Only my subscribers</span>
            {uploadedVideo.referenceModule?.followerOnlyReferenceModule && (
              <AiOutlineCheck />
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: true
              })
            }
            className={clsx(
              'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  uploadedVideo.referenceModule
                    ?.degreesOfSeparationReferenceModule
                    ?.degreesOfSeparation === 1
              }
            )}
          >
            <span>Only channels that I subscribed</span>
            {uploadedVideo.referenceModule?.degreesOfSeparationReferenceModule
              ?.degreesOfSeparation === 1 && <AiOutlineCheck />}
          </button>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(false)}>
              Set Collect Type
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ReferenceModuleType
