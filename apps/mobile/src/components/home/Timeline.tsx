import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import type {
  ExplorePublicationRequest,
  FeedHighlightsRequest,
  FeedItem,
  FeedRequest,
  MirrorablePublication,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  FeedEventItemType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery,
  useFeedHighlightsQuery,
  useFeedQuery,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { AlgoType, TimelineFeedType } from '@tape.xyz/lens/custom-types'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import useSWR from 'swr'

import { windowHeight } from '~/helpers/theme'
import useMobileHomeFeedStore from '~/store/feed'
import { useMobilePersistStore } from '~/store/persist'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import NotFound from '../ui/NotFound'
import ServerError from '../ui/ServerError'
import ByteCards from './ByteCards'
import FirstSteps from './FirstSteps'
import PopularCreators from './PopularCreators'
import Streak from './Streak'
import TimelineFilters from './TimelineFilters'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const scrollRef = useRef<FlashList<MirrorablePublication | FeedItem>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  useEffect(() => {
    if (!selectedProfile) {
      setSelectedFeedType(TimelineFeedType.CURATED)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile])

  const feedRequest: FeedRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video]
      },
      feedEventItemTypes: [FeedEventItemType.Post],
      for: selectedProfile?.id
    }
  }

  const curatedRequest: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Audio,
          PublicationMetadataMainFocusType.Video
        ]
      }
    },
    orderBy: ExplorePublicationsOrderByType.LensCurated,
    limit: LimitType.Ten
  }

  const highlightsRequest: FeedHighlightsRequest = {
    where: {
      for: selectedProfile?.id,
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Audio,
          PublicationMetadataMainFocusType.Video
        ]
      }
    },
    limit: LimitType.Ten
  }

  const {
    data: curatedData,
    fetchMore: fetchMoreCurated,
    loading,
    error
  } = useExplorePublicationsQuery({
    variables: {
      request: curatedRequest
    }
  })

  const { data: feedData, fetchMore: fetchMoreFeed } = useFeedQuery({
    variables: {
      request: feedRequest
    },
    skip: !selectedProfile?.id
  })

  const { data: feedHighlightsData, fetchMore: fetchMoreHighlights } =
    useFeedHighlightsQuery({
      variables: {
        request: highlightsRequest
      },
      skip: !selectedProfile?.id
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
    `/k3l-feed/${getAlgoStrategy()}`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const publicationIds = recsData?.items as string[]

  const { data, loading: recsLoading } = usePublicationsQuery({
    variables: {
      request: { where: { publicationIds }, limit: LimitType.Fifty }
    },
    skip: !publicationIds,
    fetchPolicy: 'no-cache'
  })

  const publications =
    selectedFeedType === TimelineFeedType.ALGORITHM
      ? (data?.publications.items as MirrorablePublication[])
      : selectedFeedType === TimelineFeedType.HIGHLIGHTS
        ? (feedHighlightsData?.feedHighlights.items as MirrorablePublication[])
        : selectedFeedType === TimelineFeedType.FOLLOWING
          ? (feedData?.feed?.items as FeedItem[])
          : (curatedData?.explorePublications?.items as MirrorablePublication[])

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
    ({ item }: { item: MirrorablePublication | FeedItem }) => {
      const publication =
        item?.__typename === 'FeedItem'
          ? (item.root as PrimaryPublication)
          : (item as MirrorablePublication)
      return (
        // Added extra 'View' this to fix issue with ItemSeparator rendering
        <View style={{ marginBottom: 30 }} key={publication.id}>
          {publication.metadata.__typename === 'AudioMetadataV3' ? (
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

  if (error) {
    return <ServerError />
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={scrollRef}
        ListHeaderComponent={HeaderComponent}
        data={publications}
        estimatedItemSize={publications?.length ?? 50}
        renderItem={renderItem}
        keyExtractor={(_item, i) => `${i + 1}_${i}`}
        ListFooterComponent={() =>
          selectedFeedType !== TimelineFeedType.ALGORITHM ||
          recsLoading ||
          loading ? (
            <ActivityIndicator style={{ paddingVertical: 20 }} />
          ) : null
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={
          selectedFeedType !== TimelineFeedType.ALGORITHM
            ? pageInfo?.next
              ? fetchMorePublications
              : null
            : null
        }
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Timeline
