import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import TipOutline from '@components/Common/Icons/TipOutline'
import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import { EVENTS, getProfile, Tower } from '@dragverse/generic'
import type { MirrorablePublication } from '@dragverse/lens'
import { TriStateValue } from '@dragverse/lens'
import { Button, Dialog, IconButton } from '@radix-ui/themes'
import type { FC } from 'react'
import { useState } from 'react'

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
      {publication.operations.canComment !== TriStateValue.No && (
        <Dialog.Root open={showTip}>
          <Dialog.Trigger>
            <Button
              variant="surface"
              color="blue"
              highContrast
              onClick={() => {
                setShowTip(true)
                Tower.track(EVENTS.PUBLICATION.TIP.OPEN)
              }}
            >
              <TipOutline className="h-4 w-4" />
              Tip
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>
              Tip @{getProfile(publication.by)?.displayName}
            </Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Show appreciation with a comment and tip.
            </Dialog.Description>

            <TipForm video={publication} setShow={setShowTip} />
          </Dialog.Content>
        </Dialog.Root>
      )}
      <MirrorPublication video={publication}>
        <Button variant="surface" color="blue" highContrast>
          <MirrorOutline className="h-4 w-4 flex-none" />
          Mirror
        </Button>
      </MirrorPublication>
      <OpenActions publication={publication} text="Collect" />
      <PublicationOptions publication={publication}>
        <IconButton variant="surface" color="blue" highContrast>
          <ThreeDotsOutline className="h-4 w-4" />
        </IconButton>
      </PublicationOptions>
    </div>
  )
}

export default PublicationActions
