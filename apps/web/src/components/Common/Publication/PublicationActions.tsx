import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import TipOutline from '@components/Common/Icons/TipOutline'
import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { EVENTS, getProfile, Tower } from '@tape.xyz/generic'
import { TriStateValue } from '@tape.xyz/lens'
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
        color="blue"
        iconSize="base"
        publication={publication}
        textSize="inherit"
        variant="surface"
      />
      {publication.operations.canComment !== TriStateValue.No && (
        <Dialog.Root open={showTip}>
          <Dialog.Trigger>
            <Button
              color="blue"
              highContrast
              onClick={() => {
                setShowTip(true)
                Tower.track(EVENTS.PUBLICATION.TIP.OPEN)
              }}
              variant="surface"
            >
              <TipOutline className="size-4" />
              Thanks
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>
              Tip @{getProfile(publication.by)?.displayName}
            </Dialog.Title>
            <Dialog.Description mb="4" size="2">
              Show appreciation with a comment and tip.
            </Dialog.Description>

            <TipForm setShow={setShowTip} video={publication} />
          </Dialog.Content>
        </Dialog.Root>
      )}
      <MirrorPublication video={publication}>
        <Button color="blue" highContrast variant="surface">
          <MirrorOutline className="size-4 flex-none" />
          Mirror
        </Button>
      </MirrorPublication>
      <OpenActions publication={publication} text="Collect" />
      <PublicationOptions publication={publication}>
        <IconButton color="blue" highContrast variant="surface">
          <ThreeDotsOutline className="size-4" />
        </IconButton>
      </PublicationOptions>
    </div>
  )
}

export default PublicationActions
