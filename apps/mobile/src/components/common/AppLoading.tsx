import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { useMobilePersistStore } from '~/store/persist'

import { useCachedResources } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const [appLoadingIsVisible, setAppLoadingIsVisible] = useState(true)
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const isCached = useCachedResources()

  useEffect(() => {
    SplashScreen.hideAsync()
    if (isCached) {
      // const timer = selectedProfile ? 50 : 500
      // setTimeout(() => {
      setAppLoadingIsVisible(false)
      // }, timer)
    }
  }, [isCached, selectedProfile])

  if (appLoadingIsVisible) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default AppLoading
