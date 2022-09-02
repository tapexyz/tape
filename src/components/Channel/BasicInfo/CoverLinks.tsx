import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import Link from 'next/link'
import React from 'react'
import { HiOutlineGlobe } from 'react-icons/hi'
import { RiTwitterLine } from 'react-icons/ri'
import { Profile } from 'src/types'

const CoverLinks = ({ channel }: { channel: Profile }) => {
  return (
    <div className="absolute bottom-2 right-2">
      <div className="flex space-x-2">
        {getValueFromKeyInAttributes(channel.attributes, 'website') && (
          <Link
            href={
              getValueFromKeyInAttributes(
                channel.attributes,
                'website'
              ) as string
            }
            target="_blank"
            rel="noreferer noreferrer"
            className="p-2 bg-white rounded-lg dark:bg-gray-900 bg-opacity-80"
          >
            <HiOutlineGlobe />
          </Link>
        )}
        {getValueFromKeyInAttributes(channel.attributes, 'twitter') && (
          <Link
            href={`https://twitter.com/${
              getValueFromKeyInAttributes(
                channel.attributes,
                'twitter'
              ) as string
            }`}
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
