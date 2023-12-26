import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import Tooltip from '@components/UIElements/Tooltip'
import { IconButton } from '@radix-ui/themes'
import { useCopyToClipboard } from '@tape.xyz/browser'
import { STATIC_ASSETS, TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { EVENTS, getSharableLink, imageCdn, Tower } from '@tape.xyz/generic'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

import EmbedMedia from '../EmbedMedia'
import CopyOutline from '../Icons/CopyOutline'
import MirrorOutline from '../Icons/MirrorOutline'
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
        <EmbedMedia isAudio={isAudio} publicationId={publication.id} />
        <MirrorPublication video={publication}>
          <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
            <MirrorOutline className="size-5" />
          </div>
        </MirrorPublication>
        <Link
          className="rounded-full"
          href={getSharableLink('hey', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.HEY)}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt="hey"
            className="size-10 max-w-none"
            draggable={false}
            loading="eager"
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/hey-logo.svg`,
              'AVATAR_LG'
            )}
          />
        </Link>
        <span className="middot" />
        <Link
          className="rounded-full"
          href={getSharableLink('x', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.X)}
          rel="noreferrer"
          target="_blank"
        >
          <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-800">
            {resolvedTheme === 'dark' ? (
              <img
                alt="X Logo"
                className="size-4"
                draggable={false}
                height={16}
                src={imageCdn(
                  `${STATIC_ASSETS}/images/social/x-white.png`,
                  'AVATAR'
                )}
                width={16}
              />
            ) : (
              <img
                alt="X Logo"
                className="size-4"
                draggable={false}
                height={16}
                src={imageCdn(
                  `${STATIC_ASSETS}/images/social/x-black.png`,
                  'AVATAR'
                )}
                width={16}
              />
            )}
          </div>
        </Link>
        <Link
          href={getSharableLink('reddit', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.REDDIT)}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt="reddit"
            className="size-10 max-w-none rounded-full"
            draggable={false}
            loading="eager"
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/reddit-logo.webp`,
              'AVATAR_LG'
            )}
          />
        </Link>
        <Link
          href={getSharableLink('linkedin', publication)}
          onClick={() => Tower.track(EVENTS.PUBLICATION.SHARE.LINKEDIN)}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt="linkedin"
            className="size-10 max-w-none rounded-full"
            draggable={false}
            loading="eager"
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/linkedin-logo.png`,
              'AVATAR_LG'
            )}
          />
        </Link>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800">
        <div className="select-all truncate text-sm">{url}</div>
        <Tooltip content="Copy" placement="top">
          <IconButton
            className="ml-2 hover:opacity-60 focus:outline-none"
            onClick={() => onCopyVideoUrl()}
            size="1"
            variant="soft"
          >
            <CopyOutline className="size-4" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default Share
