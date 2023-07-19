import * as SplashScreen from 'expo-splash-screen'
import { MotiView } from 'moti'
import type { FC, PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

import { useCachedResources, useEffect, usePlatform } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const Splash = () => {
  const text = 'pripe'
  const FONT_SIZE = 50
  const delay = 100

  const reversedText = useMemo(() => {
    return text.split('').reverse()
  }, [text])
  const { isIOS } = usePlatform()

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <MotiView
        key={text}
        entering={FadeInUp.delay(reversedText.length * delay).springify()}
        exiting={FadeOutUp.delay(reversedText.length * delay).springify()}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          loop: true,
          duration: 700,
          repeatReverse: true,
          delay: reversedText.length * delay
        }}
        style={{
          backgroundColor: 'gold',
          width: (FONT_SIZE ?? 94) / 6,
          height: (FONT_SIZE ?? 94) / 6,
          marginLeft: 25,
          marginBottom: 7
        }}
      />
      <View>
        {reversedText.map((char, index) => {
          return (
            <Animated.View
              key={`char_${char}_index_${index}}`}
              entering={FadeInUp.delay(
                (reversedText.length - index) * delay
              ).springify()}
              exiting={FadeOutUp.delay(
                (reversedText.length - index) * delay
              ).springify()}
            >
              <Animated.Text
                style={{
                  fontWeight: 'bold',
                  color: theme.colors.white,
                  fontSize: FONT_SIZE,
                  marginVertical: -FONT_SIZE / 8,
                  lineHeight: FONT_SIZE,
                  transform: [{ rotate: '-90deg' }],
                  textAlign: 'center',
                  fontFamily: isIOS ? 'Menlo' : 'Roboto'
                }}
              >
                {char}
              </Animated.Text>
            </Animated.View>
          )
        })}
      </View>
    </View>
  )
}

export const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const isLoadingComplete = useCachedResources()

  useEffect(() => {
    if (isLoadingComplete !== null) {
      SplashScreen.hideAsync()
    }
  }, [isLoadingComplete])

  if (!isLoadingComplete) {
    return <Splash />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
