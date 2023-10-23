import useAuthPersistStore, {
  hydrateAuthTokens,
  signOut
} from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { getToastOptions, useIsMounted } from '@tape.xyz/browser'
import { AUTH_ROUTES } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import {
  LimitType,
  useCurrentUserSigNoncesQuery,
  useProfilesManagedQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useAccount, useDisconnect } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import TelemetryProvider from './Providers/TelemetryProvider'

interface Props {
  children: ReactNode
  skipNav?: boolean
  skipPadding?: boolean
}

const Layout: FC<Props> = ({ children, skipNav, skipPadding }) => {
  const {
    setLensHubOnchainSigNonce,
    setLensPublicActProxyOnchainSigNonce,
    setLensTokenHandleRegistryOnchainSigNonce
  } = useNonceStore()
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)
  const { selectedSimpleProfile, setSelectedSimpleProfile } =
    useAuthPersistStore()

  const { resolvedTheme } = useTheme()
  const { mounted } = useIsMounted()
  const { address, connector } = useAccount()

  const { pathname, replace, asPath } = useRouter()

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const resetAuthState = () => {
    setActiveProfile(null)
    setSelectedSimpleProfile(null)
  }

  const logout = () => {
    resetAuthState()
    signOut()
    disconnect?.()
  }

  useCurrentUserSigNoncesQuery({
    skip: !selectedSimpleProfile?.id,
    onCompleted: ({ userSigNonces }) => {
      if (!userSigNonces) {
        return logout()
      }
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce)
      setLensTokenHandleRegistryOnchainSigNonce(
        userSigNonces.lensTokenHandleRegistryOnchainSigNonce
      )
      setLensPublicActProxyOnchainSigNonce(
        userSigNonces.lensPublicActProxyOnchainSigNonce
      )
    },
    onError: () => logout()
  })

  useProfilesManagedQuery({
    variables: {
      request: {
        for: address,
        includeOwned: true,
        limit: LimitType.Fifty
      }
    },
    skip: !selectedSimpleProfile,
    onCompleted: ({ profilesManaged }) => {
      const profiles = profilesManaged?.items as Profile[]
      if (!profiles.length) {
        return resetAuthState()
      }
      const profile = profiles.find((ch) => ch.id === selectedSimpleProfile?.id)
      if (profile) {
        setActiveProfile(profile ?? profiles[0])
      }
    },
    onError: () => {
      setSelectedSimpleProfile(null)
      setActiveProfile(null)
    }
  })

  const validateAuthentication = () => {
    if (!selectedSimpleProfile?.id && AUTH_ROUTES.includes(pathname)) {
      // Redirect to login page
      replace(`/login?next=${asPath}`)
    }
    const { accessToken } = hydrateAuthTokens()
    if (!accessToken && selectedSimpleProfile?.id) {
      logout()
    }
  }

  useEffect(() => {
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, selectedSimpleProfile])

  useEffect(() => {
    connector?.addListener('change', () => {
      if (selectedSimpleProfile?.id) {
        logout()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <MobileBottomNav />
      {!skipNav && <Navbar />}
      <div
        className={clsx(
          'relative',
          !skipPadding &&
            'ultrawide:px-8 ultrawide:pb-8 laptop:px-6 laptop:pb-6 px-4 pb-4 pt-5'
        )}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
