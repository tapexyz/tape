import { getShowFullScreen, getToastOptions } from '@lenstube/browser'
import { AUTH_ROUTES, POLYGON_CHAIN_ID } from '@lenstube/constants'
import { useIsMounted } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useUserProfilesQuery } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, {
  hydrateAuthTokens,
  signOut
} from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
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
  const setChannels = useChannelStore((state) => state.setChannels)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const setSelectedChannelId = useAuthPersistStore(
    (state) => state.setSelectedChannelId
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

  const setUserChannels = (channels: Profile[]) => {
    setChannels(channels)
    const channel = channels.find((ch) => ch.id === selectedChannelId)
    setSelectedChannel(channel ?? channels[0])
    setSelectedChannelId(channel?.id)
  }

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  const { loading } = useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !selectedChannelId,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    },
    onError: () => {
      setSelectedChannelId(null)
    }
  })

  const validateAuthentication = () => {
    if (
      !selectedChannel &&
      !selectedChannelId &&
      AUTH_ROUTES.includes(pathname)
    ) {
      // Redirect to signin page
      replace(`/auth?next=${asPath}`)
    }
    const logout = () => {
      resetAuthState()
      signOut()
      disconnect?.()
    }
    const ownerAddress = selectedChannel?.ownedBy
    const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID
    const isSwitchedAccount =
      ownerAddress !== undefined && ownerAddress !== address
    const { accessToken } = hydrateAuthTokens()
    const shouldLogout =
      !accessToken || isWrongNetworkChain || isSwitchedAccount

    if (shouldLogout && selectedChannelId) {
      logout()
    }
  }

  useEffect(() => {
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, disconnect, selectedChannelId])

  if (loading || !mounted) {
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
        <div
          className={clsx(
            'w-full',
            showFullScreen && 'px-0',
            sidebarCollapsed ? 'md:pl-[90px]' : 'md:pl-[180px]'
          )}
        >
          {!NO_HEADER_PATHS.includes(pathname) && (
            <Header className={clsx(showFullScreen && 'hidden md:flex')} />
          )}
          <div
            className={clsx(
              'ultrawide:px-0',
              showFullScreen && '!p-0',
              pathname !== '/channel/[channel]' &&
                'ultrawide:max-w-[110rem] mx-auto py-4 md:px-3 2xl:py-6'
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
