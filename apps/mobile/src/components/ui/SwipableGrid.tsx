import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import * as React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated'

import normalizeFont from '~/helpers/normalize-font'
import { windowHeight, windowWidth } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'

import UserProfile from '../common/UserProfile'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    gradient: {
      width: '100%',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      opacity: 0.8,
      marginBottom: 1,
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 25,
      backgroundColor: themeConfig.backgroudColor2
    },
    otherInfo: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const _spacing = 8
const _itemWidth = windowWidth * 0.7
const _itemHeight = _itemWidth * 1.67

// generate an even matrix cols === rows to fit all the items

const clamp = (value: number, min: number, max: number) => {
  'worklet'

  return Math.min(Math.max(value, min), max)
}

const Item = ({ item, activeIndex, index, onPress, style }: any) => {
  const animateStyles = useAnimatedStyle(() => {
    return {
      opacity:
        activeIndex.value === index
          ? withDelay(200, withTiming(1, { duration: 300 }))
          : withTiming(0.4)
    }
  })
  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          {
            width: _itemWidth,
            height: _itemHeight,
            padding: _spacing
          },
          animateStyles
        ]}
        key={item.key}
      >
        <ExpoImage
          source={{
            uri: imageCdn(getThumbnailUrl(item, true), 'THUMBNAIL_V')
          }}
          transition={300}
          contentFit="cover"
          style={style.thumbnail}
        />
        <LinearGradient
          colors={['transparent', '#00000080', '#00000090']}
          style={style.gradient}
        >
          <UserProfile profile={item.profile} size={15} radius={3} />
          <Text style={{ color: style.secondaryTextColor, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={style.otherInfo}>{item.stats.totalUpvotes} likes</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  )
}

const createMatrix = (rows: number, columns: number) => {
  // Initialize an empty matrix
  let matrix = []

  // Create rows
  for (let i = 0; i < rows; i++) {
    // Initialize an empty row
    let row = []

    // Create columns for each row
    for (let j = 0; j < columns; j++) {
      // Add elements to the row (you can set any initial value here)
      // For example, I'm setting all elements to 0.
      row.push(0)
    }

    // Add the row to the matrix
    matrix.push(row)
  }

  return matrix
}

type Props = {
  data: any[]
}

const SwipableGrid: React.FC<Props> = ({ data }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const _gridLength = Math.round(Math.sqrt(data.length))

  const ref = React.useRef<Animated.ScrollView>(null)
  const matrix = React.useMemo(() => {
    // Generate dummy array;
    const _m = createMatrix(_gridLength, _gridLength)

    const matx = _m.map((row, rowIndex) => {
      return row.map((_col, colIndex) => {
        return data[rowIndex * row.length + colIndex]
      })
    })

    return matx
  }, [_gridLength, data])

  const x = useSharedValue(0)
  const y = useSharedValue(0)
  const canSwipe = useSharedValue(true)

  const onGestureEvent = useAnimatedGestureHandler({
    onEnd: (event) => {
      if (canSwipe.value) {
        if (Math.abs(event.translationX) > 30) {
          if (event.velocityX < -200) {
            x.value = clamp(x.value + 1, 0, _gridLength - 1)
          } else if (event.velocityX > 200) {
            x.value = clamp(x.value - 1, 0, _gridLength - 1)
          }
        }
        if (Math.abs(event.translationY) > 30) {
          if (event.velocityY < -200) {
            y.value = clamp(y.value + 1, 0, _gridLength - 1)
          } else if (event.velocityY > -200) {
            y.value = clamp(y.value - 1, 0, _gridLength - 1)
          }
        }
        canSwipe.value = false
      }
    }
  })

  const activeIndex = useDerivedValue(() => {
    return _gridLength * y.value + x.value
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      contentOffset: {
        x: withTiming(
          x.value * _itemWidth - (windowWidth - _itemWidth) / 2,
          { duration: 300 },
          () => {
            canSwipe.value = true
          }
        ),
        y: withTiming(
          y.value * _itemHeight - (windowHeight - _itemHeight) / 2,
          { duration: 300 },
          () => {
            canSwipe.value = true
          }
        )
      }
    }
  }, [])

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style.container}>
        <Animated.ScrollView
          ref={ref}
          scrollEnabled={false}
          animatedProps={animatedProps}
          contentContainerStyle={{
            width: _gridLength * _itemWidth
          }}
          renderToHardwareTextureAndroid={true}
        >
          {matrix.map((row, rowIndex) => {
            return (
              <View key={`row-${rowIndex}`} style={{ flexDirection: 'row' }}>
                {row.map((item, colIndex) => {
                  return (
                    <Item
                      style={style}
                      key={item.id}
                      row={rowIndex}
                      col={colIndex}
                      item={item}
                      activeIndex={activeIndex}
                      index={rowIndex * row.length + colIndex}
                      onPress={() => {
                        x.value = colIndex
                        y.value = rowIndex
                      }}
                    />
                  )
                })}
              </View>
            )
          })}
        </Animated.ScrollView>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default SwipableGrid
