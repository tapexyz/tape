import type { FC } from 'react'
import React, { memo } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import type { CarouselRenderItem } from 'react-native-reanimated-carousel/lib/typescript/types'

import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  pagination: {
    width: '100%',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10
  }
})

type PaginationItemProps = {
  index: number
  length: number
  animation: Animated.SharedValue<number>
  isRotate?: boolean
}

const Pagination = memo<PaginationItemProps>(function PaginationRectangleItem({
  animation,
  index,
  length
}) {
  const width = 25
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1]
    let outputRange = [width / 2, width, width / 2]

    if (index === 0 && animation?.value > length - 1) {
      inputRange = [length - 1, length, length + 1]
      outputRange = [width / 2, width, width / 2]
    }

    return {
      width: interpolate(
        animation?.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP
      )
    }
  }, [animation, index, length])
  return (
    <View
      style={{
        height: 5,
        marginHorizontal: 2
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor: theme.colors.white,
            flex: 1
          },
          animStyle
        ]}
      />
    </View>
  )
})

type HCarouselProps = {
  height: number
  borderRadius: number
  data: any[]
  renderItem: CarouselRenderItem<any>
}

const HCarousel: FC<HCarouselProps> = (props) => {
  const { height, borderRadius, data, renderItem } = props
  const { width } = useWindowDimensions()
  const progressValue = useSharedValue(0)

  return (
    <>
      <Carousel
        style={{
          borderRadius: borderRadius
        }}
        loop
        width={width - 20}
        height={height}
        autoPlay={true}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress
        }}
        data={data}
        scrollAnimationDuration={500}
        autoPlayInterval={4000}
        renderItem={renderItem}
      />
      {Boolean(progressValue) && (
        <View style={styles.pagination}>
          {data?.map((_, index) => {
            return (
              <Pagination
                animation={progressValue}
                index={index}
                key={index}
                length={10}
              />
            )
          })}
        </View>
      )}
    </>
  )
}

export default HCarousel
