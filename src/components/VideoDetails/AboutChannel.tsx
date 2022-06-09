import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import { MentionMatcher } from '@components/Common/MentionMatcher'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import clsx from 'clsx'
import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

import MintVideo from './MintVideo'

type Props = {
  video: LenstubePublication
  isFollower: boolean
}

const AboutChannel: FC<Props> = ({ video, isFollower }) => {
  const channel = video?.profile
  const subscribeType = channel?.followModule?.__typename
  const [clamped, setClamped] = useState(false)

  useEffect(() => {
    if (video.metadata.description.trim().length > 400) setClamped(true)
  }, [video.metadata.description])

  const readMore = () => {
    setClamped(false)
  }

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
              {isFollower ? (
                <UnSubscribe channel={channel} />
              ) : subscribeType === 'FeeFollowModuleSettings' ? (
                <JoinChannel channel={channel} />
              ) : (
                <Subscribe channel={channel} />
              )}
            </div>
          </div>
          <p
            className={clsx('interweave-content mt-2 text-sm opacity-80', {
              'line-clamp-3': clamped,
              '': !clamped
            })}
          >
            <Interweave
              content={video.metadata.description}
              newWindow
              matchers={[
                new MentionMatcher('mention'),
                new UrlMatcher('url', { validateTLD: false })
              ]}
            />
          </p>
          {clamped && (
            <button
              onClick={() => readMore()}
              className="flex items-center mt-2 text-xs outline-none hover:opacity-100 opacity-60"
            >
              Read more <BiChevronDown className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AboutChannel
