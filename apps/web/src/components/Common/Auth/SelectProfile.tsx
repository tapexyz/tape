import Modal from '@components/UIElements/Modal'
import { Analytics, TRACK } from '@lenstube/browser'
import { ERROR_MESSAGE, POLYGON_CHAIN_ID } from '@lenstube/constants'
import { getProfilePicture, logger } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  LimitType,
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery,
  useSimpleProfilesLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore, { signIn, signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import type { Dispatch, FC } from 'react'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'

type Props = {
  show: boolean
  setShow: Dispatch<boolean>
}

const SelectProfile: FC<Props> = ({ show, setShow }) => {
  const [authenticatingId, setAuthenticatingId] = useState<string>()

  const router = useRouter()
  const { chain } = useNetwork()
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
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

  const { data } = useProfilesManagedQuery({
    variables: {
      request: { for: address, includeOwned: true, limit: LimitType.Fifty }
    }
  })

  const profiles = data?.profilesManaged.items as Profile[]

  const isReadyToSign =
    isConnected && chain?.id === POLYGON_CHAIN_ID && !selectedSimpleProfile?.id

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

  const handleSign = useCallback(
    async (profileId: string) => {
      if (!isReadyToSign) {
        disconnect?.()
        signOut()
        return toast.error(t`Please connect to your wallet`)
      }
      try {
        setAuthenticatingId(profileId)
        const challenge = await loadChallenge({
          variables: { request: { for: profileId, signedBy: address } }
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
          setShowCreateChannel(true)
        } else {
          const profiles = profilesData?.profiles?.items as Profile[]
          const profile = profiles.find((profile) => profile.id === profileId)
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
        setAuthenticatingId('')
      }
    },
    [
      address,
      authenticate,
      getAllSimpleProfiles,
      loadChallenge,
      router,
      setActiveChannel,
      setSelectedSimpleProfile,
      setShowCreateChannel,
      signMessageAsync,
      isReadyToSign,
      connector,
      disconnect
    ]
  )

  return (
    <div>
      <Modal
        show={show}
        title={t`Select a Profile`}
        onClose={() => setShow(false)}
        panelClassName="max-w-md"
      >
        <div>
          {profiles?.map((profile) => (
            <button
              type="button"
              className="flex w-full items-center justify-between space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={profile.id}
              disabled={authenticatingId === profile.id}
              onClick={() => handleSign(profile.id)}
            >
              <span className="inline-flex items-center space-x-1.5">
                <img
                  className="h-6 w-6 rounded-full"
                  src={getProfilePicture(profile)}
                  alt={profile.handle}
                  draggable={false}
                />
                <span className="truncate whitespace-nowrap">
                  {profile.handle}
                </span>
              </span>
              {authenticatingId === profile.id && <Loader size="sm" />}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default SelectProfile
