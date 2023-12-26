import type {
  CreateUnblockProfilesBroadcastItemResult,
  Profile,
  WhoHaveBlockedRequest
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'

import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Avatar, Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  INFINITE_SCROLL_ROOT_MARGIN,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  getSignature,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import {
  LimitType,
  useBroadcastOnchainMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation,
  useWhoHaveBlockedQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

const List = () => {
  const [unblockingProfileId, setUnblockingProfileId] = useState('')

  const { activeProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { cache } = useApolloClient()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    setUnblockingProfileId('')
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const updateCache = () => {
    const normalizedId = cache.identify({
      __typename: 'Profile',
      id: unblockingProfileId
    })
    cache.evict({ id: normalizedId })
    cache.gc()
  }

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    updateCache()
    toast.success(`Unblocked successfully`)
    setUnblockingProfileId('')
  }

  const request: WhoHaveBlockedRequest = { limit: LimitType.Fifty }
  const { data, error, fetchMore, loading } = useWhoHaveBlockedQuery({
    skip: !activeProfile?.id,
    variables: { request }
  })
  const pageInfo = data?.whoHaveBlocked?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    threshold: 0.25
  })

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'setBlockStatus',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const broadcastTypedData = async (
    typedDataResult: CreateUnblockProfilesBroadcastItemResult
  ) => {
    const { id, typedData } = typedDataResult
    const { blockStatus, byProfileId, idsOfProfilesToSetBlockStatus } =
      typedData.value
    const args = [byProfileId, idsOfProfilesToSetBlockStatus, blockStatus]
    try {
      if (canBroadcast) {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          return write({ args })
        }
        return
      }
      return write({ args })
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

  const blockedProfiles = data?.whoHaveBlocked.items as Profile[]

  if (loading) {
    return <Loader className="my-20" />
  }

  if (!blockedProfiles?.length || error) {
    return <NoDataFound isCenter withImage />
  }

  const onClickUnblock = async (profileId: string) => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }

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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {blockedProfiles.map((profile) => (
        <div
          className="tape-border rounded-small overflow-hidden"
          key={profile.id}
        >
          <div
            className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
              )})`
            }}
          >
            <div className="absolute bottom-2 left-2 flex-none">
              <Avatar
                alt={getProfile(profile)?.displayName}
                className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                radius="medium"
                size="3"
                src={getProfilePicture(profile, 'AVATAR')}
              />
            </div>
            <div className="absolute bottom-2 right-2 flex-none">
              <Button
                disabled={unblockingProfileId === profile.id}
                highContrast
                onClick={() => onClickUnblock(profile.id)}
                size="1"
              >
                Unblock
              </Button>
            </div>
          </div>
          <div className="p-2 pl-4 pt-2.5">
            <Link
              className="flex items-center space-x-1"
              href={getProfile(profile)?.link}
            >
              <span className="text-2xl font-bold leading-tight">
                {getProfile(profile)?.slug}
              </span>
              <Badge id={profile?.id} size="lg" />
            </Link>
            {profile.metadata?.bio && (
              <div className="line-clamp-2 py-2">
                <InterweaveContent content={profile.metadata?.bio} />
              </div>
            )}
          </div>
        </div>
      ))}
      {pageInfo?.next && (
        <span className="flex justify-center p-10" ref={observe}>
          <Loader />
        </span>
      )}
    </div>
  )
}

export default List
