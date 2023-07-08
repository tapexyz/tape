import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'

import VideoCard from '../common/VideoCard'
import Actions from './Actions'
import Comments from './Comments'
import Metadata from './Metadata'
import MoreVideosFilter from './MoreVideosFilter'

const styles = StyleSheet.create({
  videos: {
    marginTop: 15,
    paddingHorizontal: 5,
    flex: 1,
    height: Dimensions.get('screen').height
  }
})

type Props = {
  video: Publication
}

const MoreVideos: FC<Props> = ({ video }) => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 5,
    publicationTypes: [PublicationTypes.Post],
    metadata: { mainContentFocus: [PublicationMainFocus.Video] },
    noRandomize: false,
    customFilters: LENS_CUSTOM_FILTERS,
    sources: [LENSTUBE_APP_ID]
  }
  const { data, fetchMore } = useExploreQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMoreVideos = async () => {
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

  if (!videos?.length) {
    return null
  }

  return (
    <View style={styles.videos}>
      <FlashList
        ListHeaderComponent={() => (
          <>
            <Metadata video={video} />
            <Actions video={video} />
            <Comments videoId={video.id} />
            <MoreVideosFilter />
          </>
        )}
        data={videos}
        estimatedItemSize={videos.length}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        onEndReachedThreshold={0.8}
        ListFooterComponent={() => (
          <ActivityIndicator style={{ paddingVertical: 20 }} />
        )}
        onEndReached={() => fetchMoreVideos()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default MoreVideos
