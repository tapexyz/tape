import CollectorsList from '@components/Common/CollectorsList'
import HoverableProfile from '@components/Common/HoverableProfile'
import MirroredList from '@components/Common/MirroredList'
import {
  getProfile,
  getProfilePicture,
  getPublicationMediaCid
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import { CollectOutline, MirrorOutline, Modal } from '@tape.xyz/ui'
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
        <Modal
          size="sm"
          title="Collectors"
          show={showCollectsModal}
          setShow={(b) => setShowCollectsModal(b)}
        >
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
            <CollectorsList videoId={video.id} />
          </div>
        </Modal>
        <Modal
          size="sm"
          title="Mirrors"
          show={showMirrorsModal}
          setShow={(b) => setShowMirrorsModal(b)}
        >
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
            <MirroredList videoId={video.id} />
          </div>
        </Modal>

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
