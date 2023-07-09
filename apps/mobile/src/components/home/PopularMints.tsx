import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import {
  getProfilePicture,
  getThumbnailUrl,
  imageCdn,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Image as ExpoImage, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Skeleton } from 'moti/skeleton'
import React, { memo } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

const CAROUSEL_HEIGHT = 200
const BORDER_RADIUS = 10

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pagination: {
    width: '100%',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10
  },
  thumbnail: {
    width: '100%',
    height: CAROUSEL_HEIGHT,
    borderRadius: BORDER_RADIUS,
    borderColor: theme.colors.grey,
    borderWidth: 1
  },
  gradient: {
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    marginTop: 1,
    right: 1,
    left: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    opacity: 0.8,
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9,
    zIndex: 2
  },
  otherInfo: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(10),
    width: '60%'
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

const PopularMints = () => {
  const { width } = useWindowDimensions()
  const progressValue = useSharedValue(0)
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 5,
    sortCriteria: PublicationSortCriteria.TopCollected,
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }

  const { data, loading, error } = useExploreQuery({
    variables: {
      request,
      channelId: selectedChannel?.id ?? null
    }
  })
  const publications = data?.explorePublications?.items as Publication[]

  if (error) {
    return null
  }

  return (
    <View style={styles.container}>
      <Skeleton
        show={loading}
        colors={[`${homeGradientColor}10`, '#00000080']}
        radius={BORDER_RADIUS}
        height={CAROUSEL_HEIGHT}
      >
        <View>
          <Carousel
            style={{
              borderRadius: BORDER_RADIUS
            }}
            loop
            width={width - 20}
            height={CAROUSEL_HEIGHT}
            autoPlay={true}
            onProgressChange={(_, absoluteProgress) => {
              progressValue.value = absoluteProgress
            }}
            data={publications}
            scrollAnimationDuration={1000}
            autoPlayInterval={4000}
            renderItem={({ item }) => {
              const isBytes = item.appId === LENSTUBE_BYTES_APP_ID
              const thumbnailUrl = imageCdn(
                getThumbnailUrl(item, true),
                isBytes ? 'THUMBNAIL_V' : 'THUMBNAIL'
              )
              return (
                <ImageBackground
                  source={{
                    uri: thumbnailUrl
                  }}
                  blurRadius={15}
                  style={{ position: 'relative' }}
                  imageStyle={{ opacity: 0.8, borderRadius: BORDER_RADIUS }}
                >
                  <LinearGradient
                    colors={['#00000090', '#00000080', 'transparent']}
                    style={styles.gradient}
                  >
                    <Text numberOfLines={1} style={styles.title}>
                      {item.metadata.name}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <ExpoImage
                        source={{
                          uri: imageCdn(
                            getProfilePicture(item.profile),
                            'AVATAR'
                          )
                        }}
                        contentFit="cover"
                        style={{ width: 15, height: 15, borderRadius: 3 }}
                      />
                      <Text style={styles.otherInfo}>
                        {trimLensHandle(item.profile.handle)}
                      </Text>
                    </View>
                  </LinearGradient>
                  <ExpoImage
                    source={{
                      uri: thumbnailUrl
                    }}
                    contentFit={isBytes ? 'contain' : 'cover'}
                    style={styles.thumbnail}
                  />
                </ImageBackground>
              )
            }}
          />
          {Boolean(progressValue) && (
            <View style={styles.pagination}>
              {publications?.map((_, index) => {
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
        </View>
      </Skeleton>
    </View>
  )
}

export default PopularMints
