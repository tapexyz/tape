import Alert from '@components/Common/Alert'
import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import InfoOutline from '@components/Common/Icons/InfoOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import ProfileBanOutline from '@components/Common/Icons/ProfileBanOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import { getRelativeTime } from '@lib/formatTime'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import {
  Badge as BadgeUI,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Text
} from '@radix-ui/themes'
import { useCopyToClipboard } from '@tape.xyz/browser'
import { MISUSED_CHANNELS, STATIC_ASSETS } from '@tape.xyz/constants'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  getValueFromKeyInAttributes,
  imageCdn,
  sanitizeDStorageUrl,
  shortenAddress
} from '@tape.xyz/generic'
import {
  type Profile,
  useBlockMutation,
  useUnblockMutation
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'

import Bubbles from '../Mutual/Bubbles'
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
    sanitizeDStorageUrl(getProfileCoverPicture(profile))
  )

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)
  const isBlockedByMe = profile.operations.isBlockedByMe.value

  const location = getValueFromKeyInAttributes(
    profile.metadata?.attributes,
    'location'
  )
  const { cache } = useApolloClient()
  const [block] = useBlockMutation()
  const [unBlock] = useUnblockMutation()

  const updateCache = (value: boolean) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: {
        operations: () => ({
          ...profile.operations,
          isBlockedByMe: { value }
        })
      }
    })
  }

  const toggleBlockProfile = async () => {
    if (isBlockedByMe) {
      await unBlock({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
      updateCache(false)
      toast.success(t`Unblocked successfully`)
    } else {
      await block({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
      updateCache(true)
      toast.success(t`Blocked successfully`)
    }
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url("${coverImage}")`
        }}
        className="ultrawide:h-[25vh] bg-brand-500 relative flex h-44 w-full justify-center bg-cover bg-center bg-no-repeat md:h-[20vw]"
      >
        <div className="container absolute bottom-4 mx-auto flex max-w-[70rem] items-end justify-between px-2 xl:px-0">
          <img
            className="ultrawide:h-32 ultrawide:w-32 rounded-small h-24 w-24 flex-none border-2 border-white bg-white shadow-2xl dark:bg-gray-900"
            src={getProfilePicture(profile, 'AVATAR_LG')}
            draggable={false}
            alt={getProfile(profile)?.slug}
          />
          <Flex direction="column" gap="4" align="end">
            {profile.metadata && <CoverLinks metadata={profile.metadata} />}

            <Flex gap="1">
              <BadgeUI
                className="!bg-white !text-black"
                onClick={() => copy(profile.ownedBy.address)}
              >
                <span className="bg-white text-black">
                  # {parseInt(profile.id)}
                </span>
              </BadgeUI>
              <BadgeUI
                className="!bg-white !text-black"
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
              weight="bold"
            >
              <span>{getProfile(profile)?.displayName}</span>
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
                    <span>{location}</span>
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
                <DropdownMenu.Item
                  color="red"
                  onClick={() => toggleBlockProfile()}
                >
                  <Flex align="center" gap="2">
                    <ProfileBanOutline className="h-4 w-4" />
                    <span className="whitespace-nowrap">
                      {isBlockedByMe ? (
                        <Trans>Unblock</Trans>
                      ) : (
                        <Trans>Block</Trans>
                      )}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <FollowActions size="3" profile={profile} />
          </Flex>
        </div>
        <Flex justify="between" align="center" gap="3">
          {profile.metadata?.bio && (
            <div className="line-clamp-2">
              <InterweaveContent content={profile.metadata?.bio} />
            </div>
          )}
          <Stats profile={profile} />
        </Flex>
        {profile?.id && !isOwnChannel ? <Bubbles viewing={profile.id} /> : null}
      </div>
    </>
  )
}

export default BasicInfo
