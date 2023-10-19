import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import TipOutline from '@components/Common/Icons/TipOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Trans } from '@lingui/macro'
import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { getProfile } from '@tape.xyz/generic'
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
    <div className="mt-4 flex items-center justify-end space-x-1 md:mt-2">
      <PublicationReaction
        className="mx-2"
        publication={video}
        textSize="base"
        iconSize="base"
      />
      {video.operations.canComment === TriStateValue.Yes && (
        <Dialog.Root open={showTip}>
          <Dialog.Trigger>
            <Button
              variant="surface"
              highContrast
              onClick={() => {
                setShowTip(true)
                Analytics.track(TRACK.PUBLICATION.TIP.OPEN)
              }}
            >
              <TipOutline className="h-4 w-4" />
              <Trans>Thanks</Trans>
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>
              <Trans>Tip</Trans> {getProfile(video.by)?.displayName}
            </Dialog.Title>
            <Dialog.Description size="2" mb="4">
              <Trans>Show appreciation with a comment and tip.</Trans>
            </Dialog.Description>

            <TipForm video={video} setShow={setShowTip} />
          </Dialog.Content>
        </Dialog.Root>
      )}
      <div className="flex items-center space-x-2 px-1">
        <div className="hidden md:block">
          <MirrorVideo video={video}>
            <Button variant="surface" highContrast>
              <MirrorOutline className="h-4 w-4 flex-none" />
              Mirror
            </Button>
          </MirrorVideo>
        </div>
        <OpenActions publication={video} text="Collect" />
      </div>

      <VideoOptions video={video}>
        <IconButton variant="surface" highContrast>
          <ThreeDotsOutline className="h-4 w-4" />
        </IconButton>
      </VideoOptions>
    </div>
  )
}

export default VideoActions
