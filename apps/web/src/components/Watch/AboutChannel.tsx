import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import MirrorVideo from '@components/Common/MirrorVideo'
import SubscribeActions from '@components/Common/SubscribeActions'
import clsx from 'clsx'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import formatNumber from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

import CollectVideo from './CollectVideo'
import MetaInfo from './MetaInfo'

type Props = {
  video: Publication
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
    <div className="flex w-full items-start justify-between">
      <Link href={`/channel/${channel?.handle}`}>
        <div className="mr-3 flex-none cursor-pointer">
          <img
            src={getProfilePicture(channel, 'avatar')}
            className="h-10 w-10 rounded-full"
            draggable={false}
            alt={channel?.handle}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col overflow-hidden break-words">
        <div className="flex flex-wrap justify-between gap-y-2">
          <div className="mr-2 flex flex-col items-start">
            <Link
              href={`/channel/${channel?.handle}`}
              className="flex items-center space-x-1 font-semibold"
            >
              <span>{channel?.handle}</span>
              <IsVerified id={channel?.id} />
            </Link>
            <span className="inline-flex items-center space-x-1 text-sm opacity-90">
              {formatNumber(channel?.stats.totalFollowers)} subscribers
            </span>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden md:block">
              <MirrorVideo video={video}>
                <div>
                  <button className="btn-hover p-2.5">
                    <MirrorOutline className="h-5 w-5" />
                  </button>
                </div>
              </MirrorVideo>
            </div>
            {video?.collectModule?.__typename !==
              'RevertCollectModuleSettings' && (
              <CollectVideo variant="hover" video={video} />
            )}
            <SubscribeActions channel={channel} subscribeType={subscribeType} />
          </div>
        </div>
        {video?.metadata?.description && (
          <p className={clsx('mt-4', { 'line-clamp-3': clamped })}>
            <InterweaveContent content={video.metadata.description} />
          </p>
        )}
        {showMore && (
          <div className="mt-3 inline-flex">
            <button
              type="button"
              onClick={() => setClamped(!clamped)}
              className="flex items-center text-sm text-indigo-800 opacity-80 outline-none hover:opacity-100 dark:text-indigo-200"
            >
              {clamped ? (
                <>
                  Show more <ChevronDownOutline className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  Show less <ChevronUpOutline className="ml-1 h-3 w-3" />
                </>
              )}
            </button>
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <MetaInfo video={video} />
        </div>
      </div>
    </div>
  )
}

export default AboutChannel
