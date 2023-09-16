import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import { Analytics, TRACK } from '@lenstube/browser'
import { STATIC_ASSETS } from '@lenstube/constants'
import { getValueFromKeyInAttributes, imageCdn } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

const CoverLinks = ({ channel }: { channel: Profile }) => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="absolute bottom-2 right-2">
      <div className="flex space-x-2">
        {getValueFromKeyInAttributes(channel.attributes, 'website') && (
          <Link
            onClick={() =>
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
            }
            href={`https://${getValueFromKeyInAttributes(
              channel.attributes,
              'website'
            )
              ?.replace('https://', '')
              .replace('http://', '')}`}
            target="_blank"
            rel="noreferer noreferrer"
            className="rounded-lg bg-white bg-opacity-80 p-2 dark:bg-gray-900"
          >
            <GlobeOutline className="h-4 w-4" />
          </Link>
        )}
        {getValueFromKeyInAttributes(channel.attributes, 'youtube') && (
          <Link
            onClick={() =>
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
            }
            href={`https://youtube.com/${getValueFromKeyInAttributes(
              channel.attributes,
              'youtube'
            )
              ?.replace('https://youtube.com/', '')
              .replace('http://youtube.com/', '')}`}
            target="_blank"
            rel="noreferer noreferrer"
            className="rounded-lg bg-white bg-opacity-80 p-2 dark:bg-gray-900"
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
        {getValueFromKeyInAttributes(channel.attributes, 'x') && (
          <Link
            onClick={() =>
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
            }
            href={`https://x.com/${getValueFromKeyInAttributes(
              channel.attributes,
              'x'
            )}`}
            target="_blank"
            rel="noreferer noreferrer"
            className="rounded-lg bg-white bg-opacity-80 p-2 dark:bg-gray-900"
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
    </div>
  )
}

export default CoverLinks
