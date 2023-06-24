import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Gyroscope } from 'expo-sensors'
import type { Publication } from 'lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'

import { theme } from '../../constants/theme'
import haptic from '../../helpers/haptic'
import normalizeFont from '../../helpers/normalize-font'
import { useNotifications } from '../../hooks'
import useMobileStore from '../../store'

const BORDER_RADIUS = 15

const styles = StyleSheet.create({
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
    opacity: 0.8
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS
  },
  otherInfo: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.primary
  },
  cardsContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30
  },
  backgroundCards: {
    position: 'absolute',
    width: 170,
    opacity: 0.5,
    aspectRatio: 9 / 16,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden'
  }
})

const ByteCards = () => {
  const { notify } = useNotifications()
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  const prevGyroValue = useSharedValue({
    x: 0,
    y: 0
  })
  const gyroValue = useSharedValue({
    x: 0,
    y: 0
  })

  const derivedTranslations = useDerivedValue(() => {
    'worklet'
    const MAX_X = 40
    const MAX_Y = 20

    let newX = prevGyroValue.value.x + gyroValue.value.y * -2
    let newY = prevGyroValue.value.y + gyroValue.value.x * -2

    if (Math.abs(newX) >= MAX_X) {
      newX = prevGyroValue.value.x
    }
    if (Math.abs(newY) >= MAX_Y) {
      newY = prevGyroValue.value.y
    }
    prevGyroValue.value = {
      x: newX,
      y: newY
    }
    return {
      x: newX,
      y: newY
    }
  }, [gyroValue.value])

  useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y }) => {
      gyroValue.value = { x, y }
    })
    return () => {
      subscription.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gyroValue.value])

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      const inputRange = [-100, 0, 100]
      const outputRange = [-20, 0, 20]
      return {
        width: 200,
        marginBottom: 10,
        aspectRatio: 9 / 16,
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
        transform: [
          {
            translateX: withSpring(
              interpolate(derivedTranslations.value.x, inputRange, outputRange)
            )
          },
          {
            translateY: withSpring(
              interpolate(derivedTranslations.value.y, inputRange, outputRange)
            )
          }
        ]
      }
    })
  }

  const renderCard = useCallback(
    (byte: Publication) => {
      return (
        <LinearGradient
          style={{ padding: 1, position: 'relative' }}
          colors={['#00000070', `${homeGradientColor}80`]}
          // start={{ x: 0.7, y: 1 }}
          // end={{ x: 0.2, y: 0.9 }}
        >
          <ExpoImage
            source={getThumbnailUrl(byte)}
            contentFit="cover"
            style={styles.thumbnail}
          />
          <LinearGradient
            colors={['transparent', '#00000080', '#00000090']}
            style={styles.gradient}
          >
            <ExpoImage
              source={getProfilePicture(byte.profile)}
              contentFit="cover"
              style={{ width: 15, height: 15, borderRadius: 3 }}
            />
            <Text style={styles.otherInfo}>
              {byte.profile.handle.replace('.lens', '')}
            </Text>
            <Text style={{ color: theme.colors.primary, fontSize: 3 }}>
              {'\u2B24'}
            </Text>
            <Text style={styles.otherInfo}>
              {byte.stats.totalUpvotes} likes
            </Text>
          </LinearGradient>
        </LinearGradient>
      )
    },
    [homeGradientColor]
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 10,
    noRandomize: false,
    sources: ['lenstube-bytes'],
    publicationTypes: [PublicationTypes.Post],
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data, loading, error } = useExploreQuery({
    variables: { request }
  })

  if (loading || error) {
    return null
  }

  const bytes = data?.explorePublications?.items as Publication[]

  return (
    <View style={styles.cardsContainer}>
      <Pressable
        style={{
          zIndex: 1
        }}
        onPress={() => {
          haptic()
          notify('success', {
            params: {
              title: 'Hello',
              description: 'Wow, that was easy',
              hideCloseButton: true
            }
          })
        }}
      >
        <Animated.View style={AnimatedStyles.motion}>
          {renderCard(bytes[0])}
        </Animated.View>
      </Pressable>
      <Pressable
        onPress={() => haptic()}
        style={[
          styles.backgroundCards,
          {
            left: 20
          }
        ]}
      >
        {renderCard(bytes[1])}
      </Pressable>
      <Pressable
        onPress={() => haptic()}
        style={[
          styles.backgroundCards,
          {
            right: 20
          }
        ]}
      >
        {renderCard(bytes[2])}
      </Pressable>
    </View>
  )
}

export default ByteCards
