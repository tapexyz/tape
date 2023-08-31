import type { MotiPressableProps } from 'moti/interactions'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

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
      return [10, 20]
    case 'md':
      return [15, 20]
    case 'lg':
      return [20, 30]
    default:
      return [15, 20]
  }
}

const Button: FC<Props> = ({ text, icon, size = 'md', ...props }) => {
  const { themeConfig } = useMobileTheme()

  return (
    <AnimatedPressable
      {...props}
      style={[
        {
          paddingVertical: getButtonSize(size)[0],
          paddingHorizontal: getButtonSize(size)[1],
          borderRadius: 100,
          alignItems: 'center',
          backgroundColor: themeConfig.buttonBackgroundColor
        },
        props.style
      ]}
    >
      {icon}
      {text && (
        <Text
          style={{
            color: themeConfig.buttonTextColor,
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
