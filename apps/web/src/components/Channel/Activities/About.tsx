import InterweaveContent from '@components/Common/InterweaveContent'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from '@utils/constants'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import { shortenAddress } from '@utils/functions/shortenAddress'
import type { Attribute, Profile } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { AiOutlineNumber } from 'react-icons/ai'
import { HiOutlineGlobe, HiOutlineLocationMarker } from 'react-icons/hi'
import { RiShieldKeyholeLine, RiTwitterLine } from 'react-icons/ri'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes as Attribute[]
  const hasOnChainId =
    channel.onChainIdentity?.ens?.name ||
    channel.onChainIdentity?.proofOfHumanity ||
    channel.onChainIdentity?.worldcoin.isHuman ||
    channel.onChainIdentity?.sybilDotOrg.verified

  return (
    <div className="space-y-4 md:pr-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-70">
            Description
          </h6>
          <InterweaveContent content={channel?.bio} />
        </div>
      )}
      {hasOnChainId && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-70">
            On-chain Identity
          </h6>
          <div className="flex items-center space-x-2">
            {channel.onChainIdentity?.ens?.name && (
              <Tooltip content={channel.onChainIdentity?.ens?.name}>
                <img
                  src={`${STATIC_ASSETS}/images/social/ens.svg`}
                  alt="ens"
                  className="w-8 h-8"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.sybilDotOrg.verified && (
              <Tooltip content="Sybil Verified">
                <img
                  src={`${STATIC_ASSETS}/images/social/sybil.png`}
                  alt="sybil"
                  className="w-9 h-9"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.proofOfHumanity && (
              <Tooltip content="Proof of Humanity">
                <img
                  src={`${STATIC_ASSETS}/images/social/poh.png`}
                  alt="poh"
                  className="w-9 h-9"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.worldcoin.isHuman && (
              <Tooltip content="Proof of Personhood">
                <img
                  src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                  alt="worldcoin"
                  className="w-9 h-9"
                  draggable={false}
                />
              </Tooltip>
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
              <Link
                href={`https://${getValueFromKeyInAttributes(
                  attributes,
                  'website'
                )
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Website
              </Link>
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
            <Link
              href={`${LENSTER_WEBSITE_URL}/u/${channel?.handle}`}
              target="_blank"
              rel="noreferer noreferrer"
              className="hover:text-indigo-500"
            >
              Lenster
            </Link>
          </div>
          {getValueFromKeyInAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1">
              <RiTwitterLine />
              <Link
                href={`https://twitter.com/${getValueFromKeyInAttributes(
                  attributes,
                  'twitter'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </Link>
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
