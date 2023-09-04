import type { MotiPressableProps } from 'moti/interactions'
import { MotiPressable } from 'moti/interactions'
import type { FC, ReactNode } from 'react'
import React, { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

interface Props extends MotiPressableProps {
  children?: ReactNode
  pressable?: boolean
}

const AnimatedPressable: FC<Props> = ({
  children,
  pressable = true,
  ...props
}) => {
  const { width, height } = useWindowDimensions()
  const hitSlopPercentage = 0.01 // 1% of the screen size
  const hitSlop = {
    left: width * hitSlopPercentage,
    right: width * hitSlopPercentage,
    top: height * hitSlopPercentage,
    bottom: height * hitSlopPercentage
  }

  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet'
        return {
          scale: pressed ? 0.95 : 1
        }
      },
    []
  )

  return (
    <MotiPressable
      {...props}
      animate={pressable ? animatePress : undefined}
      hitSlop={hitSlop}
    >
      {children}
    </MotiPressable>
  )
}

export default AnimatedPressable
