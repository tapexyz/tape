import { useCopyToClipboard } from '@tape.xyz/browser'
import { STATIC_ASSETS, TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { EVENTS, getSharableLink, imageCdn, Tower } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import { CopyOutline, MirrorOutline, Tooltip } from '@tape.xyz/ui'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import type { FC } from 'react'
import React from 'react'

import EmbedMedia from '../EmbedMedia'
import MirrorPublication from '../MirrorPublication'

type Props = {
  publication: PrimaryPublication
}

const Share: FC<Props> = ({ publication }) => {
  const [copy] = useCopyToClipboard()
  const { resolvedTheme } = useTheme()
  const isAudio = publication.metadata?.__typename === 'AudioMetadataV3'
  const url = `${TAPE_WEBSITE_URL}/${isAudio ? 'listen' : 'watch'}/${
    publication.id
  }`

  const onCopyVideoUrl = async () => {
    await copy(url)
    Tower.track(EVENTS.PUBLICATION.PERMALINK)
  }

  return (
    <div>
      <div className="no-scrollbar mb-4 flex flex-nowrap items-center space-x-3 overflow-x-auto">
        <EmbedMedia publicationId={publication.id} isAudio={isAudio} />
        <MirrorPublication video={publication}>
          <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
            <MirrorOutline className="size-5" />
          </div>
        </MirrorPublication>
        <Link
          className="rounded-full"
          target="_blank"
          rel="noreferrer"
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.HEY)}
          href={getSharableLink('hey', publication)}
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/hey-logo.svg`,
              'AVATAR_LG'
            )}
            className="size-10 max-w-none"
            loading="eager"
            alt="hey"
            draggable={false}
          />
        </Link>
        <span className="middot" />
        <Link
          className="rounded-full"
          target="_blank"
          rel="noreferrer"
          href={getSharableLink('x', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.X)}
        >
          <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
            {resolvedTheme === 'dark' ? (
              <img
                src={imageCdn(
                  `${STATIC_ASSETS}/images/social/x-white.png`,
                  'AVATAR'
                )}
                className="size-4"
                height={16}
                width={16}
                alt="X Logo"
                draggable={false}
              />
            ) : (
              <img
                src={imageCdn(
                  `${STATIC_ASSETS}/images/social/x-black.png`,
                  'AVATAR'
                )}
                className="size-4"
                height={16}
                width={16}
                alt="X Logo"
                draggable={false}
              />
            )}
          </div>
        </Link>
        <Link
          href={getSharableLink('reddit', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.REDDIT)}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
              'AVATAR_LG'
            )}
            className="size-10 max-w-none rounded-full"
            loading="eager"
            alt="reddit"
            draggable={false}
          />
        </Link>
        <Link
          href={getSharableLink('linkedin', publication)}
          target="_blank"
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.LINKEDIN)}
          rel="noreferrer"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
              'AVATAR_LG'
            )}
            loading="eager"
            alt="linkedin"
            className="size-10 max-w-none rounded-full"
            draggable={false}
          />
        </Link>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800">
        <div className="select-all truncate text-sm">{url}</div>
        <Tooltip content="Copy" placement="top">
          <button
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
          >
            <CopyOutline className="size-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default Share
