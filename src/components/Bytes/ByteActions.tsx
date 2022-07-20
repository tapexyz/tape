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
    <div className="flex flex-col justify-between w-12">
      <div className="items-center hidden py-2 space-y-4 md:flex md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          showOnHover={false}
        />
      </div>
      <div className="items-center hidden py-3 space-y-2 md:flex md:flex-col">
        <PublicationReaction
          publication={video}
          iconSize="2xl"
          textSize="xs"
          isVertical={true}
          showLabel={true}
        />
        {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <div className="hidden md:block">
            <MintVideo video={video} variant="secondary" />
          </div>
        )}
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
    </div>
  )
}

export default ByteActions
