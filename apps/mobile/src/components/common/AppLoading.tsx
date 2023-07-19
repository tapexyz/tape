import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useMemo } from 'react'

import { useCachedResources, useEffect, usePlatform } from '../../hooks'

SplashScreen.preventAutoHideAsync()

import { MotiView } from 'moti'
import { View } from 'react-native'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

function Splash({ text, dotColor }: { text: string; dotColor?: string }) {
  const FONT_SIZE = 50
  const _delay = 100
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
        entering={FadeInUp.delay(reversedText.length * _delay).springify()}
        exiting={FadeOutUp.delay(reversedText.length * _delay).springify()}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          loop: true,
          duration: 700,
          repeatReverse: true,
          delay: reversedText.length * _delay
        }}
        style={{
          backgroundColor: dotColor || 'lime',
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
                (reversedText.length - index) * _delay
              ).springify()}
              exiting={FadeOutUp.delay(
                (reversedText.length - index) * _delay
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
    return <Splash text="pripe" dotColor="gold" />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}
