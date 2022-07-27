import SubscribeActions from '@components/Common/SubscribeActions'
import MintVideo from '@components/Watch/MintVideo'
import getProfilePicture from '@utils/functions/getProfilePicture'
import Link from 'next/link'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}

const BottomOverlay: FC<Props> = ({ video }) => {
  const subscribeType = video.profile?.followModule?.__typename
  const channel = video.profile
  return (
    <div className="absolute bottom-0 left-0 right-0 px-3 pt-5 pb-3">
      <div className="pb-2">
        <h1 className="text-white line-clamp-2">{video.metadata.name}</h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/${channel?.handle}`}>
            <a className="flex items-center flex-none space-x-2 cursor-pointer">
              <img
                src={getProfilePicture(channel, 'avatar')}
                className="w-9 h-9 rounded-xl"
                draggable={false}
                alt="channel picture"
              />
              <div className="flex flex-col items-start text-white">
                <h6>{channel?.handle}</h6>
                <span className="inline-flex items-center space-x-1 text-xs">
                  {channel?.stats.totalFollowers} subscribers
                </span>
              </div>
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="md:hidden">
              <MintVideo video={video} />
            </div>
          )}
          <SubscribeActions
            channel={video.profile}
            subscribeType={subscribeType}
          />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
