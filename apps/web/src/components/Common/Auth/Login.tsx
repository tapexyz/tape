import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { Analytics, TRACK } from '@lenstube/browser'
import { ERROR_MESSAGE, POLYGON_CHAIN_ID } from '@lenstube/constants'
import { logger } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useSimpleProfilesLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, { signIn, signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import useNetworkStore from '@lib/store/network'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  useAccount,
  useDisconnect,
  useSignMessage,
  useSwitchNetwork
} from 'wagmi'

import ConnectWalletButton from './ConnectWalletButton'

const Login = () => {
  const router = useRouter()
  const { address, connector, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { switchNetwork } = useSwitchNetwork({
    onError: () => {
      toast.error(t`Please change your network to Polygon!`)
    }
  })

  const setShowCreateChannel = useChannelStore(
    (state) => state.setShowCreateChannel
  )
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )
  const { showSwitchNetwork, setShowSwitchNetwork } = useNetworkStore()

  const onError = () => {
    setLoading(false)
    signOut()
    setActiveChannel(null)
  }

  const { signMessageAsync } = useSignMessage({
    onError
  })

  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache', // if cache old challenge persist issue (InvalidSignature)
    onError
  })
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation()
  const [getAllSimpleProfiles, { error: errorProfiles }] =
    useSimpleProfilesLazyQuery()

  useEffect(() => {
    if (
      errorAuthenticate?.message ??
      errorChallenge?.message ??
      errorProfiles?.message
    ) {
      toast.error(
        errorAuthenticate?.message ??
          errorChallenge?.message ??
          errorProfiles?.message ??
          ERROR_MESSAGE
      )
    }
  }, [errorAuthenticate, errorChallenge, errorProfiles])

  const isReadyToSign = isConnected && !selectedSimpleProfile?.id

  const handleSign = useCallback(async () => {
    if (!isReadyToSign) {
      disconnect?.()
      signOut()
      return toast.error(t`Please connect to your wallet`)
    }
    try {
      setLoading(true)
      const challenge = await loadChallenge({
        variables: { request: { address } }
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
        variables: { request: { address, signature } }
      })
      const accessToken = result.data?.authenticate.accessToken
      const refreshToken = result.data?.authenticate.refreshToken
      signIn({ accessToken, refreshToken })
      const { data: profilesData } = await getAllSimpleProfiles({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'no-cache'
      })
      if (
        !profilesData?.profiles ||
        profilesData?.profiles?.items.length === 0
      ) {
        setActiveChannel(null)
        setSelectedSimpleProfile(null)
        setShowCreateChannel(true)
      } else {
        const profiles = profilesData?.profiles?.items as Profile[]
        const defaultProfile = profiles.find((profile) => profile.isDefault)
        const profile = defaultProfile ?? profiles[0]
        setSelectedSimpleProfile(profile)
        if (router.query?.next) {
          router.push(router.query?.next as string)
        }
      }
      setLoading(false)
      Analytics.track(TRACK.AUTH.SIGN_IN_WITH_LENS)
    } catch (error) {
      signOut()
      setLoading(false)
      toast.error(t`Sign in failed`)
      logger.error('[Error Sign In]', {
        error,
        connector: connector?.name
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    authenticate,
    getAllSimpleProfiles,
    loadChallenge,
    router,
    setActiveChannel,
    setSelectedSimpleProfile,
    setShowCreateChannel,
    signMessageAsync
  ])

  return (
    <>
      <Modal
        title={t`Wrong Network`}
        show={showSwitchNetwork}
        panelClassName="max-w-lg z-50"
        onClose={() => setShowSwitchNetwork(false)}
      >
        <h6 className="py-4">
          <Trans>Connect to the right network to continue</Trans>
        </h6>
        <div className="flex justify-end">
          <Button
            variant="danger"
            onClick={() => {
              if (switchNetwork) {
                switchNetwork(POLYGON_CHAIN_ID)
                setShowSwitchNetwork(false)
              } else {
                toast.error(t`Please change your network to Polygon!`)
              }
            }}
          >
            <Trans>Switch to Polygon</Trans>
          </Button>
        </div>
      </Modal>
      <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
    </>
  )
}

export default Login
