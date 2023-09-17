import Badge from '@components/Common/Badge'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import MirrorVideo from '@components/Common/MirrorVideo'
import UserPreview from '@components/Common/UserPreview'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import CollectVideo from './CollectVideo'
import MetaInfo from './MetaInfo'

type Props = {
  video: Publication
}

const AboutChannel: FC<Props> = ({ video }) => {
  const channel = video?.profile
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
      <Link href={`/channel/${trimLensHandle(channel?.handle)}`}>
        <div className="mr-3 flex-none cursor-pointer">
          <img
            src={getProfilePicture(channel, 'AVATAR')}
            className="h-10 w-10 rounded-full"
            draggable={false}
            alt={channel?.handle}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col overflow-hidden break-words">
        <div className="flex flex-wrap justify-between gap-y-2">
          <div className="flex items-center space-x-5">
            <div className="flex flex-col items-start">
              <UserPreview profile={channel}>
                <Link
                  href={`/channel/${trimLensHandle(channel?.handle)}`}
                  className="flex items-center space-x-1 font-semibold"
                >
                  <span className="leading-snug">
                    {trimLensHandle(channel?.handle)}
                  </span>
                  <Badge id={channel?.id} />
                </Link>
              </UserPreview>
              <span className="inline-flex items-center space-x-1 text-xs">
                {formatNumber(channel?.stats.totalFollowers)}{' '}
                <Trans>subscribers</Trans>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <MirrorVideo video={video}>
                <div className="group">
                  <motion.button
                    initial={{ width: 45 }}
                    whileHover={{
                      width: 105,
                      transition: { duration: 0.2, ease: 'linear' }
                    }}
                    type="button"
                    className="btn-hover flex items-center space-x-2 overflow-hidden px-4 py-1.5"
                  >
                    <MirrorOutline className="h-5 w-5 flex-none" />
                    <span className="invisible group-hover:visible">
                      Mirror
                    </span>
                  </motion.button>
                </div>
              </MirrorVideo>
            </div>
            {video?.collectModule?.__typename !==
              'RevertCollectModuleSettings' && (
              <CollectVideo video={video} text="Collect" />
            )}
          </div>
        </div>
        {video.metadata.description || video.metadata.content ? (
          <p className={clsx('mt-4', { 'line-clamp-3': clamped })}>
            <InterweaveContent
              content={video.metadata.description || video.metadata.content}
            />
          </p>
        ) : null}
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
