import useAppStore from '@lib/store'
import { getToastOptions } from '@utils/functions/getToastOptions'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useConnect, useDisconnect } from 'wagmi'

import Header from './Header'
import Sidebar from './Sidebar'
const Upload = dynamic(() => import('../Common/Upload'))
const CreateChannel = dynamic(() => import('./CreateChannel'))
const MobileBottomNav = dynamic(() => import('./MobileBottomNav'))

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { setSelectedChannel, setIsAuthenticated } = useAppStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken && refreshToken !== 'undefined') {
      setIsAuthenticated(true)
    }
    const logout = () => {
      setIsAuthenticated(false)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('app-storage')
      disconnect()
    }
    if (!activeConnector?.id) {
      disconnect()
    }
    activeConnector?.on('disconnect', () => {
      logout()
    })
  }, [setIsAuthenticated, disconnect, activeConnector, setSelectedChannel])

  return (
    <>
      <div className="flex pb-14 md:pb-0">
        <Sidebar />
        <CreateChannel />
        <Upload />
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
    </>
  )
}

export default Layout
