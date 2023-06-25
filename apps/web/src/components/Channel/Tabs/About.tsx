import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import HashtagOutline from '@components/Common/Icons/HashtagOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from '@lenstube/constants'
import { getValueFromKeyInAttributes, shortenAddress } from '@lenstube/generic'
import type { Attribute, Profile } from '@lenstube/lens'
import { t, Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

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
    <div className="space-y-4 md:space-y-6 md:pr-4">
      {channel?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-50">
            <Trans>Description</Trans>
          </h6>
          <InterweaveContent content={channel?.bio} />
        </div>
      )}
      {hasOnChainId && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-50">DID</h6>
          <div className="flex items-center space-x-2">
            {channel.onChainIdentity?.ens?.name && (
              <Tooltip content={channel.onChainIdentity?.ens?.name}>
                <img
                  src={`${STATIC_ASSETS}/images/social/ens.svg`}
                  alt="ens"
                  className="h-8 w-8"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.sybilDotOrg.verified && (
              <Tooltip content={t`Sybil Verified`}>
                <img
                  src={`${STATIC_ASSETS}/images/social/sybil.png`}
                  alt="sybil"
                  className="h-9 w-9"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.proofOfHumanity && (
              <Tooltip content={t`Proof of Humanity`}>
                <img
                  src={`${STATIC_ASSETS}/images/social/poh.png`}
                  alt="poh"
                  className="h-9 w-9"
                  draggable={false}
                />
              </Tooltip>
            )}
            {channel?.onChainIdentity?.worldcoin.isHuman && (
              <Tooltip content={t`Proof of Personhood`}>
                <img
                  src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                  alt="worldcoin"
                  className="h-9 w-9"
                  draggable={false}
                />
              </Tooltip>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-50">
          <Trans>Links</Trans>
        </h6>
        <div className="space-y-1.5">
          {getValueFromKeyInAttributes(attributes, 'website') && (
            <div className="flex items-center space-x-1.5">
              <GlobeOutline className="h-4 w-4" />
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
                {getValueFromKeyInAttributes(channel?.attributes, 'website')
                  ?.replace('https://', '')
                  .replace('http://', '')}
              </Link>
            </div>
          )}
          {getValueFromKeyInAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1.5">
              <img
                src={`${STATIC_ASSETS}/images/social/twitter.svg`}
                alt="twitter"
                className="h-4 w-4"
                draggable={false}
              />
              <Link
                href={`https://twitter.com/${getValueFromKeyInAttributes(
                  attributes,
                  'twitter'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                {getValueFromKeyInAttributes(
                  channel?.attributes,
                  'twitter'
                )?.replace('https://twitter.com/', '')}
              </Link>
            </div>
          )}
          <div className="flex items-center space-x-1.5">
            <span className="grayscale" role="img">
              <img
                src={`${STATIC_ASSETS}/images/lenster-logo.svg`}
                alt="lenster"
                className="h-4 w-4"
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
        </div>
      </div>
      <div className="inline-flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-50">Others</h6>
        <div className="space-y-1.5">
          {getValueFromKeyInAttributes(attributes, 'location') && (
            <div className="flex items-center space-x-1.5">
              <LocationOutline className="h-4 w-4" />
              <span>{getValueFromKeyInAttributes(attributes, 'location')}</span>
            </div>
          )}
          <div className="flex items-center space-x-1.5">
            <HashtagOutline className="h-4 w-4" />
            <Tooltip
              content={`Profile Id - ${parseInt(channel.id)}`}
              placement="right"
            >
              <span>{channel.id}</span>
            </Tooltip>
          </div>
          <div className="flex items-center space-x-1.5">
            <WalletOutline className="h-4 w-4" />
            <AddressExplorerLink address={channel.ownedBy}>
              <span>{shortenAddress(channel.ownedBy)}</span>
            </AddressExplorerLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
