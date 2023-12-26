import type { ProfileMetadata } from '@tape.xyz/lens'

import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import { getValueFromKeyInAttributes, imageCdn } from '@tape.xyz/generic'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

const CoverLinks = ({ metadata }: { metadata: ProfileMetadata }) => {
  const { resolvedTheme } = useTheme()
  const location = getValueFromKeyInAttributes(metadata?.attributes, 'location')
  const website = getValueFromKeyInAttributes(metadata?.attributes, 'website')
  const youtube = getValueFromKeyInAttributes(metadata?.attributes, 'youtube')
  const spotify = getValueFromKeyInAttributes(metadata?.attributes, 'spotify')
  const x = getValueFromKeyInAttributes(metadata?.attributes, 'x')

  return (
    <div className="flex space-x-2">
      {website && (
        <Link
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
          href={`https://${website
            ?.replace('https://', '')
            .replace('http://', '')}`}
          rel="noreferer noreferrer"
          target="_blank"
        >
          <GlobeOutline className="size-4" />
        </Link>
      )}
      {location && (
        <Link
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
          href={`https://www.google.com/maps/search/?api=1&query=${location}`}
          rel="noreferer noreferrer"
          target="_blank"
        >
          <LocationOutline className="size-4" />
        </Link>
      )}
      {spotify && (
        <Link
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
          href={`https://open.spotify.com/${spotify
            ?.replace('https://open.spotify.com/', '')
            .replace('http://open.spotify.com/', '')}`}
          rel="noreferer noreferrer"
          target="_blank"
        >
          <img
            alt="Spotify"
            className="size-4 object-contain"
            draggable={false}
            height={16}
            src={imageCdn(
              `${STATIC_ASSETS}/images/social/spotify.png`,
              'AVATAR'
            )}
            width={16}
          />
        </Link>
      )}
      {youtube && (
        <Link
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
          href={`https://youtube.com/${youtube
            ?.replace('https://youtube.com/', '')
            .replace('http://youtube.com/', '')}`}
          rel="noreferer noreferrer"
          target="_blank"
        >
          <img
            alt="Youtube"
            className="size-4 object-contain"
            draggable={false}
            height={16}
            src={`${STATIC_ASSETS}/images/social/youtube.png`}
            width={16}
          />
        </Link>
      )}
      {x && (
        <Link
          className="flex items-center justify-center rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
          href={`https://x.com/${x
            ?.replace('https://twitter.com/', '')
            .replace('http://twitter.com/', '')}`}
          rel="noreferer noreferrer"
          target="_blank"
        >
          {resolvedTheme === 'dark' ? (
            <img
              alt="X Logo"
              className="size-3.5"
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
              className="size-3.5"
              draggable={false}
              height={16}
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/x-black.png`,
                'AVATAR'
              )}
              width={16}
            />
          )}
        </Link>
      )}
    </div>
  )
}

export default CoverLinks
