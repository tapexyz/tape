import CollectorsList from '@components/Common/CollectorsList'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import MirroredList from '@components/Common/MirroredList'
import { getDateString, getRelativeTime } from '@lib/formatTime'
import { Trans } from '@lingui/macro'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea
} from '@radix-ui/themes'
import { getPublicationMediaCid } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

import ViewCount from './ViewCount'

type Props = {
  video: PrimaryPublication
}

const VideoMeta: FC<Props> = ({ video }) => {
  const [showCollectsModal, setShowCollectsModal] = useState(false)
  const [showMirrorsModal, setShowMirrorsModal] = useState(false)

  return (
    <div className="flex flex-wrap items-center">
      <div className="flex items-center">
        <Dialog.Root
          open={showCollectsModal}
          onOpenChange={(b) => setShowCollectsModal(b)}
        >
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Flex gap="3" justify="between" pb="2">
              <Dialog.Title size="6">Collectors</Dialog.Title>
              <DialogClose>
                <IconButton variant="ghost" color="gray">
                  <TimesOutline outlined={false} className="h-4 w-4" />
                </IconButton>
              </DialogClose>
            </Flex>

            <ScrollArea
              type="hover"
              scrollbars="vertical"
              style={{ height: 400 }}
            >
              <CollectorsList videoId={video.id} />
            </ScrollArea>
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root
          open={showMirrorsModal}
          onOpenChange={(b) => setShowMirrorsModal(b)}
        >
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Flex gap="3" justify="between" pb="2">
              <Dialog.Title size="6">Mirrors</Dialog.Title>
              <DialogClose>
                <IconButton variant="ghost" color="gray">
                  <TimesOutline outlined={false} className="h-4 w-4" />
                </IconButton>
              </DialogClose>
            </Flex>

            <ScrollArea
              type="hover"
              scrollbars="vertical"
              style={{ height: 400 }}
            >
              <MirroredList videoId={video.id} />
            </ScrollArea>
          </Dialog.Content>
        </Dialog.Root>

        <ViewCount cid={getPublicationMediaCid(video.metadata)} />
        <button
          type="button"
          onClick={() => setShowCollectsModal(true)}
          className="flex items-center space-x-1 outline-none"
        >
          <CollectOutline className="h-4 w-4" />
          <span>
            {video.stats?.countOpenActions} <Trans>collects</Trans>
          </span>
        </button>
        <span className="middot px-1" />
        <button
          type="button"
          onClick={() => setShowMirrorsModal(true)}
          className="flex items-center space-x-1 outline-none"
        >
          <MirrorOutline className="h-4 w-4" />
          <span>
            {video.stats?.mirrors} <Trans>mirrors</Trans>
          </span>
        </button>
      </div>
      <span className="middot px-1" />
      <span title={getDateString(video.createdAt)}>
        uploaded {getRelativeTime(video.createdAt)}
      </span>
    </div>
  )
}

export default VideoMeta
