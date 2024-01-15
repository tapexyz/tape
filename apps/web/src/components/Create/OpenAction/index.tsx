import useAppStore from '@lib/store'
import type { UnknownOpenActionType } from '@tape.xyz/lens/custom-types'
import { Button, Checkbox, ChevronRightOutline, Modal } from '@tape.xyz/ui'
import React, { useState } from 'react'

const APPROVED_UNKNOWN_OPEN_ACTIONS = [
  {
    name: 'Tip the creator',
    description:
      'Anyone can directly tip the creator of this publication with any of the supported currencies.',
    address: '',
    data: ''
  }
]

const OpenActionSettings = () => {
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<UnknownOpenActionType | null>(null)

  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const getSelectedOpenActions = () => {
    if (!uploadedMedia.unknownOpenAction) {
      return 'Select an action'
    }
    return `${uploadedMedia.unknownOpenAction?.name} (selected)`
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
          <span>{getSelectedOpenActions()}</span>
          <ChevronRightOutline className="size-3" />
        </div>
      </Button>
      <Modal
        title="Set Open Action"
        description="Select one of the following approved actions which can be executed by anyone viewing this publication."
        show={showModal}
        setShow={setShowModal}
        locked
      >
        <div className="no-scrollbar max-h-[70vh] space-y-2 overflow-y-auto py-2">
          {APPROVED_UNKNOWN_OPEN_ACTIONS.map(
            ({ name, description, address }, i) => (
              <div
                key={i}
                className="space-y-2 rounded-lg border border-gray-200 px-4 py-3"
              >
                <Checkbox
                  size="lg"
                  label={name}
                  checked={selected?.address === address}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      return setSelected(
                        APPROVED_UNKNOWN_OPEN_ACTIONS.find(
                          (action) => action.address === address
                        ) as (typeof APPROVED_UNKNOWN_OPEN_ACTIONS)[0]
                      )
                    }
                    setSelected(null)
                  }}
                />
                <p className="text-sm opacity-80">{description}</p>
              </div>
            )
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={() => {
                setUploadedMedia({ unknownOpenAction: selected })
                setShowModal(false)
              }}
            >
              Set Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OpenActionSettings
