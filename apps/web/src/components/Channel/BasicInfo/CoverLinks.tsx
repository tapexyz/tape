import { Analytics, TRACK } from '@utils/analytics'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import Link from 'next/link'
import React from 'react'
import { HiOutlineGlobe } from 'react-icons/hi'
import { RiTwitterLine } from 'react-icons/ri'
import type { Profile } from 'src/types/lens'

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
            className="p-2 bg-white rounded-lg dark:bg-gray-900 bg-opacity-80"
          >
            <HiOutlineGlobe />
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
            className="p-2 bg-white rounded-lg dark:bg-gray-900 bg-opacity-80"
          >
            <RiTwitterLine />
          </Link>
        )}
      </div>
    </div>
  )
}

export default CoverLinks
