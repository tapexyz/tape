import CollectorsList from '@components/Common/CollectorsList'
import Modal from '@components/UIElements/Modal'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC, useState } from 'react'
import { SiOpenmined } from 'react-icons/si'
import { LenstubePublication } from 'src/types/local'

dayjs.extend(relativeTime)

type Props = { video: LenstubePublication }

const VideoMeta: FC<Props> = ({ video }) => {
  const [showCollectsModal, setShowCollectsModal] = useState(false)

  return (
    <div className="flex items-center text-sm opacity-70">
      <div className="flex items-center">
        <Modal
          title="Collectors"
          onClose={() => setShowCollectsModal(false)}
          show={showCollectsModal}
          panelClassName="max-w-md"
        >
          <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
            <CollectorsList videoId={video.id} />
          </div>
        </Modal>
        <button
          onClick={() => setShowCollectsModal(true)}
          className="flex items-center space-x-1 outline-none"
        >
          <SiOpenmined className="text-xs" />
          <span>{video.stats.totalAmountOfCollects} collects</span>
        </button>
      </div>
      <span className="middot" />
      <span title={video.createdAt}>
        uploaded {dayjs(new Date(video.createdAt)).fromNow()}
      </span>
    </div>
  )
}

export default VideoMeta
