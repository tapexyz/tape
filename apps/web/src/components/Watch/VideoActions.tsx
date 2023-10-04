import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import type { Publication } from '@tape.xyz/lens'
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
      <div className="bg-brand-100/50 dark:bg-brand-900/30 rounded-full px-4 py-1 backdrop-blur-xl">
        <PublicationReaction
          publication={video}
          textSize="base"
          iconSize="base"
        />
      </div>
      <div className="bg-brand-100/50 dark:bg-brand-900/30 flex items-center rounded-full px-4 py-1 backdrop-blur-xl">
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
      <div className="bg-brand-100/50 dark:bg-brand-900/30 rounded-full px-3 py-1.5 backdrop-blur-xl">
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
