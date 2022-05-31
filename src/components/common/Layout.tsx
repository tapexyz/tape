import CreateChannel from '@components/common/CreateChannel'
import Header from '@components/common/Header'
import MobileBottomNav from '@components/common/MobileBottomNav'
import Sidebar from '@components/common/Sidebar'
import useAppStore from '@lib/store'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useConnect, useDisconnect, useProvider } from 'wagmi'

import IsBrowser from './IsBrowser'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { setSelectedChannel, setToken } = useAppStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector, isDisconnected } = useConnect()
  const { disconnect } = useDisconnect()
  const provider = useProvider()

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    disconnect()
    setToken({ access: null, refresh: null })
    setSelectedChannel(null)
    localStorage.removeItem('app-storage')
  }, [setToken, disconnect, setSelectedChannel])

  useEffect(() => {
    setToken({
      access: localStorage.getItem('accessToken') || null,
      refresh: localStorage.getItem('refreshToken') || null
    })
    provider.on('network', (_newNetwork, oldNetwork) => {
      if (oldNetwork) logout()
    })
    activeConnector?.on('disconnect', () => logout())
    if (isDisconnected) logout()
  }, [setToken, activeConnector, disconnect, isDisconnected, logout, provider])

  return (
    <IsBrowser>
      <div className="flex pb-14 md:pb-0">
        <Sidebar />
        <CreateChannel />
        <div className="w-full pl-2 md:pl-[84px] pr-2 md:pr-4 max-w-[200rem] mx-auto">
          <Header />
          <div className="pt-16">{children}</div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <MobileBottomNav />
    </IsBrowser>
  )
}

export default Layout
