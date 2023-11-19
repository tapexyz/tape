import CollectOutline from '@components/Common/Icons/CollectOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import MirrorPublication from '@components/Common/MirrorPublication'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import PublicationReaction from '@components/Common/Publication/PublicationReaction'
import OpenActions from '@components/Watch/OpenActions'
import type { MirrorablePublication } from '@dragverse/lens'
import { Button, Dialog, DialogClose, Flex, IconButton } from '@radix-ui/themes'
import type { FC } from 'react'

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
            publication={video}
            iconSize="lg"
            isVertical
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
            <MirrorPublication video={video}>
              <Button variant="ghost" className="w-7" highContrast>
                <Flex direction="column" align="center">
                  <MirrorOutline className="h-5 w-5" />
                  <span className="pt-1 text-xs">
                    {video.stats?.mirrors || 'Mirror'}
                  </span>
                </Flex>
              </Button>
            </MirrorPublication>
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
