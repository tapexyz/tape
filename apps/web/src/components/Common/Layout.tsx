import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId'
import { hydrateAuthTokens, signOut } from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import {
  getToastOptions,
  setFingerprint,
  useIsMounted
} from '@tape.xyz/browser'
import { AUTH_ROUTES, OWNER_ONLY_ROUTES } from '@tape.xyz/constants'
import { getIsProfileOwner } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useCurrentProfileQuery } from '@tape.xyz/lens'
import { type CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { isAddress } from 'viem'
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
  const { setLensHubOnchainSigNonce } = useNonceStore()
  const { activeProfile, setActiveProfile } = useProfileStore()

  const isMounted = useIsMounted()
  const { resolvedTheme } = useTheme()
  const { address, connector } = useAccount()
  const { pathname, replace, asPath } = useRouter()
  const currentSessionProfileId = getCurrentSessionProfileId()

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const logout = () => {
    setActiveProfile(null)
    signOut()
    disconnect?.()
  }

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: currentSessionProfileId } },
    skip: isAddress(currentSessionProfileId),
    onCompleted: ({ userSigNonces, profile }) => {
      setActiveProfile(profile as Profile)
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce)
    },
    onError: () => logout()
  })

  const validateAuthRoutes = () => {
    if (!currentSessionProfileId && AUTH_ROUTES.includes(pathname)) {
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

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens()
    if (!accessToken) {
      logout()
    }
  }

  useEffect(() => {
    validateAuthRoutes()
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, currentSessionProfileId, activeProfile])

  useEffect(() => {
    setFingerprint()
    connector?.addListener('change', () => {
      if (currentSessionProfileId) {
        logout()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isMounted()) {
    return <MetaTags />
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <>
      <MetaTags />
      <Toaster
        position="bottom-right"
        containerStyle={{ wordBreak: 'break-word' }}
        toastOptions={getToastOptions(resolvedTheme)}
      />
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
      <MobileBottomNav />
    </>
  )
}

export default Layout
