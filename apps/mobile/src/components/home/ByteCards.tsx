import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Gyroscope } from 'expo-sensors'
import React, { useCallback, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import { useNotifications } from '../../hooks'

const ByteCards = () => {
  const { notify } = useNotifications()

  const prevGyroValue = useSharedValue({
    x: 0,
    y: 0
  })
  const gyroValue = useSharedValue({
    x: 0,
    y: 0
  })

  const derivedTranslations = useDerivedValue(() => {
    'worklet'
    const MAX_X = 40
    const MAX_Y = 40

    let newX = prevGyroValue.value.x + gyroValue.value.y * -2
    let newY = prevGyroValue.value.y + gyroValue.value.x * -2

    if (Math.abs(newX) >= MAX_X) {
      newX = prevGyroValue.value.x
    }
    if (Math.abs(newY) >= MAX_Y) {
      newY = prevGyroValue.value.y
    }
    prevGyroValue.value = {
      x: newX,
      y: newY
    }
    return {
      x: newX,
      y: newY
    }
  }, [gyroValue.value])

  useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y }) => {
      gyroValue.value = { x, y }
    })
    return () => {
      subscription.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gyroValue.value])

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      const inputRange = [-100, 0, 100]
      const outputRange = [-20, 0, 20]
      return {
        width: 200,
        aspectRatio: 9 / 16,
        borderRadius: 10,
        overflow: 'hidden',
        transform: [
          {
            translateX: withSpring(
              interpolate(derivedTranslations.value.x, inputRange, outputRange)
            )
          },
          {
            translateY: withSpring(
              interpolate(derivedTranslations.value.y, inputRange, outputRange)
            )
          }
        ]
      }
    })
  }

  const renderCard = useCallback((source: string) => {
    return (
      <LinearGradient
        style={{ padding: 0.5 }}
        colors={['gray', 'transparent']}
        start={{ x: 0.7, y: 1 }}
        end={{ x: 0.2, y: 0.9 }}
      >
        <ExpoImage
          source={source}
          contentFit="cover"
          style={{ width: '100%', height: '100%', borderRadius: 10 }}
        />
      </LinearGradient>
    )
  }, [])
  return (
    <View
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
      }}
    >
      <Pressable
        style={{
          position: 'absolute',
          left: 15,
          width: 140,
          aspectRatio: 9 / 16,
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        {renderCard('https://picsum.photos/seed/697/1700/3000')}
      </Pressable>
      <Pressable
        style={{
          position: 'absolute',
          right: 15,
          width: 140,
          aspectRatio: 9 / 16,
          borderRadius: 10,
          overflow: 'hidden'
        }}
      >
        {renderCard('https://picsum.photos/seed/698/1700/3000')}
      </Pressable>
      <Pressable
        onPress={() => {
          notify('success', {
            params: {
              title: 'Hello',
              description: 'Wow, that was easy',
              hideCloseButton: true
            }
          })
        }}
      >
        <Animated.View style={AnimatedStyles.motion}>
          {renderCard('https://picsum.photos/seed/699/1700/3000')}
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default ByteCards
