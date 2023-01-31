import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import CollectVideo from '@components/Watch/CollectVideo'
import PublicationReaction from '@components/Watch/PublicationReaction'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  video: Publication
}
const ByteActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)

  return (
    <div className="w-12 flex-col items-center justify-between md:flex md:w-14">
      <div className="flex justify-center space-y-4 p-2 md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          setShowReport={setShowReport}
          showOnHover={false}
        />
      </div>
      <div className="items-center space-y-1.5 pt-2.5 md:flex md:flex-col">
        <div className="text-white md:text-inherit">
          <PublicationReaction
            publication={video}
            iconSize="lg"
            isVertical
            showLabel
          />
        </div>
        <div className="text-center text-white md:text-inherit">
          <MirrorVideo video={video}>
            <div className="p-2">
              <MirrorOutline className="h-6 w-6" />
            </div>
            <div className="text-xs leading-3">
              {video.stats?.totalAmountOfMirrors || 'Mirror'}
            </div>
          </MirrorVideo>
        </div>
        {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <div className="hidden md:block">
            <CollectVideo video={video} />
            <div className="text-center text-xs leading-3">
              {video.stats?.totalAmountOfCollects || 'Collect'}
            </div>
          </div>
        )}
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        video={video}
        show={showReport}
        setShowReport={setShowReport}
      />
    </div>
  )
}

export default ByteActions
