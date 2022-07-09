import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import React, { useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { CollectModuleType } from 'src/types/local'

import ChargeQuestion from './ChargeQuestion'
import FeeCollectForm from './FeeCollectForm'
import PermissionQuestion from './PermissionQuestion'

const CollectModuleType = () => {
  const [showModal, setShowModal] = useState(false)
  const { uploadedVideo, setUploadedVideo } = useAppStore()
  console.log(
    '🚀 ~ file: CollectModuleType.tsx ~ line 16 ~ CollectModuleType ~ uploadedVideo',
    uploadedVideo.collectModule
  )

  const setCollectType = (data: CollectModuleType) => {
    setUploadedVideo({
      collectModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const getSelectedCollectType = () => {
    const followerOnly = uploadedVideo.collectModule.followerOnly
    const amount = uploadedVideo.collectModule.amount?.value
    if (uploadedVideo.collectModule.type === 'revertCollectModule') {
      return 'No one can mint this publication'
    }
    if (uploadedVideo.collectModule.isFree) {
      return `${
        followerOnly ? 'Only Subscribers' : 'Anyone'
      } can mint this publication for free`
    } else if (!uploadedVideo.collectModule.isFree) {
      return `${
        followerOnly ? 'Only Subscribers' : 'Anyone'
      } can mint this publication for given fees - ${amount}`
    } else if (uploadedVideo.collectModule.followerOnly) {
      return 'Anyone can mint this publication for free'
    }
  }

  return (
    <>
      <div className="flex items-center mb-1 space-x-1.5">
        <div className={'text-[11px] font-semibold uppercase opacity-70'}>
          Collect Type
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none dark:border-gray-800 rounded-xl"
      >
        <span>{getSelectedCollectType()}</span>
        <AiOutlineCheck />
      </button>
      <Modal
        title="Select collect type"
        panelClassName="max-w-md"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="mt-4 space-y-3">
          <PermissionQuestion
            setCollectType={setCollectType}
            uploadedVideo={uploadedVideo}
          />
          {uploadedVideo.collectModule.type !== 'revertCollectModule' && (
            <ChargeQuestion
              setCollectType={setCollectType}
              uploadedVideo={uploadedVideo}
            />
          )}
          {!uploadedVideo.collectModule.isFree &&
            uploadedVideo.collectModule.type !== 'revertCollectModule' && (
              <FeeCollectForm
                setCollectType={setCollectType}
                uploadedVideo={uploadedVideo}
                setShowModal={setShowModal}
              />
            )}
        </div>
      </Modal>
    </>
  )
}

export default CollectModuleType
