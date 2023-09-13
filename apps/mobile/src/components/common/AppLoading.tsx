import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useEffect } from 'react'

import { useCachedResources } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const isCached = useCachedResources()

  useEffect(() => {
    if (isCached) {
      SplashScreen.hideAsync()
    }
  }, [isCached])

  if (!isCached) {
    return null
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default AppLoading
