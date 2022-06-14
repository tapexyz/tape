import useAppStore from '@lib/store'
import { getToastOptions } from '@utils/functions/getToastOptions'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useConnect, useDisconnect } from 'wagmi'

import Header from './Header'
import Sidebar from './Sidebar'
const CreateChannel = dynamic(() => import('./CreateChannel'))
const MobileBottomNav = dynamic(() => import('./MobileBottomNav'))

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { pathname } = useRouter()
  const { setSelectedChannel, setIsAuthenticated, isAuthenticated } =
    useAppStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const logout = () => {
      setIsAuthenticated(false)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('app-storage')
      disconnect()
    }
    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined'
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }
    if (!activeConnector) {
      disconnect()
    }
    activeConnector?.on('change', () => {
      logout()
    })
  }, [
    setIsAuthenticated,
    disconnect,
    activeConnector,
    setSelectedChannel,
    pathname,
    isAuthenticated
  ])

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
