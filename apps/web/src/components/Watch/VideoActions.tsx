import FlagOutline from '@components/Common/Icons/FlagOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ShareOutline from '@components/Common/Icons/ShareOutline'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@utils/analytics'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { LenstubePublication } from 'src/types'

import PublicationReaction from './PublicationReaction'
import TipModal from './TipModal'

type Props = {
  video: LenstubePublication
}

const VideoActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="flex items-center justify-end mt-4 space-x-2.5 md:space-x-4 md:mt-0">
      <TipModal show={showTip} setShowTip={setShowTip} video={video} />
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        show={showReport}
        setShowReport={setShowReport}
        video={video}
      />

      <PublicationReaction publication={video} textSize="lg" />
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => {
          Analytics.track(TRACK.TIP.OPEN)
          setShowTip(true)
        }}
      >
        <span className="flex items-center space-x-1">
          <HeartOutline className="w-3.5 h-3.5" />
          <span>Tip</span>
        </span>
      </Button>
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => setShowShare(true)}
      >
        <span className="flex items-center space-x-1">
          <ShareOutline className="w-3.5 h-3.5" />
          <span>Share</span>
        </span>
      </Button>
      <Button
        onClick={() => {
          Analytics.track(TRACK.DISLIKE_VIDEO)
          setShowReport(true)
        }}
        variant="secondary"
        className="!p-0"
      >
        <span className="flex items-center space-x-1">
          <FlagOutline className="w-3.5 h-3.5" />
          <span>Report</span>
        </span>
      </Button>
    </div>
  )
}

export default VideoActions
