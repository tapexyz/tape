import Ionicons from '@expo/vector-icons/Ionicons'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { ImageBackground } from 'expo-image'
import React, { useCallback, useState } from 'react'
import type { ViewToken } from 'react-native'
import { ActivityIndicator, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInLeft
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import Comments from '~/components/watch/Comments'
import { theme } from '~/helpers/theme'

import Item from './Item'
import Player from './Player'

const styles = StyleSheet.create({
  close: {
    zIndex: 1,
    paddingHorizontal: 15,
    marginBottom: 10,
    padding: 10
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})

const Stage = () => {
  const { goBack } = useNavigation()
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
    <ImageBackground
      source={{ uri: imageCdn(getThumbnailUrl(audios[activeAudioIndex])) }}
      blurRadius={50}
      style={{ flex: 1 }}
      contentFit="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          entering={SlideInLeft.duration(400)}
          style={{ alignSelf: 'baseline' }}
        >
          <AnimatedPressable onPress={() => goBack()} style={styles.close}>
            <Ionicons
              name="chevron-down-outline"
              color={theme.colors.white}
              size={30}
            />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(300).duration(400)}
          style={styles.container}
        >
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
            extraData={activeAudioIndex}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{
            alignItems: 'center',
            paddingHorizontal: 5
          }}
        >
          <Player audio={audios[activeAudioIndex]} />
          <Comments id={audios[activeAudioIndex].id} />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Stage
