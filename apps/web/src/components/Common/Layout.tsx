import {
  getToastOptions,
  setFingerprint,
  useIsMounted
} from '@dragverse/browser'
import { AUTH_ROUTES, OWNER_ONLY_ROUTES } from '@dragverse/constants'
import { getIsProfileOwner, trimify } from '@dragverse/generic'
import type { Profile } from '@dragverse/lens'
import { useCurrentProfileQuery } from '@dragverse/lens'
import { type CustomErrorWithData } from '@dragverse/lens/custom-types'
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId'
import { hydrateAuthTokens, signOut } from '@lib/store/auth'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
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
  const { setLensHubOnchainSigNonce } = useNonceStore()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)

  const isMounted = useIsMounted()
  const { resolvedTheme, setTheme } = useTheme()
  const { address, connector } = useAccount()
  const { pathname, replace, asPath } = useRouter()
  const currentSessionProfileId = getCurrentSessionProfileId()

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      return
    }
    setTheme('dark')
  }, [])

  const logout = () => {
    setActiveProfile(null)
    signOut()
    disconnect?.()
  }

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: currentSessionProfileId } },
    skip: trimify(currentSessionProfileId).length === 0,
    onCompleted: ({ userSigNonces, profile }) => {
      if (!profile) {
        return logout()
      }

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
      if (activeProfile?.id) {
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
          'relative focus-visible:outline-none',
          !skipPadding &&
            'ultrawide:px-8 ultrawide:pb-8 laptop:px-6 px-4 pb-16 pt-5 md:pb-6'
        )}
      >
        {children}
      </div>
      <footer className="bg-brand-850 dark:bg-brand-850 hidden py-4 text-center md:block">
        <p className="text-brand-50 dark:text-brand-50 text-sm">
          We are a decentralized open-source social network built by and for the
          Drag community, brick by brick, to create content and share their
          artistry.🌈 Powered with{' '}
          <a
            href="https://tape.xyz"
            className="text-blue-500 hover:text-blue-700"
          >
            {' '}
            tape.xyz{' '}
          </a>
        </p>
      </footer>
      <MobileBottomNav />
    </>
  )
}

export default Layout
