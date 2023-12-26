import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import CollectorsList from '@components/Common/CollectorsList'
import HoverableProfile from '@components/Common/HoverableProfile'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
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
        pfp={
          <img
            alt={getProfile(video.by)?.displayName}
            className="size-5 rounded-full"
            draggable={false}
            src={getProfilePicture(video.by, 'AVATAR')}
          />
        }
        profile={video.by}
      />
      <span className="middot px-1" />
      <div className="flex items-center">
        <Dialog.Root
          onOpenChange={(b) => setShowCollectsModal(b)}
          open={showCollectsModal}
        >
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Flex gap="3" justify="between" pb="2">
              <Dialog.Title size="6">Collectors</Dialog.Title>
              <DialogClose>
                <IconButton color="gray" variant="ghost">
                  <TimesOutline className="size-3" outlined={false} />
                </IconButton>
              </DialogClose>
            </Flex>

            <ScrollArea
              scrollbars="vertical"
              style={{ height: 400 }}
              type="hover"
            >
              <CollectorsList videoId={video.id} />
            </ScrollArea>
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root
          onOpenChange={(b) => setShowMirrorsModal(b)}
          open={showMirrorsModal}
        >
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Flex gap="3" justify="between" pb="2">
              <Dialog.Title size="6">Mirrors</Dialog.Title>
              <DialogClose>
                <IconButton color="gray" variant="ghost">
                  <TimesOutline className="size-3" outlined={false} />
                </IconButton>
              </DialogClose>
            </Flex>

            <ScrollArea
              scrollbars="vertical"
              style={{ height: 400 }}
              type="hover"
            >
              <MirroredList videoId={video.id} />
            </ScrollArea>
          </Dialog.Content>
        </Dialog.Root>

        <ViewCount cid={getPublicationMediaCid(video.metadata)} />
        <button
          className="flex items-center space-x-1 outline-none"
          onClick={() => setShowCollectsModal(true)}
          type="button"
        >
          <CollectOutline className="size-4" />
          <span>{video.stats?.countOpenActions} collects</span>
        </button>
        <span className="middot px-1" />
        <button
          className="flex items-center space-x-1 outline-none"
          onClick={() => setShowMirrorsModal(true)}
          type="button"
        >
          <MirrorOutline className="size-4" />
          <span>{video.stats?.mirrors} mirrors</span>
        </button>
      </div>
    </div>
  )
}

export default VideoMeta
