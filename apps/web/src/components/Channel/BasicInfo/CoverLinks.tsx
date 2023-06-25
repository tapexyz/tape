import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import { Analytics, TRACK } from '@lenstube/browser'
import { STATIC_ASSETS } from '@lenstube/constants'
import { getValueFromKeyInAttributes } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import Link from 'next/link'
import React from 'react'

const CoverLinks = ({ channel }: { channel: Profile }) => {
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
        {getValueFromKeyInAttributes(channel.attributes, 'twitter') && (
          <Link
            onClick={() =>
              Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_COVER_LINKS)
            }
            href={`https://twitter.com/${getValueFromKeyInAttributes(
              channel.attributes,
              'twitter'
            )}`}
            target="_blank"
            rel="noreferer noreferrer"
            className="rounded-lg bg-white bg-opacity-80 p-2 dark:bg-gray-900"
          >
            <img
              src={`${STATIC_ASSETS}/images/social/twitter.svg`}
              alt="twitter"
              className="h-4 w-4"
              draggable={false}
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default CoverLinks
