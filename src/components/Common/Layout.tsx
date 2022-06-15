import useAppStore from '@lib/store'
import { AUTH_ROUTES } from '@utils/constants'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { AUTH } from '@utils/url-path'
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
  hideHeader?: boolean
}

const Layout: FC<Props> = ({ children, hideHeader }) => {
  const { pathname, push } = useRouter()
  const { setSelectedChannel, setIsAuthenticated, isAuthenticated } =
    useAppStore()
  const { resolvedTheme } = useTheme()
  const { activeConnector } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      push(`${AUTH}?next=${pathname}`)
    }
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
    isAuthenticated,
    push
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
          {!hideHeader && <Header />}
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
