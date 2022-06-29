import ShareModal from '@components/Common/VideoCard/ShareModal'
import { Button } from '@components/UIElements/Button'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { FiFlag } from 'react-icons/fi'
import { RiShareForwardLine } from 'react-icons/ri'
import { TbHeartHandshake } from 'react-icons/tb'
import { LenstubePublication } from 'src/types/local'

import TipModal from './TipModal'

const VideoReaction = dynamic(() => import('./VideoReaction'))

type Props = {
  video: LenstubePublication
}

const VideoActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="flex items-center justify-end mt-4 space-x-2.5 md:space-x-4 md:mt-0">
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <TipModal show={showTip} setShowTip={setShowTip} video={video} />

      <VideoReaction video={video} />
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => setShowTip(true)}
      >
        <span className="flex items-center space-x-1">
          <TbHeartHandshake />
          <span>Tip</span>
        </span>
      </Button>
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => setShowShare(true)}
      >
        <span className="flex items-center space-x-1">
          <RiShareForwardLine />
          <span>Share</span>
        </span>
      </Button>
      <Link href={`/report/${video.id}`} passHref>
        <Button variant="secondary" className="!p-0">
          <span className="flex items-center space-x-1">
            <FiFlag className="text-xs" />
            <span>Report</span>
          </span>
        </Button>
      </Link>
    </div>
  )
}

export default VideoActions
