import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, useEffect } from 'react'

import { useMobilePersistStore } from '~/store/persist'

import { useCachedResources } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const isCached = useCachedResources()

  useEffect(() => {
    if (isCached) {
      SplashScreen.hideAsync()
    }
  }, [isCached, selectedProfile])

  if (!isCached) {
    return null
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default AppLoading
