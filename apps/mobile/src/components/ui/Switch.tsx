import type { MotiTransitionProp } from 'moti'
import { View as MView } from 'moti'
import type { FC } from 'react'
import React, { memo } from 'react'
import { Pressable, View } from 'react-native'
import { Easing } from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

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
  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MView
          from={{
            backgroundColor: isActive
              ? theme.colors.grey
              : theme.colors.secondary
          }}
          animate={{
            backgroundColor: isActive
              ? theme.colors.grey
              : theme.colors.secondary
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
            backgroundColor: theme.colors.white,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MView
            transition={transition}
            from={{
              width: isActive ? size * 0.4 : size * 0.4,
              borderColor: isActive
                ? theme.colors.backdrop2
                : theme.colors.backdrop
            }}
            animate={{
              width: isActive ? 0 : size * 0.4,
              borderColor: isActive
                ? theme.colors.backdrop2
                : theme.colors.backdrop
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
