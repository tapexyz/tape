import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useState } from 'react'
import type { ViewToken } from 'react-native'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import Comments from '~/components/watch/Comments'

import Item from './Item'
import Player from './Player'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 15
  }
})

const Stage = () => {
  const [activeAudioIndex, setActiveAudioIndex] = useState(0)

  const renderItem = useCallback(
    ({ item: audio }: { item: Publication }) => <Item audio={audio} />,
    []
  )

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      let viewableItem = viewableItems[0]
      if (viewableItems.length > 4) {
        viewableItem = viewableItems[Math.floor(viewableItems.length) / 2]
      }
      if (viewableItem) {
        const visibleIndex = Number(viewableItem.index)
        setActiveAudioIndex(visibleIndex)
      }
    },
    []
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio]
    }
  }
  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  if (loading || error) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  const audios = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMoreAudio = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  if (!audios?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlashList
          horizontal
          data={audios}
          bounces={false}
          pagingEnabled
          decelerationRate={'fast'}
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          estimatedItemSize={audios.length}
          renderItem={renderItem}
          keyExtractor={(item, i) => `${item.id}_${i}`}
          onEndReached={fetchMoreAudio}
          onEndReachedThreshold={0.8}
          onViewableItemsChanged={onViewableItemsChanged}
          extraData={activeAudioIndex} // To handle rerender if anything changes in data
        />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Player audio={audios[activeAudioIndex]} />
        <Comments id={audios[activeAudioIndex].id} />
      </View>
    </View>
  )
}

export default Stage
