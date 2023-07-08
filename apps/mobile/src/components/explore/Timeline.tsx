import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useRef } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import Filters from './Filters'
import Showcase from './Showcase'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    height: Dimensions.get('screen').height
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

const Timeline = () => {
  const scrollRef = useRef<FlashList<Publication>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 5,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }
  const { data, fetchMore, loading } = useExploreQuery({
    variables: { request }
  })

  const publications = data?.explorePublications?.items as Publication[]
  console.log(
    '🚀 ~ file: Timeline.tsx:75 ~ Timeline ~ publications:',
    publications?.length
  )
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
    ({ item }: { item: Publication }) =>
      item.metadata.mainContentFocus === PublicationMainFocus.Audio ? (
        <AudioCard audio={item} />
      ) : (
        <VideoCard video={item} />
      ),
    []
  )

  if (!publications?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={scrollRef}
        ListHeaderComponent={() => (
          <>
            <Showcase />
            <Filters />
          </>
        )}
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

export default Timeline
