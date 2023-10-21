import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import ProfileBanOutline from '@components/Common/Icons/ProfileBanOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import useAuthPersistStore from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import { t, Trans } from '@lingui/macro'
import {
  Badge as BadgeUI,
  Button,
  Callout,
  DropdownMenu,
  Flex,
  IconButton,
  Text
} from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { useCopyToClipboard } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  MISUSED_CHANNELS,
  REQUESTING_SIGNATURE_MESSAGE,
  STATIC_ASSETS
} from '@tape.xyz/constants'
import {
  getProfile,
  getSignature,
  getValueFromKeyInAttributes,
  shortenAddress
} from '@tape.xyz/generic'
import type {
  CreateBlockProfilesBroadcastItemResult,
  CreateUnblockProfilesBroadcastItemResult,
  Profile
} from '@tape.xyz/lens'
import {
  useBlockMutation,
  useBroadcastOnchainMutation,
  useCreateBlockProfilesTypedDataMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

import Bubbles from '../Mutual/Bubbles'
import Stats from './Stats'

type Props = {
  profile: Profile
}

const BasicInfo: FC<Props> = ({ profile }) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const hasOnChainId =
    profile.onchainIdentity?.ens?.name ||
    profile.onchainIdentity?.proofOfHumanity ||
    profile.onchainIdentity?.worldcoin.isHuman ||
    profile.onchainIdentity?.sybilDotOrg.verified

  const isOwnChannel = profile?.id === selectedSimpleProfile?.id

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)
  const isBlockedByMe = profile.operations.isBlockedByMe.value

  const location = getValueFromKeyInAttributes(
    profile.metadata?.attributes,
    'location'
  )
  const { cache } = useApolloClient()

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

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    setLoading(false)
    updateCache(!isBlockedByMe)
    toast.success(
      `${isBlockedByMe ? t`Unblocked` : `Blocked`} ${getProfile(profile)
        ?.displayName}`
    )
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setBlockStatus',
    onSuccess: () => onCompleted(),
    onError
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const broadcastTypedData = async (
    typedDataResult:
      | CreateBlockProfilesBroadcastItemResult
      | CreateUnblockProfilesBroadcastItemResult
  ) => {
    const { typedData, id } = typedDataResult
    try {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
      const signature = await signTypedDataAsync(getSignature(typedData))
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      })
      if (data?.broadcastOnchain?.__typename === 'RelayError') {
        const { byProfileId, idsOfProfilesToSetBlockStatus, blockStatus } =
          typedData.value
        write?.({
          args: [byProfileId, idsOfProfilesToSetBlockStatus, blockStatus]
        })
      }
    } catch {
      setLoading(false)
    }
  }

  const [createBlockTypedData] = useCreateBlockProfilesTypedDataMutation({
    onCompleted: async ({ createBlockProfilesTypedData }) => {
      broadcastTypedData(createBlockProfilesTypedData)
    },
    onError
  })

  const [createUnBlockTypedData] = useCreateUnblockProfilesTypedDataMutation({
    onCompleted: async ({ createUnblockProfilesTypedData }) => {
      broadcastTypedData(createUnblockProfilesTypedData)
    },
    onError
  })

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      onCompleted(block.__typename)
      if (block.__typename === 'LensProfileManagerRelayError') {
        return await createBlockTypedData({
          variables: { request: { profiles: [profile.id] } }
        })
      }
    },
    onError
  })
  const [unBlock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      onCompleted(unblock.__typename)
      if (unblock.__typename === 'LensProfileManagerRelayError') {
        return await createUnBlockTypedData({
          variables: { request: { profiles: [profile.id] } }
        })
      }
    },
    onError
  })

  const toggleBlockProfile = async () => {
    setLoading(true)
    if (isBlockedByMe) {
      await unBlock({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
    } else {
      await block({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
    }
    setLoading(false)
  }

  return (
    <div className="px-2 xl:px-0">
      {misused?.description && (
        <Callout.Root color="red" mt="4">
          <Callout.Icon>
            <WarningOutline className="h-5 w-5" />
          </Callout.Icon>
          <Callout.Text>
            <Flex gap="2" align="center">
              <BadgeUI>{misused.type}</BadgeUI>
              <InterweaveContent content={misused.description} />
            </Flex>
          </Callout.Text>
        </Callout.Root>
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
                className="flex items-center"
              >
                <Button variant="ghost">
                  <LocationOutline className="h-4" />
                  <span>{location}</span>
                </Button>
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
                disabled={loading}
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
  )
}

export default BasicInfo