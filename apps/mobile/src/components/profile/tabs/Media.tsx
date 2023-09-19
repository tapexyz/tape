import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type {
  MirrorablePublication,
  Profile,
  PublicationsRequest
} from '@lenstube/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@lenstube/lens'
import type { FC } from 'react'
import React, { memo, useCallback } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'
import Animated from 'react-native-reanimated'

import NotFound from '~/components/ui/NotFound'

import AudioCard from '../../common/AudioCard'
import VideoCard from '../../common/VideoCard'

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1
  }
})

const Media: FC<Props> = ({ profile, scrollHandler }) => {
  const { height } = useWindowDimensions()

  const request: PublicationsRequest = {
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.Audio
        ]
      },
      customFilters: LENS_CUSTOM_FILTERS,
      from: profile?.id
    },
    limit: LimitType.Ten
  }

  const { data, loading, fetchMore, refetch } = usePublicationsQuery({
    variables: {
      request
    },
    skip: !profile?.id,
    notifyOnNetworkStatusChange: true
  })

  const publications = data?.publications?.items as MirrorablePublication[]
  const pageInfo = data?.publications?.pageInfo

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

  return (
    <View style={[styles.container, { height }]}>
      <Animated.FlatList
        data={publications}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: publications?.length < 5 ? 500 : 180
        }}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        removeClippedSubviews
        scrollEventThrottle={16}
        onRefresh={() => refetch()}
        refreshing={Boolean(publications?.length) && loading}
      />
    </View>
  )
}

export default memo(Media)
