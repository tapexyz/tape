import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import CollectOutline from '@components/Common/Icons/CollectOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import PublicationReaction from '@components/Common/Publication/PublicationReaction'
import OpenActions from '@components/Watch/OpenActions'
import { Button, Dialog, DialogClose, Flex, IconButton } from '@radix-ui/themes'
import React from 'react'

import ByteComments from './ByteComments'

type Props = {
  video: MirrorablePublication
}

const ByteActions: FC<Props> = ({ video }) => {
  return (
    <div className="flex w-16 flex-col items-center justify-between">
      <div className="pt-2">
        <PublicationOptions publication={video} />
      </div>
      <div className="items-center pt-2.5 md:flex md:flex-col">
        <div className="pb-2">
          <PublicationReaction
            className="w-7"
            iconSize="lg"
            isVertical
            publication={video}
          />
        </div>
        <div className="space-y-4 py-2">
          <div className="w-full text-center">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button className="w-7" variant="ghost">
                  <Flex
                    align="center"
                    className="text-black dark:text-white"
                    direction="column"
                  >
                    <CommentOutline className="size-5" />
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
                    <IconButton className="w-7" color="gray" variant="ghost">
                      <TimesOutline className="size-4" outlined={false} />
                    </IconButton>
                  </DialogClose>
                </Flex>
                <ByteComments video={video} />
              </Dialog.Content>
            </Dialog.Root>
          </div>
          <div className="w-full text-center">
            <MirrorPublication video={video}>
              <Button className="w-7" highContrast variant="ghost">
                <Flex align="center" direction="column">
                  <MirrorOutline className="size-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.mirrors || 'Mirror'}
                  </span>
                </Flex>
              </Button>
            </MirrorPublication>
          </div>
          <div className="w-full text-center">
            <OpenActions publication={video}>
              <Button className="w-7" highContrast variant="ghost">
                <Flex align="center" direction="column">
                  <CollectOutline className="size-5" />
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
