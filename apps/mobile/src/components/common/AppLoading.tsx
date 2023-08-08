import { Image as ExpoImage } from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

import { useAuth, useCachedResources, useEffect } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const Splash = () => {
  const { height, width } = useWindowDimensions()
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 500, easing: Easing.inOut(Easing.ease) }), // fade out
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }) // fade in
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
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background
      }}
    >
      <Animated.View style={animatedStyle}>
        <ExpoImage
          source={require('assets/splash.png')}
          transition={100}
          contentFit="cover"
          style={{ width, height }}
        />
      </Animated.View>
    </View>
  )
}

export const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const [appLoadingIsVisible, setAppLoadingIsVisible] = useState(true)

  const isCached = useCachedResources()
  const isAuthValidated = useAuth()

  useEffect(() => {
    SplashScreen.hideAsync()
    if (isCached && isAuthValidated) {
      setTimeout(() => {
        setAppLoadingIsVisible(false)
      }, 500)
    }
  }, [isCached, isAuthValidated])

  if (appLoadingIsVisible) {
    return <Splash />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
