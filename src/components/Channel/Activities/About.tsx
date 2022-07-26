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

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes as Attribute[]
  const hasOnChainId =
    channel.onChainIdentity?.ens ||
    channel.onChainIdentity?.proofOfHumanity ||
    channel.onChainIdentity?.sybilDotOrg

  return (
    <div className="space-y-4 md:pr-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-70">
            Description
          </h6>
          <p>{channel?.bio}</p>
        </div>
      )}
      {hasOnChainId && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-70">
            On-chain Identity
          </h6>
          <div className="space-y-1.5">
            {channel.onChainIdentity?.ens?.name && (
              <div className="flex items-center space-x-1">
                <span className="pr-0.5" role="img">
                  <img
                    src={`${STATIC_ASSETS}/images/social/ens.svg`}
                    alt="ens"
                    className="w-5 h-5"
                    draggable={false}
                  />
                </span>
                <span>{channel.onChainIdentity?.ens?.name}</span>
              </div>
            )}
            {channel?.onChainIdentity?.sybilDotOrg.verified && (
              <div className="flex items-center space-x-1">
                <span className="pr-0.5" role="img">
                  <img
                    src={`${STATIC_ASSETS}/images/social/sybil.png`}
                    alt="sybil"
                    className="w-5 h-5"
                    draggable={false}
                  />
                </span>
                <span>Sybil Verified</span>
              </div>
            )}
            {channel?.onChainIdentity?.proofOfHumanity && (
              <div className="flex items-center space-x-1">
                <span className="pr-0.5" role="img">
                  <img
                    src={`${STATIC_ASSETS}/images/social/poh.png`}
                    alt="poh"
                    className="w-5 h-5"
                    draggable={false}
                  />
                </span>
                <span>Proof of Humanity</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-70">Links</h6>
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
          {getValueFromKeyInAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1">
              <RiTwitterLine />
              <a
                href={`https://twitter.com/${
                  getValueFromKeyInAttributes(attributes, 'twitter') as string
                }`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="inline-flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-70">Others</h6>
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
