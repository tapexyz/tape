import GlobeOutline from '@components/Common/Icons/GlobeOutline'
import HashtagOutline from '@components/Common/Icons/HashtagOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import UserOutline from '@components/Common/Icons/UserOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import { STATIC_ASSETS } from '@lenstube/constants'
import {
  getValueFromKeyInAttributes,
  imageCdn,
  shortenAddress
} from '@lenstube/generic'
import type { Attribute, Profile } from '@lenstube/lens'
import { t, Trans } from '@lingui/macro'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import type { FC } from 'react'
import React from 'react'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const { resolvedTheme } = useTheme()
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
          {getValueFromKeyInAttributes(attributes, 'youtube') && (
            <div className="flex items-center space-x-1.5">
              <img
                src={imageCdn(
                  `${STATIC_ASSETS}/images/social/youtube.png`,
                  'AVATAR'
                )}
                className="h-4 w-4"
                height={16}
                width={16}
                alt="Youtube"
                draggable={false}
              />
              <Link
                href={`https://youtube.com/${getValueFromKeyInAttributes(
                  attributes,
                  'youtube'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                {getValueFromKeyInAttributes(
                  channel?.attributes,
                  'youtube'
                )?.replace('https://youtube.com/', '')}
              </Link>
            </div>
          )}
          {getValueFromKeyInAttributes(attributes, 'x') && (
            <div className="flex items-center space-x-1.5">
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
              <Link
                href={`https://x.com/${getValueFromKeyInAttributes(
                  attributes,
                  'x'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                {getValueFromKeyInAttributes(channel?.attributes, 'x')?.replace(
                  'https://x.com/',
                  ''
                )}
              </Link>
            </div>
          )}
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
          {channel.invitedBy && (
            <div className="flex items-center space-x-1.5">
              <UserOutline className="h-4 w-4" />
              <span>
                Invited by{' '}
                <Link
                  className="hover:text-indigo-500"
                  href={`/channel/${channel.invitedBy.handle}`}
                >
                  @{channel.invitedBy.handle}
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default About
