import { useQuery } from '@apollo/client'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Profile } from 'src/types'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'

interface Props {
  children: ReactNode
  hideHeader?: boolean
}
const AppWrapper: FC<Props> = ({ children }) => {
  const [pageLoading, setPageLoading] = useState(true)
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { address, connector } = useAccount()
  const { setChannels, setUserSigNonce } = useAppStore()

  const {
    setSelectedChannel,
    selectedChannel,
    isAuthenticated,
    setIsAuthenticated
  } = usePersistStore()

  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: address },
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
      chain?.id === POLYGON_CHAIN_ID
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }
    if (!connector?.id) {
      if (disconnect) disconnect()
      setIsAuthenticated(false)
    }
    connector?.on('change', () => {
      logout()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, disconnect, connector, setSelectedChannel])

  if (loading || pageLoading) return <FullPageLoader />

  return <>{children}</>
}

export default AppWrapper
