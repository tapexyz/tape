import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Analytics, TRACK } from '@lenstube/browser'
import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'

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
    <div className="mt-4 flex items-center justify-end space-x-1 md:mt-2">
      <TipModal show={showTip} setShowTip={setShowTip} video={video} />
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        show={showReport}
        setShowReport={setShowReport}
        video={video}
      />
      <div className="rounded-full bg-indigo-100/50 px-4 py-1 backdrop-blur-xl dark:bg-indigo-900/30">
        <PublicationReaction
          publication={video}
          textSize="base"
          iconSize="base"
        />
      </div>
      <div className="flex items-center rounded-full bg-indigo-100/50 px-4 py-1 backdrop-blur-xl dark:bg-indigo-900/30">
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
              <Trans>Thanks</Trans>
            </span>
          </span>
        </button>
      </div>
      <div className="rounded-full bg-indigo-100/50 px-3 py-1.5 backdrop-blur-xl dark:bg-indigo-900/30">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          setShowReport={setShowReport}
          showOnHover={false}
        />
      </div>
    </div>
  )
}

export default VideoActions
