import KeyOutline from '@components/Common/Icons/KeyOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import useAuthPersistStore, { signIn, signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { t } from '@lingui/macro'
import { Avatar, Button, Callout, Flex, Select, Text } from '@radix-ui/themes'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  logger,
  shortenAddress
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  LimitType,
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery,
  useSimpleProfilesLazyQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

const Authenticate = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )

  const onError = () => {
    signOut()
    setActiveProfile(null)
  }

  const router = useRouter()
  const { address, connector, isConnected } = useAccount()
  const isReadyToSign = isConnected && !selectedSimpleProfile?.id

  const { data, loading: profilesLoading } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    },
    skip: !address,
    onCompleted: (data) => {
      const profile = data?.profilesManaged.items?.[0]
      if (profile) {
        setSelectedProfileId(profile.id)
      }
    }
  })

  const { signMessageAsync } = useSignMessage({
    onError
  })
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [loadChallenge] = useChallengeLazyQuery({
    // if cache old challenge persist issue (InvalidSignature)
    fetchPolicy: 'no-cache',
    onError
  })
  const [authenticate] = useAuthenticateMutation()
  const [getAllSimpleProfiles] = useSimpleProfilesLazyQuery()

  const handleSign = useCallback(async () => {
    if (!isReadyToSign) {
      disconnect?.()
      signOut()
      return toast.error(t`Please connect to your wallet`)
    }
    try {
      setLoading(true)
      const challenge = await loadChallenge({
        variables: { request: { for: selectedProfileId, signedBy: address } }
      })
      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERROR_MESSAGE)
      }
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      })
      if (!signature) {
        return
      }
      const result = await authenticate({
        variables: {
          request: { id: challenge.data?.challenge.id, signature }
        }
      })
      const accessToken = result.data?.authenticate.accessToken
      const refreshToken = result.data?.authenticate.refreshToken
      signIn({ accessToken, refreshToken })
      const { data: profilesData } = await getAllSimpleProfiles({
        variables: {
          request: { where: { ownedBy: [address] } }
        },
        fetchPolicy: 'no-cache'
      })
      if (
        !profilesData?.profiles ||
        profilesData?.profiles?.items.length === 0
      ) {
        setActiveProfile(null)
        setSelectedSimpleProfile(null)
        toast.error('No profile found')
      } else {
        const profiles = profilesData?.profiles?.items as Profile[]
        const profile = profiles.find(
          (profile) => profile.id === selectedProfileId
        )
        if (profile) {
          setSelectedSimpleProfile(profile)
        }
        if (router.query?.next) {
          router.push(router.query?.next as string)
        } else {
          router.push('/')
        }
      }
      Analytics.track(TRACK.AUTH.SIGN_IN_WITH_LENS)
    } catch (error) {
      signOut()
      logger.error('[Error Sign In]', {
        error,
        connector: connector?.name
      })
    } finally {
      setLoading(false)
    }
  }, [
    router,
    address,
    connector,
    disconnect,
    authenticate,
    isReadyToSign,
    loadChallenge,
    setActiveProfile,
    signMessageAsync,
    selectedProfileId,
    getAllSimpleProfiles,
    setSelectedSimpleProfile
  ])

  if (!isConnected) {
    return
  }

  if (profilesLoading) {
    return <Loader />
  }

  const profiles = data?.profilesManaged.items as Profile[]
  const profile = profiles?.[0]

  return (
    <div>
      {profile ? (
        <Flex direction="column" gap="2">
          <Select.Root
            size="3"
            defaultValue={profile?.id}
            value={selectedProfileId}
            onValueChange={(value) => setSelectedProfileId(value)}
          >
            <Select.Trigger className="w-full" />
            <Select.Content highContrast>
              {profiles?.map((profile) => (
                <Select.Item key={profile.id} value={profile.id}>
                  <Flex gap="2">
                    <Avatar
                      src={getProfilePicture(profile)}
                      fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                      radius="full"
                      size="1"
                    />
                    <Text>{getProfile(profile)?.slug}</Text>
                  </Flex>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button
            className="w-full"
            highContrast
            size="4"
            onClick={handleSign}
            disabled={loading || !selectedProfileId}
          >
            <KeyOutline className="h-4 w-4" />
            Sign message
          </Button>
        </Flex>
      ) : (
        <Callout.Root color="red">
          <Callout.Icon>
            <WarningOutline className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text>
            We couldn't find any profiles linked to the connected address. (
            {shortenAddress(address as string)})
          </Callout.Text>
        </Callout.Root>
      )}
    </div>
  )
}

export default Authenticate
