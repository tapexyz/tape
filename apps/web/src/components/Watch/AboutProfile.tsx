import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import { getDateString, getRelativeTime } from '@lib/formatTime'
import { getCategoryName, getPublicationData } from '@tape.xyz/generic'
import type { MirrorablePublication, VideoMetadataV3 } from '@tape.xyz/lens'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  video: MirrorablePublication
}

const AboutProfile: FC<Props> = ({ video }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const metadata = video.metadata as VideoMetadataV3

  useEffect(() => {
    if (metadata?.content?.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [metadata?.content])

  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-1 flex-col overflow-hidden break-words">
        {getPublicationData(metadata)?.content ? (
          <p className={clsx({ 'line-clamp-3': clamped })}>
            <InterweaveContent
              content={getPublicationData(metadata)?.content || ''}
            />
          </p>
        ) : null}
        {showMore && (
          <div className="mt-3 inline-flex">
            <button
              type="button"
              onClick={() => setClamped(!clamped)}
              className="flex items-center text-sm opacity-80 outline-none hover:opacity-100"
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
        <div className="mt-3 flex items-center justify-end">
          {video?.metadata?.tags && (
            <>
              <Link
                href={`/explore/${video.metadata.tags[0]}`}
                className="flex items-center space-x-1"
              >
                <TagOutline className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {getCategoryName(video.metadata.tags[0])}
                </span>
              </Link>
              <span className="middot px-1" />
            </>
          )}
          <span title={getDateString(video.createdAt)}>
            Uploaded {getRelativeTime(video.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AboutProfile
