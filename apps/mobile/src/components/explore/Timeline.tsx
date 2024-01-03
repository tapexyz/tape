import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import type {
  ExplorePublicationRequest,
  MirrorablePublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import React, { useCallback, useMemo, useRef } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'

import useMobileStore from '~/store'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import NotFound from '../ui/NotFound'
import Filters from './Filters'
import Showcase from './Showcase'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1
  }
})

const Timeline = () => {
  const scrollRef = useRef<FlashList<MirrorablePublication>>(null)
  // @ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  const { height } = useWindowDimensions()

  const selectedExploreFilter = useMobileStore(
    (state) => state.selectedExploreFilter
  )

  const request: ExplorePublicationRequest = {
    limit: LimitType.TwentyFive,
    orderBy: selectedExploreFilter.criteria,
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        tags:
          selectedExploreFilter.category &&
          selectedExploreFilter.category !== 'all'
            ? { oneOf: [selectedExploreFilter.category] }
            : undefined,
        mainContentFocus: [
          PublicationMetadataMainFocusType.Audio,
          PublicationMetadataMainFocusType.Video
        ]
      }
    }
  }

  const { data, fetchMore, loading } = useExplorePublicationsQuery({
    variables: { request }
  })

  const publications = data?.explorePublications
    ?.items as MirrorablePublication[]
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
    ({ item }: { item: MirrorablePublication }) => (
      <View style={{ marginBottom: 30 }}>
        {item.metadata.__typename === 'AudioMetadataV3' ? (
          <AudioCard audio={item} />
        ) : (
          <VideoCard video={item} />
        )}
      </View>
    ),
    []
  )

  const HeaderComponent = useMemo(
    () => (
      <>
        <Showcase />
        <Filters />
      </>
    ),
    []
  )

  return (
    <View style={[styles.container, { height }]}>
      <FlashList
        ref={scrollRef}
        ListHeaderComponent={HeaderComponent}
        data={publications}
        estimatedItemSize={publications?.length ?? 50}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Timeline
