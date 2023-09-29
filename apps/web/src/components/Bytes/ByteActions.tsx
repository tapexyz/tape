import CommentOutline from '@components/Common/Icons/CommentOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import CollectVideo from '@components/Watch/CollectVideo'
import PublicationReaction from '@components/Watch/PublicationReaction'
import type { MirrorablePublication } from '@lenstube/lens'
import { t } from '@lingui/macro'
import { Dialog, DialogClose, Flex, IconButton } from '@radix-ui/themes'
import type { FC } from 'react'
import React from 'react'

import ByteComments from './ByteComments'

type Props = {
  video: MirrorablePublication
}

const ByteActions: FC<Props> = ({ video }) => {
  return (
    <div className="flex w-14 flex-col items-center justify-between">
      <div className="pt-2">
        <VideoOptions video={video} />
      </div>
      <div className="items-center pt-2.5 md:flex md:flex-col">
        <div className="pb-3">
          <PublicationReaction
            publication={video}
            iconSize="lg"
            isVertical
            showLabel
          />
        </div>
        <div className="space-y-4 py-2">
          <div className="w-full text-center">
            <Dialog.Root>
              <Dialog.Trigger>
                <div className="flex flex-col items-center">
                  <CommentOutline className="h-5 w-5" />
                  <div className="pt-1 text-xs">
                    {video.stats.comments || 'Wdyt'}
                  </div>
                </div>
              </Dialog.Trigger>

              <Dialog.Content style={{ maxWidth: 450 }}>
                <Flex gap="3" justify="between" pb="2">
                  <Dialog.Title size="6">Comments</Dialog.Title>
                  <DialogClose>
                    <IconButton variant="ghost" color="gray">
                      <TimesOutline outlined={false} className="h-4 w-4" />
                    </IconButton>
                  </DialogClose>
                </Flex>

                <ByteComments video={video} />
              </Dialog.Content>
            </Dialog.Root>
          </div>
          <div className="text-cente w-full">
            <MirrorVideo video={video}>
              <div className="flex flex-col items-center">
                <MirrorOutline className="h-5 w-5" />
                <div className="pt-1 text-xs">
                  {video.stats?.mirrors || t`Mirror`}
                </div>
              </div>
            </MirrorVideo>
          </div>
          <div className="w-full text-center">
            <CollectVideo video={video} variant="ghost" />
            <div className="text-center text-xs leading-3">
              {video.stats?.countOpenActions || t`Collect`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByteActions
