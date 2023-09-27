import Alert from '@components/Common/Alert'
import Badge from '@components/Common/Badge'
import ForbiddenOutline from '@components/Common/Icons/ForbiddenOutline'
import InfoOutline from '@components/Common/Icons/InfoOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import SubscribeActions from '@components/Common/SubscribeActions'
import Tooltip from '@components/UIElements/Tooltip'
import { useCopyToClipboard } from '@lenstube/browser'
import { MISUSED_CHANNELS, STATIC_ASSETS } from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getProfilePicture,
  getRelativeTime,
  getValueFromKeyInAttributes,
  imageCdn,
  sanitizeDStorageUrl,
  shortenAddress,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import {
  Badge as BadgeUI,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Link,
  Text
} from '@radix-ui/themes'
import type { FC } from 'react'
import React from 'react'

import MutualFollowers from '../Mutual/Bubbles'
import CoverLinks from './CoverLinks'
import Stats from './Stats'

type Props = {
  profile: Profile
}

const BasicInfo: FC<Props> = ({ profile }) => {
  const [copy] = useCopyToClipboard()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const hasOnChainId =
    profile.onchainIdentity?.ens?.name ||
    profile.onchainIdentity?.proofOfHumanity ||
    profile.onchainIdentity?.worldcoin.isHuman ||
    profile.onchainIdentity?.sybilDotOrg.verified

  const isOwnChannel = profile?.id === selectedSimpleProfile?.id
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getChannelCoverPicture(profile))
  )

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)

  const location = getValueFromKeyInAttributes(
    profile.metadata?.attributes,
    'location'
  )

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${coverImage})`
        }}
        className="ultrawide:h-[25vh] relative flex h-44 w-full justify-center bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900 md:h-[20vw]"
      >
        <div className="container absolute bottom-4 mx-auto flex max-w-[70rem] items-end justify-between px-2 xl:px-0">
          <img
            className="ultrawide:h-32 ultrawide:w-32 h-24 w-24 flex-none rounded-lg border-2 border-white bg-white shadow-2xl dark:bg-gray-900"
            src={getProfilePicture(profile, 'AVATAR_LG')}
            draggable={false}
            alt={profile?.handle}
          />
          <Flex direction="column" gap="4" align="end">
            {profile.metadata && <CoverLinks metadata={profile.metadata} />}

            <Flex gap="1">
              <BadgeUI
                variant="soft"
                onClick={() => copy(profile.ownedBy.address)}
              >
                # {parseInt(profile.id)}
              </BadgeUI>
              <BadgeUI
                variant="soft"
                onClick={() => copy(profile.ownedBy.address)}
              >
                Joined {getRelativeTime(profile.createdAt)}
              </BadgeUI>
            </Flex>
          </Flex>
        </div>
      </div>
      <div className="container mx-auto max-w-[70rem] px-2 xl:px-0">
        {misused?.description && (
          <Alert
            variant="danger"
            className="mx-auto mt-4 flex max-w-[70rem] flex-wrap gap-2 bg-white font-medium dark:bg-black"
          >
            <span className="inline-flex items-center space-x-1 rounded-full bg-red-500 px-3 py-1">
              <InfoOutline className="h-4 w-4 text-white" />
              <span className="font-semibold text-white">{misused.type}</span>
            </span>
            <InterweaveContent content={misused.description} />
          </Alert>
        )}
        <div className="flex flex-1 flex-wrap justify-between py-2 md:space-x-5 md:py-4">
          <div className="mr-3 flex flex-col items-start space-y-1.5">
            <Text
              className="flex items-center space-x-1.5 text-lg md:text-2xl"
              data-testid="channel-name"
              weight="bold"
            >
              <span>
                {profile.metadata?.displayName ||
                  trimLensHandle(profile?.handle)}
              </span>
              <Badge id={profile?.id} size="md" />
            </Text>
            <Flex align="center" gap="4">
              {location && (
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                  target="_blank"
                >
                  <Flex gap="1" align="center">
                    <LocationOutline className="h-4 w-4" />
                    <span>India</span>
                  </Flex>
                </Link>
              )}
              <Button
                variant="ghost"
                onClick={() => copy(profile.ownedBy.address)}
              >
                <WalletOutline className="h-4 w-4" />
                <Tooltip content="Copy Address" placement="top">
                  <span>{shortenAddress(profile.ownedBy.address)}</span>
                </Tooltip>
              </Button>
              {hasOnChainId && (
                <div className="flex items-center space-x-2 py-2">
                  {profile.onchainIdentity?.ens?.name && (
                    <Tooltip
                      content={profile.onchainIdentity?.ens?.name}
                      placement="top"
                    >
                      <img
                        src={`${STATIC_ASSETS}/images/social/ens.svg`}
                        alt="ens"
                        className="h-6 w-6"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.sybilDotOrg.verified && (
                    <Tooltip content={t`Sybil Verified`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/sybil.png`}
                        alt="sybil"
                        className="h-7 w-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.proofOfHumanity && (
                    <Tooltip content={t`Proof of Humanity`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/poh.png`}
                        alt="poh"
                        className="h-7 w-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.worldcoin.isHuman && (
                    <Tooltip content={t`Proof of Personhood`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                        alt="worldcoin"
                        className="h-7 w-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </Flex>
          </div>
          <Flex gap="3" align="center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton variant="ghost">
                  <ThreeDotsOutline className="h-4 w-4" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content sideOffset={10} variant="soft" align="end">
                <DropdownMenu.Item color="red">
                  <Flex align="center" gap="2">
                    <ForbiddenOutline className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">
                      <Trans>Block</Trans>
                    </span>
                  </Flex>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <SubscribeActions size="3" profile={profile} />
          </Flex>
        </div>
        <Stats profile={profile} />
        <Flex pt="3" gap="3">
          {profile.metadata?.bio && (
            <div className="py-2">
              <InterweaveContent content={profile.metadata?.bio} />
            </div>
          )}
          {profile?.id && !isOwnChannel ? (
            <MutualFollowers viewing={profile.id} />
          ) : null}
        </Flex>
      </div>
    </>
  )
}

export default BasicInfo
