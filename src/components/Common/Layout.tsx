import { useQuery } from '@apollo/client'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  MIXPANEL_API_HOST,
  MIXPANEL_TOKEN,
  POLYGON_CHAIN_ID
} from '@utils/constants'
import { AUTH_ROUTES } from '@utils/data/auth-routes'
import { getShowFullScreen } from '@utils/functions/getShowFullScreen'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { PROFILES_QUERY } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import { AUTH } from '@utils/url-path'
import clsx from 'clsx'
import mixpanel from 'mixpanel-browser'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
const Header = dynamic(() => import('./Header'), {
  suspense: true
})
const Sidebar = dynamic(() => import('./Sidebar'), {
  suspense: true
})

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
  const { pathname, replace, asPath } = useRouter()
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setChannels = useAppStore((state) => state.setChannels)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setIsAuthenticated = usePersistStore(
    (state) => state.setIsAuthenticated
  )
  const setIsSignedUser = usePersistStore((state) => state.setIsSignedUser)
  const isSignedUser = usePersistStore((state) => state.isSignedUser)
  const isAuthenticated = usePersistStore((state) => state.isAuthenticated)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { resolvedTheme } = useTheme()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { mounted } = useIsMounted()
  const { address, isDisconnected } = useAccount()

  const { loading } = useQuery(PROFILES_QUERY, {
    variables: { ownedBy: address },
    skip: !isAuthenticated,
    onCompleted(data) {
      const channels: Profile[] = data?.profiles?.items
      if (channels.length === 0) {
        setSelectedChannel(null)
        setSelectedChannelId(null)
      } else {
        setChannels(channels)
        setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
        const selectedChannel = channels.find(
          (channel) => channel.id === selectedChannelId
        )
        setSelectedChannel(selectedChannel ?? channels[0])
        setSelectedChannelId(selectedChannel?.id)
      }
    }
  })

  useEffect(() => {
    // Allow only user is authenticated
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      replace(`${AUTH}?next=${asPath}`)
    }
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    const logout = () => {
      setIsAuthenticated(false)
      setIsSignedUser(false)
      setSelectedChannelId(null)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('lenstube.store')
      if (disconnect) disconnect()
    }

    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined' &&
      selectedChannelId &&
      chain?.id === POLYGON_CHAIN_ID
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }
    if (isDisconnected && mounted) {
      if (disconnect) disconnect()
      setIsAuthenticated(false)
      setIsSignedUser(false)
    }
    const ownerAddress = selectedChannel?.ownedBy
    if (ownerAddress !== undefined && ownerAddress !== address) {
      logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    isDisconnected,
    address,
    chain,
    selectedChannel,
    disconnect,
    setSelectedChannel,
    isSignedUser
  ])

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
          '!pb-0': getShowFullScreen(pathname)
        })}
      >
        <Sidebar />
        <div
          className={clsx(
            'w-full md:pl-[94px] md:pr-4 max-w-[110rem] mx-auto',
            {
              'px-0': getShowFullScreen(pathname),
              'pl-2 pr-2': !getShowFullScreen(pathname)
            }
          )}
        >
          {!NO_HEADER_PATHS.includes(pathname) && (
            <Header
              className={getShowFullScreen(pathname) ? 'hidden md:flex' : ''}
            />
          )}
          <div
            className={clsx('py-2', {
              '!p-0': getShowFullScreen(pathname)
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
