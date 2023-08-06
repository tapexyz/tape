import type { MotiPressableProps } from 'moti/interactions'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from './AnimatedPressable'

type ButtonSize = 'sm' | 'md' | 'lg'

interface Props extends MotiPressableProps {
  icon?: ReactNode
  text?: string
  size?: ButtonSize
}

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return 10
    case 'md':
      return 15
    case 'lg':
      return 20
    default:
      return 15
  }
}

const Button: FC<Props> = ({ text, icon, size = 'md', ...props }) => {
  return (
    <AnimatedPressable
      {...props}
      style={[
        {
          padding: getButtonSize(size),
          borderRadius: 100,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.colors.grey,
          backgroundColor: theme.colors.backdrop2
        },
        props.style
      ]}
    >
      {icon}
      {text && (
        <Text
          style={{
            color: theme.colors.white,
            fontFamily: 'font-medium',
            fontSize: normalizeFont(12),
            opacity: props.disabled ? 0.3 : 1
          }}
        >
          {text}
        </Text>
      )}
    </AnimatedPressable>
  )
}

export default Button
