import { Image as ExpoImage } from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

import { useMobilePersistStore } from '~/store/persist'

import {
  useAuth,
  useCachedResources,
  useEffect,
  useMobileTheme
} from '../../hooks'

SplashScreen.preventAutoHideAsync()

const Splash = () => {
  const { height, width } = useWindowDimensions()
  const opacity = useSharedValue(1)
  const { themeConfig } = useMobileTheme()

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }), // fade out
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }) // fade in
      ),
      -1,
      true
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeConfig.backgroudColor
      }}
    >
      <Animated.View style={animatedStyle}>
        <ExpoImage
          source={require('assets/splash.png')}
          contentFit="cover"
          style={{ width, height }}
        />
      </Animated.View>
    </Animated.View>
  )
}

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const [appLoadingIsVisible, setAppLoadingIsVisible] = useState(true)
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const isCached = useCachedResources()
  const isAuthValidated = useAuth()

  useEffect(() => {
    SplashScreen.hideAsync()
    if (isCached && isAuthValidated) {
      const timer = selectedChannelId ? 50 : 500
      setTimeout(() => {
        setAppLoadingIsVisible(false)
      }, timer)
    }
  }, [isCached, isAuthValidated, selectedChannelId])

  if (appLoadingIsVisible) {
    return <Splash />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default AppLoading
