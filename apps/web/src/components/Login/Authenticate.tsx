import ButtonShimmer from '@components/Shimmers/ButtonShimmer'
import { signIn, signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/idb/profile'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import {
  EVENTS,
  getProfile,
  getProfilePicture,
  logger,
  Tower
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  LimitType,
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import { Button, Select, SelectItem } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { memo, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useSignMessage } from 'wagmi'

import Signup from './Signup'

const Authenticate = () => {
  const {
    query: { as }
  } = useRouter()

  const [loading, setLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const { activeProfile, setActiveProfile } = useProfileStore()

  const router = useRouter()
  const { address, connector, isConnected } = useAccount()
  const { resetStore: resetApolloStore } = useApolloClient()

  const onError = () => {
    signOut()
  }

  const {
    data,
    loading: profilesLoading,
    refetch
  } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    },
    notifyOnNetworkStatusChange: true,
    skip: !address,
    onCompleted: (data) => {
      const profiles = data?.profilesManaged.items
      if (profiles?.length) {
        setShowSignup(false)
        const profile = [...profiles].reverse()[0]
        setSelectedProfileId(as || profile.id)
      } else {
        setShowSignup(true)
      }
    }
  })

  const profilesManaged = data?.profilesManaged.items as Profile[]
  const reversedProfilesManaged = useMemo(() => {
    // Use the spread operator to create a new array and sort it by the "handle" key
    return [...(profilesManaged || [])].reverse()
  }, [profilesManaged])

  const profile = reversedProfilesManaged?.[0]

  const { signMessageAsync } = useSignMessage({
    mutation: { onError }
  })

  const [loadChallenge] = useChallengeLazyQuery({
    // if cache old challenge persist issue (InvalidSignature)
    fetchPolicy: 'no-cache',
    onError
  })
  const [authenticate] = useAuthenticateMutation()

  const handleSign = useCallback(async () => {
    if (!isConnected) {
      signOut()
      return toast.error('Please connect to your wallet')
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
        toast.error('No profile found')
      } else {
        const profile = profilesManaged.find(
          (profile) => profile.id === selectedProfileId
        )
        if (profile) {
          setActiveProfile(profile)
        }
        const next = router.query?.next as string
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          router.push(next)
        } else {
          router.push('/')
        }
      }
      resetApolloStore()
      Tower.track(EVENTS.AUTH.SIGN_IN_WITH_LENS)
    } catch (error) {
      logger.error('[Error Sign In]', {
        error,
        connector: connector?.name
      })
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router,
    address,
    connector,
    authenticate,
    isConnected,
    loadChallenge,
    profilesManaged,
    selectedProfileId
  ])

  if (as && as === activeProfile?.id) {
    return null
  }

  if (!isConnected) {
    return null
  }

  if (profilesLoading) {
    return (
      <div className="space-y-2">
        <ButtonShimmer className="h-[46px]" />
        <ButtonShimmer className="h-[46px]" />
      </div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      {showSignup ? (
        <Signup
          onSuccess={() => refetch()}
          setShowSignup={setShowSignup}
          showLogin={Boolean(profile)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <Select
            size="lg"
            defaultValue={as ?? profile?.id}
            value={selectedProfileId}
            onValueChange={(value) => setSelectedProfileId(value)}
          >
            {reversedProfilesManaged?.map((profile) => (
              <SelectItem size="lg" key={profile.id} value={profile.id}>
                <div className="flex items-center space-x-2">
                  <img
                    src={getProfilePicture(profile, 'AVATAR')}
                    className="size-4 rounded-full"
                    alt={getProfile(profile)?.displayName}
                  />
                  <span>{getProfile(profile).slugWithPrefix}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
          <Button
            size="md"
            loading={loading}
            onClick={handleSign}
            disabled={loading || !selectedProfileId}
          >
            Login
          </Button>
          <div className="flex items-center justify-center space-x-2 pt-3 text-sm">
            {profile ? (
              <span>Need new account?</span>
            ) : (
              <span>Don't have an account?</span>
            )}
            <button
              type="button"
              className="text-brand-500 font-bold"
              onClick={() => setShowSignup(true)}
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Authenticate)
