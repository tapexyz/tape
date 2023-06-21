import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import type { Publication } from 'lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'

import { theme } from '../../constants/theme'
import normalizeFont from '../../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    minHeight: Dimensions.get('screen').height
  },
  title: {
    color: theme.colors.primary,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12)
  }
})

const TimelineCell = ({ item }: { item: Publication }) => {
  const thumbnailUrl = getThumbnailUrl(item)

  return (
    <View>
      <ExpoImage
        source={thumbnailUrl}
        contentFit="cover"
        style={{ width: '100%', height: 215, borderRadius: 8 }}
      />
      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        <Text style={styles.title}>{item.metadata.name}</Text>
        {item.metadata.description && (
          <Text
            numberOfLines={3}
            style={{
              fontFamily: 'font-normal',
              fontSize: normalizeFont(12),
              color: theme.colors.secondary,
              paddingTop: 10
            }}
          >
            {item.metadata.description.replace('\n', '')}
          </Text>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingTop: 10,
            opacity: 0.8
          }}
        >
          <ExpoImage
            source={getProfilePicture(item.profile)}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text
            style={{
              fontFamily: 'font-normal',
              fontSize: normalizeFont(10),
              color: theme.colors.primary
            }}
          >
            {item.profile.handle.replace('.lens', '')}
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text
            style={{
              fontFamily: 'font-normal',
              fontSize: normalizeFont(10),
              color: theme.colors.primary
            }}
          >
            {item.stats.totalUpvotes} likes
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text
            style={{
              fontFamily: 'font-normal',
              fontSize: normalizeFont(10),
              color: theme.colors.primary
            }}
          >
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const Timeline = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    sources: ['lenstube'],
    publicationTypes: [PublicationTypes.Post],
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications?.items as Publication[]

  return (
    <View style={styles.container}>
      <FlashList
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => {
          return <TimelineCell item={item} />
        }}
        estimatedItemSize={50}
        data={videos}
      />
    </View>
  )
}

export default Timeline
