import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { ExplorePublicationRequest, Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import VideoCard from '~/components/common/VideoCard'
import NotFound from '~/components/ui/NotFound'
import ServerError from '~/components/ui/ServerError'
import { windowHeight } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    height: windowHeight
  }
})

export const PodcastModal = () => {
  const request: ExplorePublicationRequest = {
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
  const { data, fetchMore, loading, error, refetch } = useExploreQuery({
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
    ({ item }: { item: Publication }) => (
      <View style={{ marginBottom: 30 }}>
        <VideoCard video={item} />
      </View>
    ),
    []
  )

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (error) {
    return <ServerError />
  }

  if (!publications?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlashList
        contentContainerStyle={{ paddingTop: 10 }}
        data={publications}
        estimatedItemSize={publications.length}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() => (
          <ActivityIndicator style={{ paddingVertical: 20 }} />
        )}
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        onRefresh={() => refetch()}
        refreshing={Boolean(publications?.length) && loading}
      />
    </View>
  )
}
