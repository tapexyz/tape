import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  MIXPANEL_API_HOST,
  MIXPANEL_TOKEN,
  POLYGON_CHAIN_ID
} from '@utils/constants'
import { AUTH_ROUTES } from '@utils/data/auth-routes'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import { getIsAuthTokensAvailable } from '@utils/functions/getIsAuthTokensAvailable'
import { getShowFullScreen } from '@utils/functions/getShowFullScreen'
import { getToastOptions } from '@utils/functions/getToastOptions'
import useIsMounted from '@utils/hooks/useIsMounted'
import { AUTH } from '@utils/url-path'
import clsx from 'clsx'
import mixpanel from 'mixpanel-browser'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import type { Profile } from 'src/types/lens'
import { useUserProfilesQuery } from 'src/types/lens'
import type { CustomErrorWithData } from 'src/types/local'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import Header from './Header'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
}
const NO_HEADER_PATHS = [AUTH]

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_API_HOST
  })
}

const Layout: FC<Props> = ({ children }) => {
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setChannels = useAppStore((state) => state.setChannels)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { chain } = useNetwork()
  const { resolvedTheme } = useTheme()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { mounted } = useIsMounted()
  const { address, isDisconnected } = useAccount()
  const { pathname, replace, asPath } = useRouter()
  const showFullScreen = getShowFullScreen(pathname)

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  const setUserChannels = (channels: Profile[]) => {
    setChannels(channels)
    const selectedChannel = channels.find(
      (channel) => channel.id === selectedChannelId
    )
    setSelectedChannel(selectedChannel ?? channels[0])
    setSelectedChannelId(selectedChannel?.id)
  }

  const { loading } = useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !selectedChannelId,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) return resetAuthState()
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    }
  })

  const validateAuthentication = () => {
    if (
      !selectedChannel &&
      !selectedChannelId &&
      AUTH_ROUTES.includes(pathname)
    ) {
      replace(`${AUTH}?next=${asPath}`) // redirect to signin page
    }
    const logout = () => {
      resetAuthState()
      clearLocalStorage()
      disconnect?.()
    }
    const ownerAddress = selectedChannel?.ownedBy
    const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID
    const isSwitchedAccount =
      ownerAddress !== undefined && ownerAddress !== address
    const shouldLogout =
      !getIsAuthTokensAvailable() ||
      isWrongNetworkChain ||
      isDisconnected ||
      isSwitchedAccount

    if (shouldLogout && selectedChannelId) {
      logout()
    }
  }

  useEffect(() => {
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected, address, chain, disconnect, selectedChannelId])

  if (loading || !mounted) return <FullPageLoader />

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
      <div
        className={clsx('flex pb-10 md:pb-0', {
          '!pb-0': showFullScreen
        })}
      >
        <Sidebar />
        <div
          className={clsx(
            'w-full',
            showFullScreen ? 'px-0' : '',
            sidebarCollapsed || pathname === '/watch/[id]'
              ? 'md:pl-[90px]'
              : 'md:pl-[180px]'
          )}
        >
          {!NO_HEADER_PATHS.includes(pathname) && (
            <Header className={showFullScreen ? 'hidden md:flex' : ''} />
          )}
          <div
            className={clsx('py-6 ultrawide:max-w-[110rem] mx-auto md:px-2', {
              '!p-0': showFullScreen
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
