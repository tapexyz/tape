import Ionicons from '@expo/vector-icons/Ionicons'
import React, { Fragment, useLayoutEffect } from 'react'
import { Text, useWindowDimensions, View, type ViewProps } from 'react-native'
import type { WithSpringConfig } from 'react-native-reanimated'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'

const springConfig: WithSpringConfig = {
  mass: 1,
  damping: 14,
  stiffness: 121.6,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001
}

type Variant = 'default' | 'success' | 'warn' | 'error'

export type ToastProps = {
  text: string
  isVisible?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  textColor?: string
  variant?: Variant
} & ViewProps

export const Toast = ({
  icon,
  isVisible,
  text,
  variant = 'default'
}: ToastProps) => {
  const distance = 60
  const targetTranslate = 0

  const insets = useSafeAreaInsets()
  const { width: deviceWidth } = useWindowDimensions()
  const animation = useSharedValue(isVisible ? 1 : 0)

  const getTextColor = (variant: Variant) => {
    switch (variant) {
      case 'default':
        return colors.white
      case 'success':
        return colors.green
      case 'warn':
        return colors.yellow
      case 'error':
        return colors.red
      default:
        return colors.white
    }
  }
  const textColor = getTextColor(variant)

  useLayoutEffect(() => {
    animation.value = withSpring(isVisible ? 1 : 0, springConfig)
  }, [isVisible, animation])

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [distance, targetTranslate],
      'extend'
    )

    return {
      opacity: animation.value,
      transform: [{ translateY }]
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          zIndex: 100,
          borderRadius: 100,
          maxWidth: deviceWidth - 38,
          position: 'absolute',
          paddingVertical: 5,
          paddingHorizontal: 12,
          alignSelf: 'center',
          backgroundColor: colors.background,
          bottom: (insets.bottom || 40) + 3
        }}
      >
        <Fragment>
          {icon && (
            <Ionicons
              size={20}
              name={icon}
              color={textColor}
              style={{ paddingRight: 5 }}
            />
          )}
          <Text
            style={{
              color: textColor,
              fontFamily: 'font-medium',
              fontSize: normalizeFont(12)
            }}
            numberOfLines={1}
          >
            {text}
          </Text>
        </Fragment>
      </View>
    </Animated.View>
  )
}
