import React, { memo } from 'react'
import { Text, useWindowDimensions, View } from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'

import { theme } from '~/helpers/theme'

type PaginationItemProps = {
  index: number
  length: number
  animValue: Animated.SharedValue<number>
  isRotate?: boolean
}

const PaginationRectangleItem = memo<PaginationItemProps>(
  function PaginationRectangleItem({ animValue, index, length }) {
    const width = 25
    const animStyle = useAnimatedStyle(() => {
      let inputRange = [index - 1, index, index + 1]
      let outputRange = [width / 2, width, width / 2]

      if (index === 0 && animValue?.value > length - 1) {
        inputRange = [length - 1, length, length + 1]
        outputRange = [width / 2, width, width / 2]
      }

      return {
        width: interpolate(
          animValue?.value,
          inputRange,
          outputRange,
          Extrapolate.CLAMP
        )
      }
    }, [animValue, index, length])
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
  }
)

const CreatorsCarousel = () => {
  const { width } = useWindowDimensions()
  const progressValue = useSharedValue(0)

  return (
    <View style={{ position: 'relative', flex: 1, gap: 10 }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Carousel
          style={{
            borderRadius: 15
          }}
          loop
          width={width - 25}
          height={width / 2}
          autoPlay={true}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress
          }}
          data={[...new Array(6).keys()]}
          scrollAnimationDuration={1000}
          autoPlayInterval={4000}
          renderItem={({ index }) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: theme.colors.white,
                borderRadius: 15
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 30 }}>{index}</Text>
            </View>
          )}
        />
      </View>
      {!!progressValue && (
        <View
          style={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((_, index) => {
            return (
              <PaginationRectangleItem
                animValue={progressValue}
                index={index}
                key={index}
                length={10}
              />
            )
          })}
        </View>
      )}
    </View>
  )
}

export default CreatorsCarousel
