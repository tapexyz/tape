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
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'

import { theme } from '../../constants/theme'
import normalizeFont from '../../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    minHeight: Dimensions.get('screen').height
  },
  text: {
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 20,
          paddingHorizontal: 5
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10
          }}
        >
          <ExpoImage
            source={`https://picsum.photos/seed/100/500/215`}
            contentFit="cover"
            style={{ width: 25, height: 25, borderRadius: 5 }}
          />
          <Text style={styles.text}>
            {item.profile.name || item.profile.handle}
          </Text>
        </View>
      </View>
      <View style={{}}>
        <Text style={styles.text}>{item.metadata.name}</Text>
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
