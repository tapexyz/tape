import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import InterweaveContent from '@components/Common/InterweaveContent'
import ReportProfile from '@components/Report/Profile'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { useCopyToClipboard } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  MISUSED_CHANNELS,
  REQUESTING_SIGNATURE_MESSAGE,
  STATIC_ASSETS,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getProfile,
  getSignature,
  trimify
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
import {
  Badge as BadgeUI,
  Callout,
  DropdownMenu,
  DropdownMenuItem,
  FlagOutline,
  LinkOutline,
  Modal,
  ProfileBanOutline,
  ThreeDotsOutline,
  Tooltip,
  WarningOutline
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

import Bubbles from '../Mutual/Bubbles'
import Stats from './Stats'

type Props = {
  profile: Profile
}

const BasicInfo: FC<Props> = ({ profile }) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { activeProfile } = useProfileStore()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const hasOnChainId =
    profile.onchainIdentity?.ens?.name ||
    profile.onchainIdentity?.proofOfHumanity ||
    profile.onchainIdentity?.worldcoin.isHuman ||
    profile.onchainIdentity?.sybilDotOrg.verified

  const isOwnChannel = profile?.id === activeProfile?.id

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)
  const isBlockedByMe = profile.operations.isBlockedByMe.value

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
    const displayName = getProfile(profile)?.displayName
    toast.success(`${isBlockedByMe ? `Unblocked` : `Blocked`} ${displayName}`)
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => onCompleted(),
      onError
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'setBlockStatus',
      args
    })
  }

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
    const { byProfileId, idsOfProfilesToSetBlockStatus, blockStatus } =
      typedData.value
    const args = [byProfileId, idsOfProfilesToSetBlockStatus, blockStatus]
    try {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
      if (canBroadcast) {
        const signature = await signTypedDataAsync(getSignature(typedData))
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return await write({ args })
        }
        return
      }
      return await write({ args })
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
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: { profiles: [profile.id] }
          }
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
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: { profiles: [profile.id] }
          }
        })
      }
    },
    onError
  })

  const toggleBlockProfile = async () => {
    setLoading(true)
    if (isBlockedByMe) {
      return await unBlock({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
    }

    await block({
      variables: {
        request: {
          profiles: [profile.id]
        }
      }
    })
    setLoading(false)
  }

  return (
    <div className="px-2 xl:px-0">
      {misused?.type && (
        <Callout
          variant="danger"
          className="mt-4"
          icon={<WarningOutline className="size-5" />}
        >
          <div className="flex items-center gap-2">
            {misused.type}
            {misused.description && (
              <InterweaveContent content={misused.description} />
            )}
          </div>
        </Callout>
      )}
      <div className="flex flex-1 flex-wrap justify-between pb-1 pt-4 md:gap-5">
        <div className="flex flex-col items-start">
          <p className="flex items-center space-x-1.5 text-lg font-bold md:text-3xl">
            <span>{getProfile(profile)?.displayName}</span>
            <Badge id={profile?.id} size="xl" />
          </p>

          <div className="flex items-center space-x-2">
            {profile.operations.isFollowingMe.value && (
              <BadgeUI>Follows you</BadgeUI>
            )}
            <div className="hidden items-center md:flex">
              {hasOnChainId && (
                <div className="flex items-center space-x-0.5 py-2">
                  {profile.onchainIdentity?.ens?.name && (
                    <Tooltip
                      content={profile.onchainIdentity?.ens?.name}
                      placement="top"
                    >
                      <img
                        src={`${STATIC_ASSETS}/images/social/ens.svg`}
                        alt="ens"
                        className="size-6"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.sybilDotOrg.verified && (
                    <Tooltip content={`Sybil Verified`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/sybil.png`}
                        alt="sybil"
                        className="size-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.proofOfHumanity && (
                    <Tooltip content={`Proof of Humanity`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/poh.png`}
                        alt="poh"
                        className="size-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.worldcoin.isHuman && (
                    <Tooltip content={`Proof of Personhood`} placement="top">
                      <img
                        src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                        alt="worldcoin"
                        className="size-7"
                        draggable={false}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
              {profile?.id && !isOwnChannel ? (
                <Bubbles viewing={profile.id} showSeparator={hasOnChainId} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu trigger={<ThreeDotsOutline className="size-4" />}>
            <DropdownMenuItem
              onClick={() =>
                copy(`${TAPE_WEBSITE_URL}${getProfile(profile).link}`)
              }
            >
              <div className="flex items-center gap-2">
                <LinkOutline className="size-3.5" />
                <span className="whitespace-nowrap">Permalink</span>
              </div>
            </DropdownMenuItem>

            {activeProfile?.id && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    setShowReportModal(true)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FlagOutline className="size-3.5" />
                    <p className="whitespace-nowrap">Report</p>
                  </div>
                </DropdownMenuItem>
                <Modal
                  size="sm"
                  title={`Report ${getProfile(profile)?.slugWithPrefix}`}
                  show={showReportModal}
                  setShow={setShowReportModal}
                >
                  <ReportProfile
                    profile={profile}
                    close={() => setShowReportModal(false)}
                  />
                </Modal>
              </>
            )}

            {profile.operations.canBlock && (
              <DropdownMenuItem
                disabled={loading}
                onClick={() => toggleBlockProfile()}
              >
                <div className="flex items-center gap-2 text-red-500">
                  <ProfileBanOutline className="size-4" />
                  <span className="whitespace-nowrap">
                    {isBlockedByMe ? 'Unblock' : 'Block'}
                  </span>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenu>
          <FollowActions profile={profile} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {profile.metadata?.bio && (
          <div className="line-clamp-5">
            <InterweaveContent
              content={trimify(profile.metadata.bio).replaceAll('\n', ' ')}
            />
          </div>
        )}
        <Stats profile={profile} />
      </div>
    </div>
  )
}

export default BasicInfo
