import MirrorVideo from '@components/Common/MirrorVideo'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Button } from '@components/UIElements/Button'
import CollectVideo from '@components/Watch/CollectVideo'
import PublicationReaction from '@components/Watch/PublicationReaction'
import type { FC } from 'react'
import React, { useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import type { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}
const ByteActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)

  return (
    <div className="flex-col items-center justify-between w-12 md:w-14 md:flex">
      <div className="flex justify-center p-2 space-y-4 md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          setShowReport={setShowReport}
          showOnHover={false}
        />
      </div>
      <div className="items-center py-2.5 space-y-1 md:flex md:flex-col">
        <div className="text-white md:text-inherit">
          <PublicationReaction
            publication={video}
            iconSize="2xl"
            textSize="xs"
            isVertical
            showLabel
          />
        </div>
        {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <div className="hidden md:block">
            <CollectVideo video={video} variant="secondary" />
            <div className="text-xs leading-3 text-center">
              {video.stats?.totalAmountOfCollects || 'Collect'}
            </div>
          </div>
        )}
        <div className="text-white text-center md:text-inherit">
          <MirrorVideo video={video}>
            <Button variant="secondary" className="!px-0">
              <AiOutlineRetweet className="text-xl" />
            </Button>
            <div className="text-xs leading-3">
              {video.stats?.totalAmountOfMirrors || 'Mirror'}
            </div>
          </MirrorVideo>
        </div>
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
