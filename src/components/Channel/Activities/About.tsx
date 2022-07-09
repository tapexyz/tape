import Tooltip from '@components/UIElements/Tooltip'
import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from '@utils/constants'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import { shortenAddress } from '@utils/functions/shortenAddress'
import React, { FC } from 'react'
import { AiOutlineNumber } from 'react-icons/ai'
import { HiOutlineGlobe, HiOutlineLocationMarker } from 'react-icons/hi'
import { RiShieldKeyholeLine, RiTwitterLine } from 'react-icons/ri'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes
  if (!attributes?.length) return null

  return (
    <div className="space-y-4 md:pr-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-80">
            Description
          </h6>
          <p>{channel?.bio}</p>
        </div>
      )}
      <div className="flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-80">Links</h6>
        <div className="space-y-1.5">
          {getValueFromKeyInAttributes(attributes, 'website') && (
            <div className="flex items-center space-x-1">
              <HiOutlineGlobe />
              <a
                href={getValueFromKeyInAttributes(attributes, 'website')}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Website
              </a>
            </div>
          )}
          {getValueFromKeyInAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1">
              <RiTwitterLine />
              <a
                href={`https://twitter.com/${getValueFromKeyInAttributes(
                  attributes,
                  'twitter'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <span className="pr-0.5 grayscale" role="img">
              <img
                src={`${STATIC_ASSETS}/images/lenster-logo.svg`}
                alt=""
                className="w-3.5 h-3.5"
                draggable={false}
              />
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
      <div className="inline-flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-80">Others</h6>
        {getValueFromKeyInAttributes(attributes, 'location') && (
          <div className="flex items-center space-x-1">
            <HiOutlineLocationMarker />
            <span>{getValueFromKeyInAttributes(attributes, 'location')}</span>
          </div>
        )}
        <Tooltip content={parseInt(channel.id)} placement="right">
          <span className="inline-flex items-center space-x-1">
            <AiOutlineNumber />
            <span>{channel.id}</span>
          </span>
        </Tooltip>
        <Tooltip content="Owner address" placement="right">
          <span className="inline-flex items-center space-x-1">
            <RiShieldKeyholeLine />
            <span>{shortenAddress(channel.ownedBy)}</span>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

export default About
