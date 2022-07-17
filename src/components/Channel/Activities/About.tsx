import { ENS_NAME_ABI } from '@abis/ENS'
import { AddressExplorerLink } from '@components/Common/ExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from '@utils/constants'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import { shortenAddress } from '@utils/functions/shortenAddress'
import React, { FC } from 'react'
import { AiOutlineNumber } from 'react-icons/ai'
import { HiOutlineGlobe, HiOutlineLocationMarker } from 'react-icons/hi'
import { RiShieldKeyholeLine, RiTwitterLine } from 'react-icons/ri'
import { Attribute, Profile } from 'src/types'
import { useContractRead } from 'wagmi'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes as Attribute[]
  const address = channel.ownedBy

  const { data: ensData } = useContractRead({
    addressOrName: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
    contractInterface: ENS_NAME_ABI,
    functionName: 'getNames',
    args: [[address]],
    chainId: 1
  })

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
          {ensData && (
            <div className="flex items-center space-x-1">
              <span className="pr-0.5 grayscale" role="img">
                <img
                  src={`${STATIC_ASSETS}/images/social/ens.svg`}
                  alt="ens"
                  className="w-3.5 h-3.5"
                  draggable={false}
                />
              </span>
              <span>{ensData[0]}</span>
            </div>
          )}
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
                alt="lenster"
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
        <div className="space-y-1.5">
          {getValueFromKeyInAttributes(attributes, 'location') && (
            <div className="flex items-center space-x-1">
              <HiOutlineLocationMarker />
              <span>{getValueFromKeyInAttributes(attributes, 'location')}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <AiOutlineNumber />
            <Tooltip content={`ID - ${parseInt(channel.id)}`} placement="right">
              <span>{channel.id}</span>
            </Tooltip>
          </div>
          <div className="flex items-center space-x-1">
            <RiShieldKeyholeLine />
            <AddressExplorerLink address={channel.ownedBy}>
              <Tooltip content="Owner address" placement="right">
                <span>{shortenAddress(channel.ownedBy)}</span>
              </Tooltip>
            </AddressExplorerLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
