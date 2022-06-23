import { useQuery } from '@apollo/client'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { AUTH_ROUTES, POLYGON_CHAIN_ID } from '@utils/constants'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import { AUTH } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import Header from './Header'
import Sidebar from './Sidebar'
const CreateChannel = dynamic(() => import('./CreateChannel'))
const MobileBottomNav = dynamic(() => import('./MobileBottomNav'))

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { pathname, replace, asPath } = useRouter()
  const { setChannels, setUserSigNonce } = useAppStore()
  const {
    setSelectedChannel,
    selectedChannel,
    setIsAuthenticated,
    isAuthenticated
  } = usePersistStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector } = useConnect()
  const { activeChain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { mounted } = useIsMounted()
  const { data: account } = useAccount()
  const [pageLoading, setPageLoading] = useState(true)
  const isSignInPage = pathname === AUTH

  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: account?.address },
    skip: !isAuthenticated,
    onCompleted(data) {
      const channels: Profile[] = data?.profiles?.items
      if (channels.length === 0) {
        setSelectedChannel(null)
      } else {
        setChannels(channels)
        setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
        if (!selectedChannel) setSelectedChannel(channels[0])
      }
    }
  })

  useEffect(() => {
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      replace(`${AUTH}?next=${asPath}`)
    }
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const logout = () => {
      setIsAuthenticated(false)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('lenstube.store')
      disconnect && disconnect()
    }
    setPageLoading(false)
    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined' &&
      selectedChannel &&
      activeChain?.id === POLYGON_CHAIN_ID
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }
    if (!activeConnector?.id && mounted) {
      disconnect && disconnect()
      setIsAuthenticated(false)
    }
    activeConnector?.on('change', () => {
      logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, disconnect, activeConnector, setSelectedChannel])

  if (loading || pageLoading) return <FullPageLoader />

  return (
    <>
      <div className="flex pb-14 md:pb-0">
        <Sidebar />
        <CreateChannel />
        <div
          className={clsx(
            'w-full md:pl-[94px] pl-2 pr-2 md:pr-4 max-w-[110rem] mx-auto'
          )}
        >
          {!isSignInPage && <Header />}
          <div className="pt-16">{children}</div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <MobileBottomNav />
    </>
  )
}

export default Layout
