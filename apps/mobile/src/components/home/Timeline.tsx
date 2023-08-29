import { LENS_CUSTOM_FILTERS, RECS_URL } from '@lenstube/constants'
import type {
  FeedHighlightsRequest,
  FeedItem,
  FeedItemRoot,
  Publication
} from '@lenstube/lens'
import {
  FeedEventItemType,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery,
  useFeedHighlightsQuery,
  useFeedQuery,
  useProfilePostsQuery
} from '@lenstube/lens'
import { AlgoType, TimelineFeedType } from '@lenstube/lens/custom-types'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import useSWR from 'swr'

import { windowHeight } from '~/helpers/theme'
import useMobileHomeFeedStore from '~/store/feed'
import { useMobilePersistStore } from '~/store/persist'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import ServerError from '../ui/ServerError'
import ByteCards from './ByteCards'
import FirstSteps from './FirstSteps'
import PopularCreators from './PopularCreators'
import Streak from './Streak'
import TimelineFilters from './TimelineFilters'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    height: windowHeight
  }
})

const Timeline = () => {
  const selectedFeedType = useMobileHomeFeedStore(
    (state) => state.selectedFeedType
  )
  const setSelectedFeedType = useMobileHomeFeedStore(
    (state) => state.setSelectedFeedType
  )
  const selectedAlgoType = useMobileHomeFeedStore(
    (state) => state.selectedAlgoType
  )
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const scrollRef = useRef<FlashList<Publication | FeedItem>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  useEffect(() => {
    if (!selectedChannelId) {
      setSelectedFeedType(TimelineFeedType.CURATED)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId])

  const feedRequest = {
    limit: 50,
    feedEventItemTypes: [FeedEventItemType.Post],
    profileId: selectedChannelId,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const curatedRequest = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 10,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }

  const highlightsRequest: FeedHighlightsRequest = {
    profileId: selectedChannelId,
    limit: 10,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }

  const {
    data: curatedData,
    fetchMore: fetchMoreCurated,
    loading,
    error
  } = useExploreQuery({
    variables: {
      request: curatedRequest
    }
  })

  const { data: feedData, fetchMore: fetchMoreFeed } = useFeedQuery({
    variables: {
      request: feedRequest
    },
    skip: !selectedChannelId
  })

  const { data: feedHighlightsData, fetchMore: fetchMoreHighlights } =
    useFeedHighlightsQuery({
      variables: {
        request: highlightsRequest
      },
      skip: !selectedChannelId
    })

  const getAlgoStrategy = () => {
    switch (selectedAlgoType) {
      case AlgoType.K3L_CROWDSOURCED:
        return 'crowdsourced'
      case AlgoType.K3L_POPULAR:
        return 'popular'
      case AlgoType.K3L_RECOMMENDED:
        return 'recommended'
    }
  }

  const { data: recsData } = useSWR(
    `${RECS_URL}/k3l-feed/${getAlgoStrategy()}`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const publicationIds = recsData?.items as string[]

  const { data } = useProfilePostsQuery({
    variables: {
      request: { publicationIds, limit: 50 },
      reactionRequest: selectedChannelId
        ? { profileId: selectedChannelId }
        : null,
      channelId: selectedChannelId ?? null
    },
    skip: !publicationIds,
    fetchPolicy: 'no-cache'
  })

  const publications =
    selectedFeedType === TimelineFeedType.ALGORITHM
      ? (data?.publications.items as Publication[])
      : selectedFeedType === TimelineFeedType.HIGHLIGHTS
      ? (feedHighlightsData?.feedHighlights.items as Publication[])
      : selectedFeedType === TimelineFeedType.FOLLOWING
      ? (feedData?.feed?.items as FeedItem[])
      : (curatedData?.explorePublications?.items as Publication[])

  const pageInfo =
    selectedFeedType === TimelineFeedType.CURATED
      ? curatedData?.explorePublications?.pageInfo
      : TimelineFeedType.HIGHLIGHTS
      ? feedHighlightsData?.feedHighlights.pageInfo
      : feedData?.feed.pageInfo

  const fetchMorePublications = async () => {
    if (selectedFeedType === TimelineFeedType.CURATED) {
      return await fetchMoreCurated({
        variables: {
          request: {
            ...curatedRequest,
            cursor: pageInfo?.next
          }
        }
      })
    }
    if (selectedFeedType === TimelineFeedType.FOLLOWING) {
      return await fetchMoreFeed({
        variables: {
          request: {
            ...feedRequest,
            cursor: pageInfo?.next
          }
        }
      })
    }
    if (selectedFeedType === TimelineFeedType.HIGHLIGHTS) {
      return await fetchMoreHighlights({
        variables: {
          request: {
            ...highlightsRequest,
            cursor: pageInfo?.next
          }
        }
      })
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: Publication | FeedItem }) => {
      const publication =
        item?.__typename === 'FeedItem'
          ? (item.root as FeedItemRoot)
          : (item as Publication)
      return (
        // Added extra 'View' this to fix issue with ItemSeparator rendering
        <View style={{ marginBottom: 30 }}>
          {publication.metadata.mainContentFocus ===
          PublicationMainFocus.Audio ? (
            <AudioCard audio={publication} />
          ) : (
            <VideoCard video={publication} />
          )}
        </View>
      )
    },
    []
  )

  const HeaderComponent = useMemo(
    () => (
      <>
        <ByteCards />
        <FirstSteps />
        <PopularCreators />
        <Streak />
        <TimelineFilters />
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFeedType]
  )

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (error) {
    return <ServerError />
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={scrollRef}
        ListHeaderComponent={HeaderComponent}
        data={publications}
        estimatedItemSize={publications?.length ?? []}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${i + 1}_${i}`}
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
