import Ionicons from '@expo/vector-icons/Ionicons'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  getProfilePicture,
  getPublicationMediaUrl,
  getShortHandTime,
  getThumbnailUrl,
  imageCdn,
  logger,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Audio } from 'expo-av'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback, useRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SharedElement } from 'react-navigation-shared-element'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const BORDER_RADIUS = 25
const TRANSLATE_Y = 50

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  poster: {
    width: '100%',
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.backdrop
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    paddingTop: 10
  },
  thumbnail: {
    width: '100%',
    height: 215,
    borderRadius: BORDER_RADIUS,
    borderColor: theme.colors.grey,
    borderWidth: 0.5
  },
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    opacity: 0.8
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  },
  icon: {
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50
  }
})

const Stage = () => {
  const backdropAnimated = useRef(new Animated.Value(0)).current
  const scrollX = useRef(new Animated.Value(0)).current

  const { width } = useWindowDimensions()
  const { goBack } = useNavigation()
  const { top } = useSafeAreaInsets()

  const renderItem = useCallback(
    ({ item: audio, index }: { item: Publication; index: number }) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width
      ]

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [0, TRANSLATE_Y, 0],
        extrapolate: 'clamp'
      })

      const sound = new Audio.Sound()

      const loadSound = async () => {
        await sound.loadAsync({
          uri: getPublicationMediaUrl(audio)
        })
      }

      const playSound = async () => {
        try {
          await loadSound()
          if (sound._loaded) {
            await sound.playAsync()
          }
        } catch (error) {
          logger.error('🚀 ~ playSound ~ error:', error)
        }
      }

      const stopSound = async () => {
        try {
          await sound.stopAsync()
          await sound.unloadAsync()
        } catch (error) {
          logger.error('🚀 ~ stopSound ~ error:', error)
        }
      }

      return (
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={{ width }}>
            <Animated.View
              style={{
                marginHorizontal: 10,
                alignItems: 'center',
                transform: [{ translateY }],
                borderRadius: BORDER_RADIUS,
                borderColor: theme.colors.grey,
                borderWidth: 0.5,
                position: 'relative',
                justifyContent: 'center'
              }}
            >
              <SharedElement
                id={`item.${audio.id}.image`}
                style={[styles.poster, { height: width }]}
              >
                <ExpoImage
                  source={{
                    uri: imageCdn(getThumbnailUrl(audio))
                  }}
                  contentFit="cover"
                  style={[styles.poster, { height: width, opacity: 0.5 }]}
                />
              </SharedElement>
              <View style={{ position: 'absolute' }}>
                <AnimatedPressable onPress={() => playSound()}>
                  <Ionicons
                    name="play-outline"
                    color={theme.colors.white}
                    size={50}
                    style={{ paddingLeft: 4 }}
                  />
                </AnimatedPressable>
              </View>
            </Animated.View>
            <View
              style={{
                marginTop: TRANSLATE_Y + 10,
                paddingHorizontal: 15,
                alignItems: 'center'
              }}
            >
              <Text numberOfLines={3} style={styles.title}>
                {audio.metadata.name}
              </Text>
              {audio.metadata.description && (
                <Text numberOfLines={3} style={styles.description}>
                  {audio.metadata.description.replace('\n', '')}
                </Text>
              )}
              <View style={styles.otherInfoContainer}>
                <ExpoImage
                  source={{ uri: imageCdn(getProfilePicture(audio.profile)) }}
                  contentFit="cover"
                  style={{ width: 15, height: 15, borderRadius: 3 }}
                />
                <Text style={styles.otherInfo}>
                  {trimLensHandle(audio.profile.handle)}
                </Text>
                <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
                  {'\u2B24'}
                </Text>
                <Text style={styles.otherInfo}>
                  {audio.stats.totalUpvotes} likes
                </Text>
                <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
                  {'\u2B24'}
                </Text>
                <Text style={styles.otherInfo}>
                  {getShortHandTime(audio.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    },
    [scrollX, width]
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio]
    }
  }
  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  if (loading || error) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  const audios = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMoreAudio = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  if (!audios?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <View
        style={{ top, paddingHorizontal: 10, paddingBottom: 25, zIndex: 1 }}
      >
        <AnimatedPressable
          onPress={() => {
            haptic()
            goBack()
          }}
          style={styles.icon}
        >
          <Ionicons
            name="chevron-back-outline"
            color={theme.colors.black}
            size={30}
          />
        </AnimatedPressable>
      </View>
      <Animated.FlatList
        data={audios}
        horizontal
        bounces={false}
        pagingEnabled
        decelerationRate={'fast'}
        renderToHardwareTextureAndroid
        keyExtractor={(item, i) => `${item.id}_${i}`}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
              backdropAnimated.setValue(event.nativeEvent.contentOffset.x)
            }
          }
        )}
        scrollEventThrottle={16}
        renderItem={renderItem}
        onEndReached={fetchMoreAudio}
        onEndReachedThreshold={0.8}
      />
    </View>
  )
}

export default Stage
