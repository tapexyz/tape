import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
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
import type {
  CreateUnblockProfilesBroadcastItemResult,
  Profile,
  WhoHaveBlockedRequest
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
import { Button, Spinner } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

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
    toast.success(`Unblocked successfully`)
    setUnblockingProfileId('')
  }

  const request: WhoHaveBlockedRequest = { limit: LimitType.Fifty }
  const { data, loading, error, fetchMore } = useWhoHaveBlockedQuery({
    variables: { request },
    skip: !activeProfile?.id
  })
  const pageInfo = data?.whoHaveBlocked?.pageInfo

  const { observe } = useInView({
    threshold: 0.25,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

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
    typedDataResult: CreateUnblockProfilesBroadcastItemResult
  ) => {
    const { typedData, id } = typedDataResult
    const { byProfileId, idsOfProfilesToSetBlockStatus, blockStatus } =
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
          return await write({ args })
        }
        return
      }
      return await write({ args })
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
    return <Spinner className="my-20" />
  }

  if (!blockedProfiles?.length || error) {
    return <NoDataFound withImage isCenter />
  }

  const onClickUnblock = async (profileId: string) => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

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
              <img
                className="size-8 rounded-full border-2 border-white bg-white object-cover dark:bg-gray-900"
                src={getProfilePicture(profile, 'AVATAR')}
                alt={getProfile(profile)?.displayName}
                draggable={false}
              />
            </div>
            <div className="absolute bottom-2 right-2 flex-none">
              <Button
                onClick={() => onClickUnblock(profile.id)}
                disabled={unblockingProfileId === profile.id}
              >
                Unblock
              </Button>
            </div>
          </div>
          <div className="p-2 pl-4 pt-2.5">
            <Link
              href={getProfile(profile)?.link}
              className="flex items-center space-x-1"
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
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </div>
  )
}

export default List
