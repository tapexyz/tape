import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback, useRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'

import { theme } from '~/helpers/theme'

// const TimelineCell = ({ item }: { item: Publication }) => {
//   const posterUrl = getThumbnailUrl(item)
//   const sound = new Audio.Sound()

//   const loadSound = async () => {
//     await sound.loadAsync({
//       uri: getPublicationMediaUrl(item)
//     })
//   }

//   const playSound = async () => {
//     try {
//       if (sound._loaded) {
//         await sound.playAsync()
//       }
//     } catch (error) {
//       logger.error('🚀 ~ playSound ~ error:', error)
//     }
//   }

//   const stopSound = async () => {
//     try {
//       await sound.stopAsync()
//       await sound.unloadAsync()
//     } catch (error) {
//       logger.error('🚀 ~ stopSound ~ error:', error)
//     }
//   }

//   return (
//     <View>
//       <ExpoImage
//         onLoadEnd={() => loadSound()}
//         source={posterUrl}
//         contentFit="cover"
//         style={styles.poster}
//       />
//       <Button title="Play Sound" onPress={playSound} />
//       <Button title="Stop Sound" onPress={stopSound} />

//       <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
//         <Text style={styles.title}>{item.metadata.name}</Text>
//         {item.metadata.description && (
//           <Text numberOfLines={3} style={styles.description}>
//             {item.metadata.description.replace('\n', '')}
//           </Text>
//         )}
//         <View style={styles.otherInfoContainer}>
//           <ExpoImage
//             source={getProfilePicture(item.profile)}
//             contentFit="cover"
//             style={{ width: 15, height: 15, borderRadius: 3 }}
//           />
//           <Text style={styles.otherInfo}>
//             {trimLensHandle(item.profile.handle)}
//           </Text>
//           <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
//             {'\u2B24'}
//           </Text>
//           <Text style={styles.otherInfo}>{item.stats.totalUpvotes} likes</Text>
//           <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
//             {'\u2B24'}
//           </Text>
//           <Text style={styles.otherInfo}>
//             {getRelativeTime(item.createdAt)}
//           </Text>
//         </View>
//       </View>
//     </View>
//   )
// }

const width = Dimensions.get('screen').width
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74
const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  poster: {
    width: '100%',
    height: ITEM_SIZE,
    borderRadius: BORDER_RADIUS,
    margin: 0
  }
})

const Stage = () => {
  const backdropAnimated = useRef(new Animated.Value(0)).current
  const scrollX = useRef(new Animated.Value(0)).current

  const renderItem = useCallback(
    ({ item, index }: { item: Publication; index: number }) => {
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE
      ]

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [100, 50, 100],
        extrapolate: 'clamp'
      })

      return (
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={{ width: ITEM_SIZE }}>
            <Animated.View
              style={{
                marginHorizontal: 10,
                alignItems: 'center',
                transform: [{ translateY }],
                borderRadius: BORDER_RADIUS,
                borderColor: theme.colors.grey,
                borderWidth: 0.5
              }}
            >
              <SharedElement id={`item.${item.id}.image`} style={styles.poster}>
                <ExpoImage
                  source={{
                    uri: imageCdn(getThumbnailUrl(item))
                  }}
                  contentFit="cover"
                  style={styles.poster}
                />
              </SharedElement>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )
    },
    [scrollX]
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
      <Animated.FlatList
        data={audios}
        horizontal
        bounces={false}
        decelerationRate={'fast'}
        renderToHardwareTextureAndroid
        keyExtractor={(item, i) => `${item.id}_${i}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'center',
          padding: width / 7.5
        }}
        snapToInterval={ITEM_SIZE}
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
