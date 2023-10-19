import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import { Trans } from '@lingui/macro'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { MirrorablePublication, VideoMetadataV3 } from '@tape.xyz/lens'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import MetaInfo from './MetaInfo'

type Props = {
  video: MirrorablePublication
}

const AboutChannel: FC<Props> = ({ video }) => {
  const profile = video?.by
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
      <Link href={`/u/${getProfile(profile)?.slug}`}>
        <div className="mr-3 flex-none cursor-pointer">
          <img
            src={getProfilePicture(profile, 'AVATAR')}
            className="h-10 w-10 rounded-full"
            draggable={false}
            alt={getProfile(profile)?.displayName}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col overflow-hidden break-words">
        <div className="flex flex-wrap justify-between gap-y-2">
          <div className="flex flex-col items-start">
            <HoverableProfile profile={profile}>
              <Link
                href={`/u/${getProfile(profile)?.slug}`}
                className="flex items-center space-x-1 font-bold"
              >
                <span className="leading-snug">
                  {getProfile(profile)?.slug}
                </span>
                <Badge id={profile?.id} />
              </Link>
            </HoverableProfile>
            <span className="inline-flex items-center space-x-1 text-xs">
              {formatNumber(profile?.stats.followers)}{' '}
              <Trans>subscribers</Trans>
            </span>
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
