import CollectorsList from '@components/Common/CollectorsList'
import HoverableProfile from '@components/Common/HoverableProfile'
import MirroredList from '@components/Common/MirroredList'
import {
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea
} from '@radix-ui/themes'
import {
  getProfile,
  getProfilePicture,
  getPublicationMediaCid
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import { CollectOutline, MirrorOutline, TimesOutline } from '@tape.xyz/ui'
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
    <div className="mt-2 flex flex-wrap items-center">
      <HoverableProfile
        fontSize="3"
        profile={video.by}
        pfp={
          <img
            src={getProfilePicture(video.by, 'AVATAR')}
            className="size-5 rounded-full"
            draggable={false}
            alt={getProfile(video.by)?.displayName}
          />
        }
      />
      <span className="middot px-1" />
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
                  <TimesOutline outlined={false} className="size-3" />
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
                  <TimesOutline outlined={false} className="size-3" />
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
          <CollectOutline className="size-4" />
          <span>{video.stats?.countOpenActions} collects</span>
        </button>
        <span className="middot px-1" />
        <button
          type="button"
          onClick={() => setShowMirrorsModal(true)}
          className="flex items-center space-x-1 outline-none"
        >
          <MirrorOutline className="size-4" />
          <span>{video.stats?.mirrors} mirrors</span>
        </button>
      </div>
    </div>
  )
}

export default VideoMeta
