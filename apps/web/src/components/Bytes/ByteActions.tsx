import CollectOutline from '@components/Common/Icons/CollectOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import OpenActions from '@components/Watch/OpenActions'
import PublicationReaction from '@components/Watch/PublicationReaction'
import { Button, Dialog, DialogClose, Flex, IconButton } from '@radix-ui/themes'
import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import ByteComments from './ByteComments'

type Props = {
  video: MirrorablePublication
}

const ByteActions: FC<Props> = ({ video }) => {
  return (
    <div className="flex w-16 flex-col items-center justify-between">
      <div className="pt-2">
        <VideoOptions video={video} />
      </div>
      <div className="items-center pt-2.5 md:flex md:flex-col">
        <div className="pb-2">
          <PublicationReaction
            className="w-7"
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
                <Button variant="ghost" className="w-7">
                  <Flex
                    direction="column"
                    className="text-black dark:text-white"
                    align="center"
                  >
                    <CommentOutline className="h-5 w-5" />
                    <span className="pt-1 text-xs">
                      {video.stats.comments || 'Wdyt'}
                    </span>
                  </Flex>
                </Button>
              </Dialog.Trigger>

              <Dialog.Content style={{ maxWidth: 550 }}>
                <Flex gap="3" justify="between" pb="2">
                  <Dialog.Title size="6">Comments</Dialog.Title>
                  <DialogClose>
                    <IconButton variant="ghost" className="w-7" color="gray">
                      <TimesOutline outlined={false} className="h-4 w-4" />
                    </IconButton>
                  </DialogClose>
                </Flex>
                <ByteComments video={video} />
              </Dialog.Content>
            </Dialog.Root>
          </div>
          <div className="w-full text-center">
            <MirrorVideo video={video}>
              <Button variant="ghost" className="w-7" highContrast>
                <Flex direction="column" align="center">
                  <MirrorOutline className="h-5 w-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.mirrors || 'Mirror'}
                  </span>
                </Flex>
              </Button>
            </MirrorVideo>
          </div>
          <div className="w-full text-center">
            <OpenActions publication={video}>
              <Button variant="ghost" className="w-7" highContrast>
                <Flex direction="column" align="center">
                  <CollectOutline className="h-5 w-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.countOpenActions || 'Collect'}
                  </span>
                </Flex>
              </Button>
            </OpenActions>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByteActions
