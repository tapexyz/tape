import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'

import AudioCard from '~/components/common/AudioCard'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Dimensions.get('screen').height
  }
})

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

const List = () => {
  const renderItem = useCallback(
    ({ item }: { item: Publication }) => <AudioCard audio={item} />,
    []
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 30,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio]
    }
  }
  const { data, loading, error } = useExploreQuery({
    variables: { request }
  })

  if (loading || error) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  const audios = data?.explorePublications?.items as Publication[]

  if (!audios?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={audios}
        estimatedItemSize={audios.length}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        renderItem={renderItem}
      />
    </View>
  )
}

export default List
