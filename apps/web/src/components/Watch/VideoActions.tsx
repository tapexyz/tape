import HeartOutline from '@components/Common/Icons/HeartOutline'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Analytics, TRACK } from '@lenstube/browser'
import { trimLensHandle } from '@lenstube/generic'
import type { MirrorablePublication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import { Dialog } from '@radix-ui/themes'
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
      <div className="rounded-full bg-indigo-100/50 px-4 py-1 backdrop-blur-xl dark:bg-indigo-900/30">
        <PublicationReaction
          publication={video}
          textSize="base"
          iconSize="base"
        />
      </div>
      <Dialog.Root open={showTip}>
        <Dialog.Trigger>
          <div className="flex items-center rounded-full bg-indigo-100/50 px-4 py-1 backdrop-blur-xl dark:bg-indigo-900/30">
            <button
              className="focus:outline-none"
              onClick={() => {
                setShowTip(true)
                Analytics.track(TRACK.PUBLICATION.TIP.OPEN)
              }}
            >
              <span className="flex items-center space-x-1.5 text-base">
                <HeartOutline className="h-4 w-4" />
                <span>
                  <Trans>Thanks</Trans>
                </span>
              </span>
            </button>
          </div>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>
            <Trans>Tip</Trans> {trimLensHandle(video.by?.handle)}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            <Trans>Show appreciation with a comment and tip.</Trans>
          </Dialog.Description>

          <TipForm video={video} setShow={setShowTip} />
        </Dialog.Content>
      </Dialog.Root>

      <div className="rounded-full bg-indigo-100/50 px-3 py-2 backdrop-blur-xl dark:bg-indigo-900/30">
        <VideoOptions video={video} />
      </div>
    </div>
  )
}

export default VideoActions
