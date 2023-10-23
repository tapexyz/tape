import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAuthPersistStore from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import { t } from '@lingui/macro'
import { Avatar, Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  getSignature,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type {
  CreateUnblockProfilesBroadcastItemResult,
  Profile
} from '@tape.xyz/lens'
import {
  LimitType,
  useBroadcastOnchainMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation,
  useWhoHaveBlockedQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

const List = () => {
  const [unblockingProfileId, setUnblockingProfileId] = useState('')
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { cache } = useApolloClient()

  const onError = (error: CustomErrorWithData) => {
    setUnblockingProfileId('')
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const updateCache = () => {
    const normalizedId = cache.identify({
      id: unblockingProfileId,
      __typename: 'Profile'
    })
    cache.evict({ id: normalizedId })
    cache.gc()
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
    updateCache()
    toast.success(t`Unblocked successfully`)
    setUnblockingProfileId('')
  }

  const { data, loading, error } = useWhoHaveBlockedQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !selectedSimpleProfile?.id
  })

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
    typedDataResult: CreateUnblockProfilesBroadcastItemResult
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
      setUnblockingProfileId('')
    }
  }

  const [createUnBlockTypedData] = useCreateUnblockProfilesTypedDataMutation({
    onCompleted: async ({ createUnblockProfilesTypedData }) => {
      broadcastTypedData(createUnblockProfilesTypedData)
    },
    onError
  })

  const [unBlock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      if (unblock.__typename === 'LensProfileManagerRelayError') {
        return await createUnBlockTypedData({
          variables: { request: { profiles: [unblockingProfileId] } }
        })
      }
      onCompleted(unblock.__typename)
    },
    onError
  })

  const blockedProfiles = data?.whoHaveBlocked?.items as Profile[]

  if (loading) {
    return <Loader className="my-20" />
  }

  if (!blockedProfiles?.length || error) {
    return <NoDataFound withImage isCenter />
  }

  const onClickUnblock = async (profileId: string) => {
    console.log(
      '🚀 ~ file: List.tsx:154 ~ onClickUnblock ~ profileId:',
      profileId
    )
    try {
      setUnblockingProfileId(profileId)
      await unBlock({
        variables: {
          request: {
            profiles: [profileId]
          }
        }
      })
    } catch (error: any) {
      onError(error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {blockedProfiles.map((profile) => (
        <div
          key={profile.id}
          className="tape-border rounded-small overflow-hidden"
        >
          <div
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
              )})`
            }}
            className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute bottom-2 left-2 flex-none">
              <Avatar
                className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                size="3"
                fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                radius="medium"
                src={getProfilePicture(profile, 'AVATAR')}
              />
            </div>
            <div className="absolute bottom-2 right-2 flex-none">
              <Button
                onClick={() => onClickUnblock(profile.id)}
                disabled={unblockingProfileId === profile.id}
                highContrast
                size="1"
              >
                Unblock
              </Button>
            </div>
          </div>
          <div className="p-2 pl-4 pt-2.5">
            <Link
              href={`/u/${getProfile(profile)?.slug}`}
              className="flex items-center space-x-1"
            >
              <span className="text-2xl font-bold leading-tight">
                {getProfile(profile)?.slug}
              </span>
              <Badge id={profile?.id} size="lg" />
            </Link>
            {profile.metadata?.bio && (
              <div className="line-clamp-1 py-2">
                <InterweaveContent content={profile.metadata?.bio} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default List
