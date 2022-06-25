import usePersistStore from '@lib/store/persist'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { useConnect, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'

interface Props {
  children: ReactNode
  hideHeader?: boolean
}
const AppWrapper: FC<Props> = ({ children }) => {
  const { activeConnector } = useConnect()
  const { activeChain } = useNetwork()
  const { disconnect } = useDisconnect()
  const [pageLoading, setPageLoading] = useState(true)

  const {
    setSelectedChannel,
    selectedChannel,
    isAuthenticated,
    setIsAuthenticated
  } = usePersistStore()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    const logout = () => {
      setIsAuthenticated(false)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('lenstube.store')
      if (disconnect) disconnect()
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
    if (!activeConnector?.id) {
      if (disconnect) disconnect()
      setIsAuthenticated(false)
    }
    activeConnector?.on('change', () => {
      logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, disconnect, activeConnector, setSelectedChannel])

  if (pageLoading) return <FullPageLoader />

  return <>{children}</>
}

export default AppWrapper
