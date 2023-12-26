import type { Dispatch, FC } from 'react'

import { Button, Dialog } from '@radix-ui/themes'
import React from 'react'

type Props = {
  action: () => void
  setShowConfirm: Dispatch<boolean>
  showConfirm: boolean
}

const Confirm: FC<Props> = ({ action, setShowConfirm, showConfirm }) => {
  return (
    <Dialog.Root onOpenChange={(b) => setShowConfirm(b)} open={showConfirm}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Confirm</Dialog.Title>
        <Dialog.Description mb="4" size="2">
          Are you sure you want to continue?
        </Dialog.Description>

        <div>
          <span className="text-red-500 opacity-75">
            This cannot be reverted
          </span>
          <div className="flex justify-end space-x-2 pt-2">
            <Button onClick={() => setShowConfirm(false)} variant="soft">
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
