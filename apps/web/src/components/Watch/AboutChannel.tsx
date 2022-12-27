import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import MirrorVideo from '@components/Common/MirrorVideo'
import SubscribeActions from '@components/Common/SubscribeActions'
import { Button } from '@components/UIElements/Button'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubePublication } from 'utils'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

import CollectVideo from './CollectVideo'
import MetaInfo from './MetaInfo'

type Props = {
  video: LenstubePublication
}

const AboutChannel: FC<Props> = ({ video }) => {
  const channel = video?.profile
  const subscribeType = channel?.followModule?.__typename
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (video.metadata?.description?.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [video.metadata?.description])

  return (
    <div className="flex items-start justify-between w-full">
      <Link href={`/channel/${channel?.handle}`}>
        <div className="flex-none mr-3 cursor-pointer">
          <img
            src={getProfilePicture(channel, 'avatar')}
            className="w-10 h-10 rounded-full"
            draggable={false}
            alt={channel?.handle}
          />
        </div>
      </Link>
      <div className="flex flex-col flex-1 overflow-hidden break-words">
        <div className="flex flex-wrap justify-between gap-y-2">
          <div className="flex flex-col items-start mr-2">
            <Link
              href={`/channel/${channel?.handle}`}
              className="flex items-center space-x-1 font-semibold"
            >
              <span>{channel?.handle}</span>
              <IsVerified id={channel?.id} />
            </Link>
            <span className="inline-flex items-center space-x-1 text-xs">
              {formatNumber(channel?.stats.totalFollowers)} subscribers
            </span>
          </div>
          <div className="flex items-center lg:space-x-4 space-x-2">
            <div className="md:block hidden">
              <MirrorVideo video={video}>
                <div>
                  <Button size="md" variant="material" className="!px-2">
                    <MirrorOutline className="w-5 h-5" />
                  </Button>
                </div>
              </MirrorVideo>
            </div>
            {video?.collectModule?.__typename !==
              'RevertCollectModuleSettings' && (
              <CollectVideo variant="material" video={video} />
            )}
            <SubscribeActions channel={channel} subscribeType={subscribeType} />
          </div>
        </div>
        {video?.metadata?.description && (
          <p
            className={clsx(
              'mt-4 text-sm opacity-80',
              clamped ? 'line-clamp-3' : ''
            )}
          >
            <InterweaveContent content={video.metadata.description} />
          </p>
        )}
        {showMore && (
          <div className="inline-flex mt-3">
            <button
              type="button"
              onClick={() => setClamped(!clamped)}
              className="flex items-center text-sm outline-none text-indigo-500 hover:opacity-100 opacity-80"
            >
              {clamped ? (
                <>
                  Show more <ChevronDownOutline className="h-3 ml-1 w-3" />
                </>
              ) : (
                <>
                  Show less <ChevronUpOutline className="h-3 w-3 ml-1" />
                </>
              )}
            </button>
          </div>
        )}
        <div className="flex justify-end mt-5">
          <MetaInfo video={video} />
        </div>
      </div>
    </div>
  )
}

export default AboutChannel
