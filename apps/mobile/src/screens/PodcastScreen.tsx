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

import VideoCard from '~/components/common/VideoCard'

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 5,
    flex: 1,
    height: Dimensions.get('screen').height
  }
})

export const PodcastScreen = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags: { oneOf: ['podcast'] },
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data, fetchMore, loading, error } = useExploreQuery({
    variables: { request }
  })

  const publications = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMorePublications = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  const renderItem = useCallback(
    ({ item }: { item: Publication }) => <VideoCard video={item} />,
    []
  )

  if (loading || error) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (!publications?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={publications}
        estimatedItemSize={publications.length}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        ListFooterComponent={() => (
          <ActivityIndicator style={{ paddingVertical: 20 }} />
        )}
        onEndReached={fetchMorePublications}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
