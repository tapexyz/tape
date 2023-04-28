import FlagOutline from '@components/Common/Icons/FlagOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ShareOutline from '@components/Common/Icons/ShareOutline'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import { Trans } from '@lingui/macro'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Analytics, TRACK } from 'utils'

import PublicationReaction from './PublicationReaction'
import TipModal from './TipModal'

type Props = {
  video: Publication
}

const VideoActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="mt-4 flex items-center justify-end space-x-2.5 md:mt-2 md:space-x-5">
      <TipModal show={showTip} setShowTip={setShowTip} video={video} />
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        show={showReport}
        setShowReport={setShowReport}
        video={video}
      />
      <PublicationReaction
        publication={video}
        textSize="base"
        iconSize="base"
      />
      <button
        className="focus:outline-none"
        onClick={() => {
          Analytics.track(TRACK.PUBLICATION.TIP.OPEN)
          setShowTip(true)
        }}
      >
        <span className="flex items-center space-x-1.5 text-base">
          <HeartOutline className="h-4 w-4" />
          <span>
            <Trans>Tip</Trans>
          </span>
        </span>
      </button>
      <button className="focus:outline-none" onClick={() => setShowShare(true)}>
        <span className="flex items-center space-x-1.5 text-base">
          <ShareOutline className="h-4 w-4" />
          <span>
            <Trans>Share</Trans>
          </span>
        </span>
      </button>
      <button
        className="focus:outline-none"
        onClick={() => {
          setShowReport(true)
        }}
      >
        <span className="flex items-center space-x-1.5 text-base">
          <FlagOutline className="h-4 w-4" />
          <span>
            <Trans>Report</Trans>
          </span>
        </span>
      </button>
    </div>
  )
}

export default VideoActions
