import type { MotiTransitionProp } from 'moti'
import { View as MView } from 'moti'
import type { FC } from 'react'
import React, { memo } from 'react'
import { Pressable, View } from 'react-native'
import { Easing } from 'react-native-reanimated'

import { useMobileTheme } from '~/hooks'

const SIZE = 20
const TRACK_SIZE = SIZE * 1.3
const TRACK_HEIGHT = SIZE * 0.4

const transition: MotiTransitionProp = {
  type: 'timing',
  duration: 300,
  easing: Easing.inOut(Easing.ease)
}

type Props = {
  size?: number
  onPress: () => void
  isActive: boolean
}

const Switch: FC<Props> = ({ size = SIZE, onPress, isActive }) => {
  const { themeConfig } = useMobileTheme()

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 3
        }}
      >
        <MView
          from={{
            backgroundColor: isActive
              ? themeConfig.borderColor
              : themeConfig.secondaryTextColor
          }}
          animate={{
            backgroundColor: isActive
              ? themeConfig.borderColor
              : themeConfig.secondaryTextColor
          }}
          transition={transition}
          style={{
            position: 'absolute',
            width: TRACK_SIZE,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT
          }}
        />
        <MView
          transition={transition}
          from={{
            translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4
          }}
          animate={{
            translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4
          }}
          style={{
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size,
            backgroundColor: themeConfig.contrastBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MView
            transition={transition}
            from={{
              width: isActive ? size * 0.4 : 0,
              height: isActive ? size * 0.4 : 0,
              borderColor: isActive
                ? themeConfig.backgroudColor3
                : themeConfig.backgroudColor2
            }}
            animate={{
              width: isActive ? size * 0.4 : 0,
              height: isActive ? size * 0.4 : 0
            }}
            style={{
              width: size * 0.4,
              height: size * 0.4,
              borderRadius: size * 0.6,
              borderWidth: size * 0.1
            }}
          />
        </MView>
      </View>
    </Pressable>
  )
}

export default memo(Switch)
