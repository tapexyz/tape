import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import { Analytics, TRACK } from '@lenstube/browser'
import { STATIC_ASSETS } from '@lenstube/constants'
import { getValueFromKeyInAttributes, imageCdn } from '@lenstube/generic'
import type { ProfileMetadata } from '@lenstube/lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

const CoverLinks = ({ metadata }: { metadata: ProfileMetadata }) => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex space-x-2">
      {getValueFromKeyInAttributes(metadata?.attributes, 'website') && (
        <Link
          onClick={() =>
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
          }
          href={`https://${getValueFromKeyInAttributes(
            metadata?.attributes,
            'website'
          )
            ?.replace('https://', '')
            .replace('http://', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <GlobeOutline className="h-4 w-4" />
        </Link>
      )}
      {getValueFromKeyInAttributes(metadata?.attributes, 'spotify') && (
        <Link
          onClick={() =>
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
          }
          href={`https://open.spotify.com/${getValueFromKeyInAttributes(
            metadata?.attributes,
            'spotify'
          )
            ?.replace('https://open.spotify.com/', '')
            .replace('http://open.spotify.com/', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/spotify.png`,
              'AVATAR'
            )}
            className="h-4 w-4 object-contain"
            height={16}
            width={16}
            alt="Spotify"
            draggable={false}
          />
        </Link>
      )}
      {getValueFromKeyInAttributes(metadata?.attributes, 'youtube') && (
        <Link
          onClick={() =>
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
          }
          href={`https://youtube.com/${getValueFromKeyInAttributes(
            metadata?.attributes,
            'youtube'
          )
            ?.replace('https://youtube.com/', '')
            .replace('http://youtube.com/', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <img
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/youtube.png`,
              'AVATAR'
            )}
            className="h-4 w-4 object-contain"
            height={16}
            width={16}
            alt="Youtube"
            draggable={false}
          />
        </Link>
      )}
      {getValueFromKeyInAttributes(metadata?.attributes, 'x') && (
        <Link
          onClick={() =>
            Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
          }
          href={`https://x.com/${getValueFromKeyInAttributes(
            metadata?.attributes,
            'x'
          )}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          {resolvedTheme === 'dark' ? (
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/x-white.png`,
                'AVATAR'
              )}
              className="h-4 w-4"
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
              className="h-4 w-4"
              height={16}
              width={16}
              alt="X Logo"
              draggable={false}
            />
          )}
        </Link>
      )}
    </div>
  )
}

export default CoverLinks
