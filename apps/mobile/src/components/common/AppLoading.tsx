import { Image as ExpoImage } from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

import { useAuth, useCachedResources, useEffect } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const Splash = () => {
  const { height, width } = useWindowDimensions()

  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  useEffect(() => {
    // 3 times scale
    scale.value = withTiming(3, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease)
    })
    opacity.value = withTiming(0, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease)
    })
  }, [scale, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
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
          style={[{ width, height }]}
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
