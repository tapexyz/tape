import { t, Trans } from '@lingui/macro'
import type { Dispatch, FC } from 'react'
import React from 'react'

import { Button } from './Button'
import Modal from './Modal'

type Props = {
  showConfirm: boolean
  setShowConfirm: Dispatch<boolean>
  action: () => void
}

const Confirm: FC<Props> = ({ showConfirm, setShowConfirm, action }) => {
  return (
    <Modal
      title={t`Confirmation`}
      panelClassName="max-w-lg"
      show={showConfirm}
      onClose={() => setShowConfirm(false)}
    >
      <div className="pt-4">
        <h5 className="pb-3">
          <Trans>Are you sure want to continue?</Trans>
        </h5>
        <span className="text-red-500 opacity-75">
          <Trans>This cannot be reverted.</Trans>
        </span>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="hover" onClick={() => setShowConfirm(false)}>
            <Trans>Cancel</Trans>
          </Button>
          <Button onClick={action}>
            <Trans>Confirm</Trans>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Confirm
