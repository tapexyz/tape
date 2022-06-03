import CreateChannel from '@components/Common/CreateChannel'
import Header from '@components/Common/Header'
import MobileBottomNav from '@components/Common/MobileBottomNav'
import Sidebar from '@components/Common/Sidebar'
import useAppStore from '@lib/store'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useConnect, useDisconnect } from 'wagmi'

import IsBrowser from './IsBrowser'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { setSelectedChannel, setToken } = useAppStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector, isReconnecting } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    setToken({
      access: localStorage.getItem('accessToken') || null,
      refresh: localStorage.getItem('refreshToken') || null
    })
    const logout = () => {
      disconnect()
      setToken({ access: null, refresh: null })
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
    activeConnector?.on('change', () => {
      if (!isReconnecting) logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect, activeConnector])

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
