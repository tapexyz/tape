import { LENSTER_WEBSITE_URL } from '@utils/constants'
import { getKeyFromAttributes } from '@utils/functions/getKeyFromAttributes'
import React, { FC } from 'react'
import { HiOutlineGlobe } from 'react-icons/hi'
import { RiTwitterLine } from 'react-icons/ri'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes
  if (!attributes?.length) return null

  return (
    <div className="p-4 space-y-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col">
          <h6 className="text-[11px] font-semibold uppercase opacity-60">
            Description
          </h6>
          <p>{channel?.bio}</p>
        </div>
      )}
      <div className="flex flex-col">
        <h6 className="text-[11px] mb-2 font-semibold uppercase opacity-60">
          Links
        </h6>
        <div className="space-y-1.5">
          {getKeyFromAttributes(attributes, 'website') && (
            <div className="flex items-center space-x-1 text-sm">
              <HiOutlineGlobe />
              <a
                href={getKeyFromAttributes(attributes, 'website')}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Website
              </a>
            </div>
          )}
          {getKeyFromAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1 text-sm">
              <RiTwitterLine />
              <a
                href={getKeyFromAttributes(attributes, 'website')}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm">
            <span className="text-[10px] grayscale" role="img">
              🌸
            </span>
            <a
              href={`${LENSTER_WEBSITE_URL}/u/${channel?.handle}`}
              target="_blank"
              rel="noreferer noreferrer"
              className="hover:text-indigo-500"
            >
              Lenster
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
