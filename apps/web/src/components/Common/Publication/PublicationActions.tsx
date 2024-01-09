import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import { Button, IconButton } from '@radix-ui/themes'
import type { MirrorablePublication } from '@tape.xyz/lens'
import { TriStateValue } from '@tape.xyz/lens'
import { MirrorOutline, Modal, ThreeDotsOutline } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'

import OpenActions from '../../Watch/OpenActions'
import TipForm from '../../Watch/TipForm'
import PublicationReaction from './PublicationReaction'

type Props = {
  publication: MirrorablePublication
}

const PublicationActions: FC<Props> = ({ publication }) => {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="flex items-center justify-end space-x-2">
      <PublicationReaction
        publication={publication}
        textSize="inherit"
        iconSize="base"
        variant="surface"
        color="blue"
      />
      {publication.operations.canComment !== TriStateValue.No ? (
        <Modal
          show={showTip}
          setShow={setShowTip}
          title={`Tip @{getProfile(publication.by)?.displayName}`}
          description="Show appreciation with a comment and tip."
        >
          <TipForm video={publication} setShow={setShowTip} />
        </Modal>
      ) : null}
      <MirrorPublication video={publication}>
        <Button variant="surface" color="blue" highContrast>
          <MirrorOutline className="size-4 flex-none" />
          Mirror
        </Button>
      </MirrorPublication>
      <OpenActions publication={publication} text="Collect" />
      <PublicationOptions publication={publication}>
        <IconButton variant="surface" color="blue" highContrast>
          <ThreeDotsOutline className="size-4" />
        </IconButton>
      </PublicationOptions>
    </div>
  )
}

export default PublicationActions
