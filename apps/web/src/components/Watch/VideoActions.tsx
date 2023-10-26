import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import TipOutline from '@components/Common/Icons/TipOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { EVENTS, getProfile, Tower } from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import { TriStateValue } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

import OpenActions from './OpenActions'
import PublicationReaction from './PublicationReaction'
import TipForm from './TipForm'

type Props = {
  video: MirrorablePublication
}

const VideoActions: FC<Props> = ({ video }) => {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="mt-4 flex items-center justify-end space-x-2 md:mt-2">
      <PublicationReaction
        publication={video}
        textSize="base"
        iconSize="base"
        variant="surface"
      />
      {video.operations.canComment !== TriStateValue.No && (
        <Dialog.Root open={showTip}>
          <Dialog.Trigger>
            <Button
              variant="surface"
              highContrast
              onClick={() => {
                setShowTip(true)
                Tower.track(EVENTS.PUBLICATION.TIP.OPEN)
              }}
            >
              <TipOutline className="h-4 w-4" />
              Thanks
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Tip {getProfile(video.by)?.displayName}</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Show appreciation with a comment and tip.
            </Dialog.Description>

            <TipForm video={video} setShow={setShowTip} />
          </Dialog.Content>
        </Dialog.Root>
      )}
      {video.operations.canMirror && (
        <MirrorVideo video={video}>
          <Button variant="surface" highContrast>
            <MirrorOutline className="h-4 w-4 flex-none" />
            Mirror
          </Button>
        </MirrorVideo>
      )}
      <OpenActions publication={video} text="Collect" />
      <VideoOptions video={video}>
        <IconButton variant="surface" highContrast>
          <ThreeDotsOutline className="h-4 w-4" />
        </IconButton>
      </VideoOptions>
    </div>
  )
}

export default VideoActions
