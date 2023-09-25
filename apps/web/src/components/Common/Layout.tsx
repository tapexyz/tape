import { getShowFullScreen, getToastOptions } from '@lenstube/browser'
import { AUTH_ROUTES, POLYGON_CHAIN_ID } from '@lenstube/constants'
import { useIsMounted } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useProfilesQuery, useUserSigNoncesQuery } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, {
  hydrateAuthTokens,
  signOut
} from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import Header from './Header'
import TelemetryProvider from './Providers/TelemetryProvider'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
}

const NO_HEADER_PATHS = ['/auth']

const Layout: FC<Props> = ({ children }) => {
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const setActiveChannel = useChannelStore((state) => state.setActiveChannel)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const setSelectedSimpleProfile = useAuthPersistStore(
    (state) => state.setSelectedSimpleProfile
  )

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

  const showFullScreen = getShowFullScreen(pathname)

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
    const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID
    const isSwitchedAccount =
      ownerAddress !== undefined && ownerAddress !== address
    const { accessToken } = hydrateAuthTokens()
    const shouldLogout =
      !accessToken || isWrongNetworkChain || isSwitchedAccount

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
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#000000' : '#ffffff'}
        />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <TelemetryProvider />
      <div className={clsx('flex pb-10 md:pb-0', showFullScreen && '!pb-0')}>
        <Sidebar />
        <div className={clsx('w-full md:pl-[90px]', showFullScreen && 'px-0')}>
          {!NO_HEADER_PATHS.includes(pathname) && (
            <Header className={clsx(showFullScreen && 'hidden md:flex')} />
          )}
          <div
            className={clsx(
              'ultrawide:px-0',
              showFullScreen && '!p-0',
              pathname !== '/channel/[channel]' &&
                'ultrawide:max-w-[90rem] mx-auto p-2 md:p-4 2xl:py-6'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
