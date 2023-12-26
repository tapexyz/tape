import { Button, Dialog } from '@radix-ui/themes'
import type { Dispatch, FC } from 'react'
import React from 'react'

type Props = {
  showConfirm: boolean
  setShowConfirm: Dispatch<boolean>
  action: () => void
}

const Confirm: FC<Props> = ({ showConfirm, setShowConfirm, action }) => {
  return (
    <Dialog.Root open={showConfirm} onOpenChange={(b) => setShowConfirm(b)}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Confirm</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to continue?
        </Dialog.Description>

        <div>
          <span className="text-red-500 opacity-75">
            This cannot be reverted
          </span>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="soft" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button highContrast onClick={action}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Confirm
