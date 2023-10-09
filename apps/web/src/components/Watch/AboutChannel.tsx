import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import MirrorVideo from '@components/Common/MirrorVideo'
import { Trans } from '@lingui/macro'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@tape.xyz/generic'
import type { MirrorablePublication, VideoMetadataV3 } from '@tape.xyz/lens'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import CollectPublication from './CollectPublication'
import MetaInfo from './MetaInfo'

type Props = {
  video: MirrorablePublication
}

const AboutChannel: FC<Props> = ({ video }) => {
  const channel = video?.by
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const metadata = video.metadata as VideoMetadataV3

  useEffect(() => {
    if (metadata.marketplace?.description?.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [metadata.marketplace?.description])

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
              <HoverableProfile profile={channel}>
                <Link
                  href={`/channel/${trimLensHandle(channel?.handle)}`}
                  className="flex items-center space-x-1 font-semibold"
                >
                  <span className="leading-snug">
                    {trimLensHandle(channel?.handle)}
                  </span>
                  <Badge id={channel?.id} />
                </Link>
              </HoverableProfile>
              <span className="inline-flex items-center space-x-1 text-xs">
                {formatNumber(channel?.stats.followers)}{' '}
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
            <CollectPublication video={video} text="Collect" />
          </div>
        </div>
        {metadata.marketplace?.description || metadata.content ? (
          <p className={clsx('mt-4', { 'line-clamp-3': clamped })}>
            <InterweaveContent
              content={metadata.marketplace?.description || metadata.content}
            />
          </p>
        ) : null}
        {showMore && (
          <div className="mt-3 inline-flex">
            <button
              type="button"
              onClick={() => setClamped(!clamped)}
              className="text-brand-800 dark:text-brand-200 flex items-center text-sm opacity-80 outline-none hover:opacity-100"
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
