import { useQuery } from '@apollo/client'
import CreateChannel from '@components/common/CreateChannel'
import Header from '@components/common/Header'
import MobileBottomNav from '@components/common/MobileBottomNav'
import Sidebar from '@components/common/Sidebar'
import useAppStore from '@lib/store'
import { getToastOptions } from '@utils/functions/getToastOptions'
import {
  CURRENT_USER_QUERY,
  NOTIFICATION_COUNT_QUERY
} from '@utils/gql/queries'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useConnect, useDisconnect, useProvider } from 'wagmi'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const {
    token,
    setChannels,
    setSelectedChannel,
    setToken,
    selectedChannel,
    setNotificationCount,
    notificationCount,
    setHasNewNotification
  } = useAppStore()
  const { resolvedTheme } = useTheme()
  const { data: accountData } = useAccount()
  const { activeConnector, isDisconnected } = useConnect()
  const { disconnect } = useDisconnect()
  const provider = useProvider()

  const {} = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: accountData?.address },
    skip: !token?.refresh,
    onCompleted(data) {
      const profiles: Profile[] = data?.profiles?.items
      setChannels(profiles)
      setSelectedChannel(profiles[0])
    }
  })

  const { data: notificationsData } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: selectedChannel?.id } },
    pollInterval: 50000,
    skip: !selectedChannel?.id
  })

  useEffect(() => {
    if (selectedChannel && notificationsData) {
      setHasNewNotification(
        notificationCount !==
          notificationsData?.notifications?.pageInfo?.totalCount
      )
      setNotificationCount(
        notificationsData?.notifications?.pageInfo?.totalCount
      )
    }
  }, [
    selectedChannel,
    notificationsData,
    notificationCount,
    setHasNewNotification,
    setNotificationCount
  ])

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
    <>
      <Header />
      <div className="flex py-14">
        <Sidebar />
        <CreateChannel />
        <div className="w-full py-4 pl-2 md:pl-[88px] pr-2 md:pr-6 max-w-[200rem] mx-auto">
          {children}
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
