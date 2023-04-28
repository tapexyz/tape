import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import React, { useState } from 'react'
import type { ReferenceModuleType } from 'utils'

const ReferenceModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

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
      return t`Anyone can comment and mirror`
    } else if (followerOnlyReferenceModule) {
      return t`Only my subscribers can comment and mirror`
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
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          <Trans>Comments and Mirrors</Trans>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-left text-sm focus:outline-none dark:border-gray-700"
      >
        <span>{getSelectedReferenceType()}</span>
        <CheckOutline className="h-3 w-3" />
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
                'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none dark:border-gray-800',
                {
                  '!border-indigo-500':
                    !uploadedVideo.referenceModule
                      ?.followerOnlyReferenceModule &&
                    !uploadedVideo?.referenceModule
                      ?.degreesOfSeparationReferenceModule?.degreesOfSeparation
                }
              )}
            >
              <span>
                <Trans>Anyone</Trans>
              </span>
              {!uploadedVideo?.referenceModule?.followerOnlyReferenceModule &&
                !uploadedVideo?.referenceModule
                  ?.degreesOfSeparationReferenceModule?.degreesOfSeparation && (
                  <CheckOutline className="h-3 w-3" />
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
                'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-left text-sm focus:outline-none dark:border-gray-800',
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
                  <CheckOutline className="h-3 w-3 flex-none" />
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
              'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-left text-sm focus:outline-none dark:border-gray-800',
              {
                '!border-indigo-500':
                  uploadedVideo.referenceModule
                    ?.degreesOfSeparationReferenceModule !== null
              }
            )}
          >
            <span className="max-w-[95%]">
              <Trans>
                Only channels that I subscribed and their subscriptions, so on
                upto
              </Trans>
              <select
                onChange={onSelectReferenceDegree}
                onClick={(e) => e.preventDefault()}
                value={
                  uploadedVideo.referenceModule
                    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation ??
                  '3'
                }
                className="mx-1 rounded border px-0.5 text-sm focus:outline-none dark:border-gray-800"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
              <Trans>degrees away from my network</Trans>
            </span>
            {uploadedVideo.referenceModule
              ?.degreesOfSeparationReferenceModule !== null && (
              <CheckOutline className="h-3 w-3 flex-none" />
            )}
          </button>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(false)}>
              <Trans>Set Preference</Trans>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ReferenceModule
