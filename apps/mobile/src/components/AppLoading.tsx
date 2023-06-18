import * as SplashScreen from 'expo-splash-screen'
import type { FC } from 'react'

import { useCachedResources, useEffect } from '../hooks'

SplashScreen.preventAutoHideAsync()

export const AppLoading: FC<any> = ({ children }) => {
  const isLoadingComplete = useCachedResources()

  useEffect(() => {
    if (isLoadingComplete !== null) {
      SplashScreen.hideAsync()
    }
  }, [isLoadingComplete])

  if (!isLoadingComplete) {
    return null
  }

  return children
}
