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
  useProfilesManagedQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

const Authenticate = () => {
  const {
    query: { as }
  } = useRouter()

  const [selectedProfileId, setSelectedProfileId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)
  const { selectedSimpleProfile, setSelectedSimpleProfile } =
    useAuthPersistStore()

  const onError = () => {
    signOut()
    setActiveProfile(null)
  }

  const router = useRouter()
  const { address, connector, isConnected } = useAccount()

  const { data, loading: profilesLoading } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    },
    skip: !address,
    onCompleted: (data) => {
      const profile = data?.profilesManaged.items?.[0]
      if (profile) {
        setSelectedProfileId(as ?? profile.id)
      }
    }
  })

  const profilesManaged = data?.profilesManaged.items as Profile[]
  const profile = profilesManaged?.[0]

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

  const handleSign = useCallback(async () => {
    if (!isConnected) {
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
      if (profilesManaged.length === 0) {
        setActiveProfile(null)
        setSelectedSimpleProfile(null)
        toast.error('No profile found')
      } else {
        const profile = profilesManaged.find(
          (profile) => profile.id === selectedProfileId
        )
        if (profile) {
          setSelectedSimpleProfile({
            id: profile.id,
            ownedBy: profile.ownedBy,
            handle: profile.handle,
            sponsor: profile.sponsor,
            metadata: profile.metadata,
            stats: profile.stats,
            managed: profile.ownedBy.address !== address
          })
        }
        if (router.query?.next) {
          router.push(router.query?.next as string)
        } else {
          router.push('/')
        }
      }
      Analytics.track(TRACK.AUTH.SIGN_IN_WITH_LENS)
    } catch (error) {
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
    isConnected,
    loadChallenge,
    profilesManaged,
    setActiveProfile,
    signMessageAsync,
    selectedProfileId,
    setSelectedSimpleProfile
  ])

  if (as && as === selectedSimpleProfile?.id) {
    return null
  }

  if (!isConnected) {
    return
  }

  if (profilesLoading) {
    return <Loader />
  }

  return (
    <div className="text-left">
      {as && <p className="pb-1">Login as</p>}
      {profile ? (
        <Flex direction="column" gap="2">
          <Select.Root
            size="3"
            defaultValue={as ?? profile?.id}
            value={selectedProfileId}
            onValueChange={(value) => setSelectedProfileId(value)}
          >
            <Select.Trigger className="w-full" />
            <Select.Content highContrast>
              {profilesManaged?.map((profile) => (
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
