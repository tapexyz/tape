import getCurrentSession from '@lib/getCurrentSession'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import {
  getToastOptions,
  setFingerprint,
  tw,
  useIsMounted
} from '@tape.xyz/browser'
import { AUTH_ROUTES, OWNER_ONLY_ROUTES } from '@tape.xyz/constants'
import { getIsProfileOwner, trimify } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useCurrentProfileQuery } from '@tape.xyz/lens'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import MetaTags from './MetaTags'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'

interface Props {
  children: ReactNode
  skipNav?: boolean
  skipBottomNav?: boolean
  skipPadding?: boolean
}

const Layout: FC<Props> = ({
  children,
  skipNav,
  skipBottomNav,
  skipPadding
}) => {
  const { setLensHubOnchainSigNonce } = useNonceStore()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)

  const isMounted = useIsMounted()
  const { resolvedTheme } = useTheme()
  const { address } = useAccount()
  const { pathname, replace, asPath } = useRouter()
  const currentSession = getCurrentSession()

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: currentSession?.profileId } },
    skip: trimify(currentSession?.profileId).length === 0,
    onCompleted: ({ userSigNonces, profile }) => {
      if (!profile) {
        return signOut()
      }

      setActiveProfile(profile as Profile)
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce)
    },
    onError: () => signOut()
  })

  const validateAuthRoutes = () => {
    if (!currentSession?.profileId && AUTH_ROUTES.includes(pathname)) {
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
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    validateAuthRoutes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, currentSession?.profileId, activeProfile])

  if (!isMounted()) {
    return <MetaTags />
  }

  if (!activeProfile && loading) {
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
        className={tw('relative focus-visible:outline-none', {
          'ultrawide:px-8 laptop:px-6 ultrawide:pb-8 px-4 pb-6 pt-20':
            !skipPadding
        })}
      >
        {children}
      </div>
      {!skipBottomNav && <MobileBottomNav />}
    </>
  )
}

export default Layout
