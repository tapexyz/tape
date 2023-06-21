import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Gyroscope } from 'expo-sensors'
import React, { useCallback, useEffect } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import Container from '../components/Container'
import { theme } from '../constants/theme'
import { useNotifications } from '../hooks'

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: { navigate }
  } = props
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
        justifyContent: 'center',
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

  const renderCard = React.useMemo(() => {
    return (
      <LinearGradient
        style={{ padding: 0.5 }}
        colors={['gray', 'silver']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <ExpoImage
          source="https://picsum.photos/seed/696/3000/2000"
          contentFit="cover"
          style={{ width: '100%', height: '100%', borderRadius: 10 }}
        />
      </LinearGradient>
    )
  }, [])

  const navigateToDetails = useCallback(() => {
    navigate('Details', { id: 'home-id' })
  }, [navigate])

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Pressable
            style={{
              position: 'absolute',
              left: 10,
              justifyContent: 'center',
              width: 150,
              alignSelf: 'center',
              aspectRatio: 9 / 16,
              borderRadius: 10,
              backgroundColor: 'red',
              overflow: 'hidden'
            }}
          >
            {renderCard}
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              right: 10,
              justifyContent: 'center',
              width: 150,
              aspectRatio: 9 / 16,
              borderRadius: 10,
              overflow: 'hidden'
            }}
          >
            {renderCard}
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
            style={styles.imageContainer}
          >
            <Animated.View style={AnimatedStyles.motion}>
              {renderCard}
            </Animated.View>
          </Pressable>
        </View>
        <TouchableOpacity style={{ padding: 10 }} onPress={navigateToDetails}>
          <Text style={{ color: theme.colors.primary[100] }}>
            {'home_screen > details'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  )
}
