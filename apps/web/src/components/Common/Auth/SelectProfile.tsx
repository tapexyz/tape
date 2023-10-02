import { Analytics, TRACK } from '@lenstube/browser'
import { ERROR_MESSAGE } from '@lenstube/constants'
import { getProfilePicture, logger, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  LimitType,
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery,
  useSimpleProfilesLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, { signIn, signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  RadioGroup,
  ScrollArea,
  Text
} from '@radix-ui/themes'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

const SelectProfile = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>()
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )

  const { data } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    },
    onCompleted: (data) => {
      const profiles = data?.profilesManaged.items as Profile[]
      setSelectedProfileId(profiles?.[0].id)
    }
  })

  const profiles = data?.profilesManaged.items as Profile[]

  const isReadyToSign = isConnected && !selectedSimpleProfile?.id

  const onError = () => {
    signOut()
    setActiveChannel(null)
  }

  const { signMessageAsync } = useSignMessage({
    onError
  })

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache', // if cache old challenge persist issue (InvalidSignature)
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
        setActiveChannel(null)
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
    setActiveChannel,
    signMessageAsync,
    selectedProfileId,
    getAllSimpleProfiles,
    setSelectedSimpleProfile
  ])

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button highContrast variant="classic">
          Sign In
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{t`Sign in as...`}</Dialog.Title>

        <ScrollArea type="hover" scrollbars="vertical" style={{ height: 200 }}>
          <Flex direction="column" gap="3" pt="3">
            <RadioGroup.Root
              value={selectedProfileId}
              onValueChange={(value) => setSelectedProfileId(value)}
              defaultValue={selectedProfileId}
              variant="classic"
              highContrast
            >
              {profiles?.map((profile) => (
                <Card variant="ghost" key={profile.id}>
                  <Flex gap="3" align="center">
                    <RadioGroup.Item value={profile.id} />
                    <Avatar
                      size="2"
                      src={getProfilePicture(profile)}
                      fallback={trimLensHandle(profile.handle)[0]}
                    />
                    <Box>
                      <Text as="div" size="2" weight="bold">
                        {profile.handle}
                      </Text>
                      <Text as="div" size="2" color="gray">
                        {profile.stats.followers} followers
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </RadioGroup.Root>
          </Flex>
        </ScrollArea>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            highContrast
            variant="classic"
            disabled={loading}
            onClick={() => handleSign()}
          >
            Sign In
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SelectProfile
