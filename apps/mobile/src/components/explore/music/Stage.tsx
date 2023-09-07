import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type { ExplorePublicationRequest, Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useState } from 'react'
import type { ViewToken } from 'react-native'
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View
} from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

import CollapseButton from '~/components/common/header/CollapseButton'
import ServerError from '~/components/ui/ServerError'
import Comments from '~/components/watch/Comments'

import Item from './Item'
import Player from './Player'

const styles = StyleSheet.create({
  close: {
    zIndex: 1,
    alignSelf: 'baseline',
    marginTop: 15,
    marginHorizontal: 5
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20,
    flex: 1
  },
  actions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    gap: 30
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

  const request: ExplorePublicationRequest = {
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

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (error) {
    return <ServerError />
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
    <ImageBackground
      source={{ uri: imageCdn(getThumbnailUrl(audios[activeAudioIndex])) }}
      blurRadius={50}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.close}>
        <CollapseButton />
      </View>

      <Animated.View
        entering={FadeIn.delay(300).duration(400)}
        style={styles.container}
      >
        <FlashList
          horizontal
          data={audios}
          bounces={false}
          pagingEnabled
          contentContainerStyle={{ paddingBottom: 5 }}
          decelerationRate={'fast'}
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          estimatedItemSize={audios.length}
          renderItem={renderItem}
          keyExtractor={(item, i) => `${item.id}_${i}`}
          onEndReached={pageInfo?.next ? fetchMoreAudio : null}
          onEndReachedThreshold={0.8}
          onViewableItemsChanged={onViewableItemsChanged}
          extraData={activeAudioIndex}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.actions}>
        <Comments id={audios[activeAudioIndex].id} />
        <Player audio={audios[activeAudioIndex]} />
      </Animated.View>
    </ImageBackground>
  )
}

export default Stage
