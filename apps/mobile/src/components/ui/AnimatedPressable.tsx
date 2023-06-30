import type { MotiPressableProps } from 'moti/interactions'
import { MotiPressable } from 'moti/interactions'
import type { FC, ReactNode } from 'react'
import React, { useMemo } from 'react'

interface Props extends MotiPressableProps {
  children?: ReactNode
}

const AnimatedPressable: FC<Props> = ({ children, ...props }) => {
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
    <MotiPressable {...props} animate={animatePress}>
      {children}
    </MotiPressable>
  )
}

export default AnimatedPressable
