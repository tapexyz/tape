import useAuthPersistStore, {
  hydrateAuthTokens,
  signOut
} from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { getToastOptions, useIsMounted } from '@tape.xyz/browser'
import { AUTH_ROUTES, OWNER_ONLY_ROUTES } from '@tape.xyz/constants'
import { getIsProfileOwner } from '@tape.xyz/generic'
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
import MetaTags from './MetaTags'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'

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
  const { activeProfile, setActiveProfile } = useProfileStore()
  const { selectedSimpleProfile, setSelectedSimpleProfile } =
    useAuthPersistStore()

  const isMounted = useIsMounted()
  const { resolvedTheme } = useTheme()
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

  const validateAuthRoutes = () => {
    if (!selectedSimpleProfile?.id && AUTH_ROUTES.includes(pathname)) {
      replace(`/login?next=${asPath}`)
    }
    if (
      activeProfile &&
      address &&
      !getIsProfileOwner(activeProfile, address) &&
      OWNER_ONLY_ROUTES.includes(pathname)
    ) {
      replace('/settings')
    }
  }

  useEffect(() => {
    validateAuthRoutes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, selectedSimpleProfile, activeProfile])

  const validateAuthentication = () => {
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

  if (!isMounted()) {
    return <FullPageLoader />
  }

  return (
    <>
      <MetaTags />
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <MobileBottomNav />
      {!skipNav && <Navbar />}
      <div
        className={clsx(
          'relative',
          !skipPadding &&
            'ultrawide:px-8 ultrawide:pb-8 laptop:px-6 px-4 pb-14 pt-5 md:pb-6'
        )}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
