import { LENS_CUSTOM_FILTERS } from '@dragverse/constants';
import type { Comment, Profile, PublicationsRequest } from '@dragverse/lens';
import {
  LimitType,
  PublicationMetadataMainFocusType,
  usePublicationsQuery
} from '@dragverse/lens';
import type { FC } from 'react';
import React, { memo, useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import Animated from 'react-native-reanimated';

import NotFound from '~/components/ui/NotFound';
import ServerError from '~/components/ui/ServerError';

import AudioCard from '../../common/AudioCard';
import VideoCard from '../../common/VideoCard';

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

const Replies: FC<Props> = ({ profile, scrollHandler }) => {
  const { height } = useWindowDimensions()

  const request: PublicationsRequest = {
    limit: LimitType.Ten,
    where: {
      actedBy: {
        id: profile.id
      },
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.Audio,
          PublicationMetadataMainFocusType.Image
        ]
      },
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const { data, loading, fetchMore, error, refetch } = usePublicationsQuery({
    variables: {
      request
    },
    skip: !profile?.id,
    notifyOnNetworkStatusChange: true
  })

  const publications = data?.publications?.items as Comment[]
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
    ({ item }: { item: Comment }) => (
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

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (error) {
    return <ServerError />
  }

  return (
    <View style={[styles.container, { height }]}>
      <Animated.FlatList
        data={publications}
        contentContainerStyle={{
          paddingBottom: publications?.length < 5 ? 500 : 180
        }}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onRefresh={() => refetch()}
        refreshing={Boolean(publications?.length) && loading}
      />
    </View>
  )
}

export default memo(Replies)
