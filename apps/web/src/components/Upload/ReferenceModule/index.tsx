import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import React, { useState } from 'react'
import type { ReferenceModuleType } from 'utils'

const ReferenceModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)
  const setUploadedVideo = usePersistStore((state) => state.setUploadedVideo)

  const setReferenceType = (data: ReferenceModuleType) => {
    setUploadedVideo({
      referenceModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const getSelectedReferenceType = () => {
    const followerOnlyReferenceModule =
      uploadedVideo?.referenceModule?.followerOnlyReferenceModule
    const degreesOfSeparationReferenceModule =
      uploadedVideo?.referenceModule?.degreesOfSeparationReferenceModule
    if (!followerOnlyReferenceModule && !degreesOfSeparationReferenceModule) {
      return 'Anyone can comment and mirror'
    } else if (followerOnlyReferenceModule) {
      return 'Only my subscribers can comment and mirror'
    } else if (
      degreesOfSeparationReferenceModule &&
      degreesOfSeparationReferenceModule.degreesOfSeparation < 5
    ) {
      return `Channels subscribed upto ${degreesOfSeparationReferenceModule.degreesOfSeparation} degrees away from my network`
    }
  }

  const onSelectReferenceDegree = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setReferenceType({
      followerOnlyReferenceModule: false,
      degreesOfSeparationReferenceModule: {
        commentsRestricted: true,
        mirrorsRestricted: true,
        degreesOfSeparation: Number(event.target.value)
      }
    })
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
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-300 focus:outline-none dark:border-gray-700 rounded-xl"
      >
        <span>{getSelectedReferenceType()}</span>
        <CheckOutline className="w-3 h-3" />
      </button>
      <Modal
        title="Who can comment and mirror this publication?"
        panelClassName="max-w-lg"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                setReferenceType({
                  followerOnlyReferenceModule: false,
                  degreesOfSeparationReferenceModule: null
                })
              }
              className={clsx(
                'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
                {
                  '!border-indigo-500':
                    !uploadedVideo.referenceModule
                      ?.followerOnlyReferenceModule &&
                    !uploadedVideo?.referenceModule
                      ?.degreesOfSeparationReferenceModule?.degreesOfSeparation
                }
              )}
            >
              <span>Anyone</span>
              {!uploadedVideo?.referenceModule?.followerOnlyReferenceModule &&
                !uploadedVideo?.referenceModule
                  ?.degreesOfSeparationReferenceModule?.degreesOfSeparation && (
                  <CheckOutline className="w-3 h-3" />
                )}
            </button>
            <button
              type="button"
              onClick={() =>
                setReferenceType({
                  followerOnlyReferenceModule: true,
                  degreesOfSeparationReferenceModule: null
                })
              }
              className={clsx(
                'flex items-center text-left justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
                {
                  '!border-indigo-500':
                    uploadedVideo.referenceModule
                      ?.followerOnlyReferenceModule &&
                    !uploadedVideo.referenceModule
                      ?.degreesOfSeparationReferenceModule
                }
              )}
            >
              <span>Only my subscribers</span>
              {uploadedVideo.referenceModule?.followerOnlyReferenceModule &&
                !uploadedVideo.referenceModule
                  ?.degreesOfSeparationReferenceModule && (
                  <CheckOutline className="w-3 h-3 flex-none" />
                )}
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: false,
                degreesOfSeparationReferenceModule: {
                  commentsRestricted: true,
                  mirrorsRestricted: true,
                  degreesOfSeparation:
                    uploadedVideo.referenceModule
                      ?.degreesOfSeparationReferenceModule
                      ?.degreesOfSeparation ?? 3
                }
              })
            }
            className={clsx(
              'flex items-center text-left justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  uploadedVideo.referenceModule
                    ?.degreesOfSeparationReferenceModule !== null
              }
            )}
          >
            <span className="max-w-[95%]">
              Only channels that I subscribed and their subscriptions, so on
              upto
              <select
                onChange={onSelectReferenceDegree}
                onClick={(e) => e.preventDefault()}
                value={
                  uploadedVideo.referenceModule
                    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation ??
                  '3'
                }
                className="px-0.5 text-sm mx-1 border rounded dark:border-gray-800 focus:outline-none"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
              degrees away from my network
            </span>
            {uploadedVideo.referenceModule
              ?.degreesOfSeparationReferenceModule !== null && (
              <CheckOutline className="w-3 h-3 flex-none" />
            )}
          </button>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(false)}>
              Set Preference
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ReferenceModule
