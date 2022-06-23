import InterweaveContent from '@components/Common/InterweaveContent'
import SubscribeActions from '@components/Common/SubscribeActions'
import getProfilePicture from '@utils/functions/getProfilePicture'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

const MintVideo = dynamic(() => import('./MintVideo'))

type Props = {
  video: LenstubePublication
}

const AboutChannel: FC<Props> = ({ video }) => {
  const channel = video?.profile
  const subscribeType = channel?.followModule?.__typename
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (video.metadata.description.trim().length > 400) {
      setClamped(true)
      setShowMore(true)
    }
  }, [video.metadata.description])

  return (
    <div>
      <div className="flex justify-between w-full my-2">
        <Link href={`/${channel?.handle}`} passHref>
          <div className="flex-none mt-2.5 mr-3 cursor-pointer">
            <img
              src={getProfilePicture(channel)}
              className="w-10 h-10 rounded-xl"
              draggable={false}
              alt=""
            />
          </div>
        </Link>
        <div className="flex flex-col flex-1">
          <div className="flex flex-wrap justify-between py-2 gap-y-2">
            <div className="flex flex-col items-start mr-2">
              <Link href={`/${channel?.handle}`}>
                <a className="font-semibold">{channel?.handle}</a>
              </Link>
              <span className="inline-flex items-center space-x-1 text-xs">
                {channel?.stats.totalFollowers} subscribers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MintVideo video={video} />
              <SubscribeActions
                channel={channel}
                subscribeType={subscribeType}
              />
            </div>
          </div>
          <p
            className={clsx('mt-2 text-sm opacity-80', {
              'line-clamp-3': clamped,
              '': !clamped
            })}
          >
            <InterweaveContent content={video.metadata.description} />
          </p>

          {showMore && (
            <button
              onClick={() => setClamped(!clamped)}
              className="flex items-center mt-2 text-xs outline-none hover:opacity-100 opacity-60"
            >
              {clamped ? (
                <>
                  Show more <BiChevronDown className="text-sm" />
                </>
              ) : (
                <>
                  Show less <BiChevronUp className="text-sm" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AboutChannel
