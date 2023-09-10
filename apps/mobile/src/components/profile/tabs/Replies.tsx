import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Comment, Profile, PublicationsQueryRequest } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useCommentsQuery
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
import ServerError from '~/components/ui/ServerError'

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

const Replies: FC<Props> = ({ profile, scrollHandler }) => {
  const { height } = useWindowDimensions()

  const request: PublicationsQueryRequest = {
    publicationTypes: [PublicationTypes.Comment],
    limit: 10,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Video,
        PublicationMainFocus.Audio,
        PublicationMainFocus.Image
      ]
    },
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: profile?.id
  }

  const { data, loading, fetchMore, error, refetch } = useCommentsQuery({
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
        {item.metadata.mainContentFocus === PublicationMainFocus.Audio ? (
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
