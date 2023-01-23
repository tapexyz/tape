import CollectorsList from '@components/Common/CollectorsList'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import MirroredList from '@components/Common/MirroredList'
import Modal from '@components/UIElements/Modal'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { getRelativeTime } from 'utils/functions/formatTime'
import { getPublicationMediaRawUrl } from 'utils/functions/getPublicationMediaUrl'

import ViewCount from './ViewCount'

type Props = {
  video: Publication
}

const VideoMeta: FC<Props> = ({ video }) => {
  const [showCollectsModal, setShowCollectsModal] = useState(false)
  const [showMirrorsModal, setShowMirrorsModal] = useState(false)

  return (
    <div className="flex flex-wrap items-center opacity-70">
      <div className="flex items-center">
        <Modal
          title="Collected By"
          onClose={() => setShowCollectsModal(false)}
          show={showCollectsModal}
          panelClassName="max-w-md"
        >
          <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
            <CollectorsList videoId={video.id} />
          </div>
        </Modal>
        <Modal
          title="Mirrored By"
          onClose={() => setShowMirrorsModal(false)}
          show={showMirrorsModal}
          panelClassName="max-w-md"
        >
          <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
            <MirroredList videoId={video.id} />
          </div>
        </Modal>
        <ViewCount url={getPublicationMediaRawUrl(video)} />
        {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <>
            <button
              type="button"
              onClick={() => setShowCollectsModal(true)}
              className="flex items-center space-x-1 outline-none"
            >
              <CollectOutline className="w-3 h-3" />
              <span>{video.stats?.totalAmountOfCollects} collects</span>
            </button>
            <span className="px-1 middot" />
          </>
        )}
        <button
          type="button"
          onClick={() => setShowMirrorsModal(true)}
          className="flex items-center space-x-1 outline-none"
        >
          <MirrorOutline className="w-3 h-3" />
          <span>{video.stats?.totalAmountOfMirrors} mirrors</span>
        </button>
      </div>
      <span className="px-1 middot" />
      <span title={video.createdAt}>
        uploaded {getRelativeTime(video.createdAt)}
      </span>
    </div>
  )
}

export default VideoMeta
