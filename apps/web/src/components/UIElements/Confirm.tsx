import { Button, Modal } from '@tape.xyz/ui'
import type { Dispatch, FC } from 'react'
import React from 'react'

type Props = {
  showConfirm: boolean
  setShowConfirm: Dispatch<boolean>
  action: () => void
  loading?: boolean
}

const Confirm: FC<Props> = ({
  showConfirm,
  setShowConfirm,
  action,
  loading
}) => {
  return (
    <Modal
      size="sm"
      title="Confirm"
      description="Are you sure you want to continue?"
      show={showConfirm}
      setShow={(b) => setShowConfirm(b)}
    >
      <div>
        <span className="text-red-500 opacity-75">This cannot be reverted</span>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button onClick={action} disabled={loading} loading={loading}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Confirm
