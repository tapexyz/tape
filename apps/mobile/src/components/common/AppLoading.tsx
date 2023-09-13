import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useCallback } from 'react'
import { View } from 'react-native'

import { useCachedResources } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const isCached = useCachedResources()

  const onLayoutRootView = useCallback(async () => {
    if (isCached) {
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 1000)
    }
  }, [isCached])

  if (!isCached) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {children}
    </View>
  )
}

export default AppLoading
