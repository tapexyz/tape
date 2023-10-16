import TipOutline from '@components/Common/Icons/TipOutline'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Trans } from '@lingui/macro'
import { Dialog } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { getProfile } from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import { TriStateValue } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

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
        className="bg-brand-50 dark:bg-brand-950 rounded-full px-4 py-1 backdrop-blur-xl"
        publication={video}
        textSize="base"
        iconSize="base"
      />
      {video.operations.canComment === TriStateValue.Yes && (
        <Dialog.Root open={showTip}>
          <Dialog.Trigger>
            <button
              className="dark:bg-brand-950 bg-brand-50 flex items-center rounded-full px-4 py-1 backdrop-blur-xl focus:outline-none"
              onClick={() => {
                setShowTip(true)
                Analytics.track(TRACK.PUBLICATION.TIP.OPEN)
              }}
            >
              <span className="flex items-center space-x-1.5 text-base">
                <TipOutline className="h-4 w-4" />
                <span>
                  <Trans>Thanks</Trans>
                </span>
              </span>
            </button>
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

      <VideoOptions video={video} variant="soft" />
    </div>
  )
}

export default VideoActions
