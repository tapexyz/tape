import { STATIC_ASSETS } from '@tape.xyz/constants'
import { getValueFromKeyInAttributes, imageCdn } from '@tape.xyz/generic'
import type { ProfileMetadata } from '@tape.xyz/lens'
import { GlobeOutline, LocationOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import { useTheme } from 'next-themes'
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
          href={`https://${website
            ?.replace('https://', '')
            .replace('http://', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <GlobeOutline className="size-4" />
        </Link>
      )}
      {location && (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${location}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <LocationOutline className="size-4" />
        </Link>
      )}
      {spotify && (
        <Link
          href={`https://open.spotify.com/${spotify
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
            className="size-4 object-contain"
            height={16}
            width={16}
            alt="Spotify"
            draggable={false}
          />
        </Link>
      )}
      {youtube && (
        <Link
          href={`https://youtube.com/${youtube
            ?.replace('https://youtube.com/', '')
            .replace('http://youtube.com/', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          <img
            src={`${STATIC_ASSETS}/images/social/youtube.png`}
            className="size-4 object-contain"
            height={16}
            width={16}
            alt="Youtube"
            draggable={false}
          />
        </Link>
      )}
      {x && (
        <Link
          href={`https://x.com/${x
            ?.replace('https://twitter.com/', '')
            .replace('http://twitter.com/', '')}`}
          target="_blank"
          rel="noreferer noreferrer"
          className="flex items-center justify-center rounded-lg bg-white bg-opacity-80 p-1.5 dark:bg-gray-900"
        >
          {resolvedTheme === 'dark' ? (
            <img
              src={imageCdn(
                `${STATIC_ASSETS}/images/social/x-white.png`,
                'AVATAR'
              )}
              className="size-3.5"
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
              className="size-3.5"
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
