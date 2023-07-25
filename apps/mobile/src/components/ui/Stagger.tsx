import type { PropsWithChildren, ReactNode } from 'react'
import React, { Children, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import type {
  BaseAnimationBuilder,
  ComplexAnimationBuilder,
  EntryExitAnimationFunction,
  Keyframe
} from 'react-native-reanimated'
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout
} from 'react-native-reanimated'

type StaggerProps = PropsWithChildren<{
  children: ReactNode
  stagger?: number
  enterDirection?: -1 | 1
  exitDirection?: -1 | 1
  duration?: number
  style?: ViewStyle
  entering?: () =>
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
    | ComplexAnimationBuilder
  exiting?: () =>
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
    | ComplexAnimationBuilder
  initialEnteringDelay?: number
  initialExitingDelay?: number
}>

const Stagger = ({
  children,
  stagger,
  enterDirection = 1,
  exitDirection = -1,
  duration = 400,
  style,
  entering = () => FadeInDown,
  exiting = () => FadeOutDown,
  initialEnteringDelay = 0,
  initialExitingDelay = 0
}: StaggerProps) => {
  const s = useMemo(() => {
    return stagger ?? 50
  }, [stagger])

  if (!children) {
    return null
  }

  return (
    <Animated.View style={style} layout={Layout}>
      {Children.map(children as JSX.Element[], (child: JSX.Element, index) => {
        return (
          <Animated.View
            key={child?.key ?? index}
            layout={Layout}
            entering={(entering() as ComplexAnimationBuilder)
              .delay(
                initialEnteringDelay +
                  (enterDirection === 1
                    ? index * s
                    : (Children.count(children) - index) * s)
              )
              .duration(duration ?? 1000)}
            exiting={(exiting() as ComplexAnimationBuilder)
              .delay(
                initialExitingDelay +
                  (exitDirection === 1
                    ? index * s
                    : (Children.count(children) - index) * s)
              )
              .duration(duration)}
          >
            {child}
          </Animated.View>
        )
      })}
    </Animated.View>
  )
}

export default Stagger
