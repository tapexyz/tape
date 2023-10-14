import useAuthPersistStore, {
  hydrateAuthTokens,
  signOut
} from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { getToastOptions, useIsMounted } from '@tape.xyz/browser'
import { AUTH_ROUTES } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import { useProfilesQuery, useUserSigNoncesQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import Navbar from './Navbar'
import TelemetryProvider from './Providers/TelemetryProvider'

interface Props {
  children: ReactNode
  skipNav?: boolean
  skipPadding?: boolean
}

const Layout: FC<Props> = ({ children, skipNav, skipPadding }) => {
  const { setUserSigNonce, setActiveChannel } = useChannelStore()
  const { selectedSimpleProfile, setSelectedSimpleProfile } =
    useAuthPersistStore()

  const { chain } = useNetwork()
  const { resolvedTheme } = useTheme()
  const { mounted } = useIsMounted()
  const { address } = useAccount()

  const { pathname, replace, asPath } = useRouter()

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const resetAuthState = () => {
    setActiveChannel(null)
    setSelectedSimpleProfile(null)
  }

  useUserSigNoncesQuery({
    skip: !selectedSimpleProfile?.id,
    onCompleted: ({ userSigNonces }) => {
      setUserSigNonce(userSigNonces.lensHubOnchainSigNonce)
    },
    pollInterval: 10_000
  })

  useProfilesQuery({
    variables: {
      request: { where: { ownedBy: [address] } }
    },
    skip: !selectedSimpleProfile,
    onCompleted: ({ profiles }) => {
      const channels = profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      const profile = channels.find((ch) => ch.id === selectedSimpleProfile?.id)
      if (profile) {
        setActiveChannel(profile ?? channels[0])
      }
    },
    onError: () => {
      setSelectedSimpleProfile(null)
      setActiveChannel(null)
    }
  })

  const validateAuthentication = () => {
    if (!selectedSimpleProfile && AUTH_ROUTES.includes(pathname)) {
      // Redirect to signin page
      replace(`/auth?next=${asPath}`)
    }
    const ownerAddress = selectedSimpleProfile?.ownedBy.address
    const isSwitchedAccount =
      ownerAddress !== undefined && ownerAddress !== address
    const { accessToken } = hydrateAuthTokens()
    const shouldLogout = !accessToken || isSwitchedAccount

    if (shouldLogout && selectedSimpleProfile?.id) {
      resetAuthState()
      signOut()
      disconnect?.()
    }
  }

  useEffect(() => {
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, disconnect, selectedSimpleProfile])

  if (!mounted) {
    return <FullPageLoader />
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <TelemetryProvider />
      {!skipNav && <Navbar />}
      <div
        className={clsx(
          'relative',
          !skipPadding &&
            'ultrawide:px-8 ultrawide:pb-8 laptop:px-6 laptop:pb-6 px-4 pb-4 pt-24'
        )}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
