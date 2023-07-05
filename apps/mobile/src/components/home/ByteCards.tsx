import {
  getProfilePicture,
  getThumbnailUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Gyroscope } from 'expo-sensors'
import { Skeleton } from 'moti/skeleton'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { useNotifications } from '~/hooks'
import useMobileStore from '~/store'

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
    opacity: 0.8,
    marginBottom: 1,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
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
  },
  firstByteCardWrapper: {
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowRadius: 15,
    elevation: 24
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

  const renderCard = useCallback((byte: Publication) => {
    return (
      <LinearGradient
        style={{ padding: 1, position: 'relative' }}
        colors={['transparent', '#ffffff90']}
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
            {trimLensHandle(byte.profile.handle)}
          </Text>
          <Text style={{ color: theme.colors.primary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{byte.stats.totalUpvotes} likes</Text>
        </LinearGradient>
      </LinearGradient>
    )
  }, [])

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

  if (error) {
    return null
  }

  const bytes = data?.explorePublications?.items as Publication[]

  return (
    <View style={styles.cardsContainer}>
      <View style={styles.firstByteCardWrapper}>
        <Skeleton
          show={loading}
          colors={[`${homeGradientColor}10`, '#00000080']}
          radius={BORDER_RADIUS}
        >
          <Pressable
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
              {bytes?.length && renderCard(bytes[0])}
            </Animated.View>
          </Pressable>
        </Skeleton>
      </View>
      <Pressable
        onPress={() => haptic()}
        style={[
          styles.backgroundCards,
          {
            left: 20
          }
        ]}
      >
        {bytes?.length && renderCard(bytes[1])}
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
        {bytes?.length && renderCard(bytes[2])}
      </Pressable>
    </View>
  )
}

export default ByteCards
