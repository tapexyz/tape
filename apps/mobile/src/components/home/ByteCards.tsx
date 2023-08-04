import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Gyroscope } from 'expo-sensors'
import { Skeleton } from 'moti/skeleton'
import React, { useCallback, useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import { theme } from '~/helpers/theme'
import { usePlatform } from '~/hooks'
import useMobileStore from '~/store'

import UserProfile from '../common/UserProfile'

const BORDER_RADIUS = 20

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
    marginBottom: 1,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.backdrop
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
  },
  firstCard: {
    width: 200,
    marginBottom: 10,
    aspectRatio: 9 / 16,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden'
  }
})

const ByteCards = () => {
  const { navigate } = useNavigation()
  const { isIOS } = usePlatform()
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
    let subscription: { remove: () => void }
    if (isIOS) {
      subscription = Gyroscope.addListener(({ x, y }) => {
        gyroValue.value = { x, y }
      })
    }
    return () => {
      if (isIOS) {
        subscription.remove()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gyroValue.value])

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      const inputRange = [-100, 0, 100]
      const outputRange = [-10, 0, 10] // reduce to slow down the translation
      const springConfig = {
        damping: 10,
        stiffness: 80,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01
      }
      return {
        transform: [
          {
            translateX: withSpring(
              interpolate(derivedTranslations.value.x, inputRange, outputRange),
              springConfig
            )
          },
          {
            translateY: withSpring(
              interpolate(derivedTranslations.value.y, inputRange, outputRange),
              springConfig
            )
          }
        ]
      }
    })
  }

  const renderCard = useCallback((byte: Publication) => {
    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        style={{
          borderRadius: BORDER_RADIUS,
          borderWidth: 0.5,
          borderColor: theme.colors.secondary
        }}
      >
        <ExpoImage
          source={{ uri: imageCdn(getThumbnailUrl(byte, true), 'THUMBNAIL_V') }}
          contentFit="cover"
          transition={300}
          style={styles.thumbnail}
        />
        <LinearGradient
          colors={['transparent', '#00000090', '#000000']}
          style={styles.gradient}
        >
          <UserProfile profile={byte.profile} size={15} radius={3} />
        </LinearGradient>
      </Animated.View>
    )
  }, [])

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 10,
    noRandomize: false,
    sources: [LENSTUBE_BYTES_APP_ID],
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
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.cardsContainer}
    >
      <View style={styles.firstByteCardWrapper}>
        <Skeleton
          show={loading}
          colors={[`${homeGradientColor}10`, '#00000080']}
          radius={BORDER_RADIUS}
        >
          <Pressable
            onPress={() => {
              haptic()
              navigate('MainTab', {
                screen: 'BytesStack',
                params: { screen: 'Bytes' }
              })
            }}
          >
            {isIOS ? (
              <Animated.View style={[AnimatedStyles.motion, styles.firstCard]}>
                {bytes?.length && renderCard(bytes[0])}
              </Animated.View>
            ) : (
              <View style={styles.firstCard}>
                {bytes?.length && renderCard(bytes[0])}
              </View>
            )}
          </Pressable>
        </Skeleton>
      </View>
      <Pressable
        onPress={() => {
          haptic()
          navigate('MainTab', {
            screen: 'BytesStack',
            params: { screen: 'Bytes' }
          })
        }}
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
        onPress={() => {
          haptic()
          navigate('MainTab', {
            screen: 'BytesStack',
            params: { screen: 'Bytes' }
          })
        }}
        style={[
          styles.backgroundCards,
          {
            right: 20
          }
        ]}
      >
        {bytes?.length && renderCard(bytes[2])}
      </Pressable>
    </Animated.View>
  )
}

export default ByteCards
