import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  getProfilePicture,
  getPublicationMediaUrl,
  getRelativeTime,
  getThumbnailUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import { Audio } from 'expo-av'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Dimensions.get('screen').height
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
  poster: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: theme.colors.background
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
  }
})

const TimelineCell = ({ item }: { item: Publication }) => {
  const posterUrl = getThumbnailUrl(item)
  const sound = new Audio.Sound()

  const loadSound = async () => {
    console.log('Loading Sound')
    await sound.loadAsync({
      uri: getPublicationMediaUrl(item)
    })
  }

  const playSound = async () => {
    try {
      if (sound._loaded) {
        console.log('Playing Sound')
        await sound.playAsync()
      }
    } catch (error) {
      console.log('🚀 ~ playSound ~ error:', error)
    }
  }

  const stopSound = async () => {
    try {
      console.log('Stopping Sound')
      await sound.stopAsync()
      await sound.unloadAsync()
    } catch (error) {
      console.log('🚀 ~ stopSound ~ error:', error)
    }
  }

  return (
    <View>
      <ExpoImage
        onLoadEnd={() => loadSound()}
        source={posterUrl}
        contentFit="cover"
        style={styles.poster}
      />
      <Button title="Play Sound" onPress={playSound} />
      <Button title="Stop Sound" onPress={stopSound} />

      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        <Text style={styles.title}>{item.metadata.name}</Text>
        {item.metadata.description && (
          <Text numberOfLines={3} style={styles.description}>
            {item.metadata.description.replace('\n', '')}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <ExpoImage
            source={getProfilePicture(item.profile)}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.otherInfo}>
            {trimLensHandle(item.profile.handle)}
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{item.stats.totalUpvotes} likes</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const List = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
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

  return (
    <View style={styles.container}>
      <FlashList
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        renderItem={({ item }) => {
          return <TimelineCell item={item} />
        }}
        estimatedItemSize={50}
        data={audios}
      />
    </View>
  )
}

export default List
