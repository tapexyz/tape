import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import MintVideo from '@components/Watch/MintVideo'
import PublicationReaction from '@components/Watch/PublicationReaction'
import React, { FC, useState } from 'react'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}
const ByteActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className="flex-col items-center justify-between w-12 md:flex">
      <div className="flex justify-center p-2 space-y-4 md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          showOnHover={false}
        />
      </div>
      <div className="items-center py-3 space-y-1 md:flex md:flex-col">
        <PublicationReaction
          publication={video}
          iconSize="2xl"
          iconType="filled"
          textSize="xs"
          isVertical
          showLabel
        />
        {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <div className="hidden md:block">
            <MintVideo video={video} variant="secondary" />
            <div className="text-xs text-center">
              {video.stats?.totalAmountOfCollects || 'Mint'}
            </div>
          </div>
        )}
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
    </div>
  )
}

export default ByteActions
