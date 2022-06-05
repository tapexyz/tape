import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import Link from 'next/link'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

import MintVideo from './MintVideo'

type Props = {
  video: LenstubePublication
  isFollower: boolean
}

const AboutChannel: FC<Props> = ({ video, isFollower }) => {
  const channel = video?.profile
  const subscribeType = channel?.followModule?.__typename

  return (
    <div>
      <div className="flex justify-between w-full my-2">
        <div className="flex-none mt-2.5 mr-3">
          <img
            src={imageCdn(getProfilePicture(channel))}
            className="w-10 h-10 rounded-full"
            draggable={false}
            alt=""
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-wrap justify-between py-2 space-y-2">
            <div className="flex flex-col items-start mr-2">
              <Link href={`/${channel?.handle}`}>
                <a className="font-bold">{channel?.handle}</a>
              </Link>
              <span className="inline-flex items-center space-x-1 text-xs">
                {channel?.stats.totalFollowers} subscribers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isFollower ? <MintVideo video={video} /> : null}
              {subscribeType === 'FeeFollowModuleSettings' ? (
                <JoinChannel channel={channel} />
              ) : (
                <>
                  {isFollower ? (
                    <UnSubscribe channel={channel} />
                  ) : (
                    <Subscribe channel={channel} />
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-sm opacity-80">{video.metadata.description}</p>
        </div>
      </div>
    </div>
  )
}

export default AboutChannel
