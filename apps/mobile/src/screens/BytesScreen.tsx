import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import type { Publication } from 'lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ByteCard from '../components/bytes/ByteCard'

export const BytesScreen = (props: BytesScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) {
      setActiveVideoIndex(-1)
    }
    // Do whatever you want to do when screen gets in focus
  }, [props, isFocused])

  const renderItem = useCallback(
    ({ item, index }: { item: Publication; index: number }) => (
      <ByteCard byte={item} isActive={activeVideoIndex === index} />
    ),
    [activeVideoIndex]
  )

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    sources: ['lenstube-bytes'],
    publicationTypes: [PublicationTypes.Post],
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data, loading, error } = useExploreQuery({
    variables: { request }
  })

  if (loading || error) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }
  const bytes = data?.explorePublications?.items as Publication[]

  return (
    <FlashList
      data={bytes}
      pagingEnabled
      renderItem={renderItem}
      estimatedItemSize={bytes.length}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item.id}_${i}`}
      extraData={activeVideoIndex} // To handle rerender if anything changes in data
      onMomentumScrollEnd={(e) => {
        const index = Math.round(
          e.nativeEvent.contentOffset.y / (insets.bottom + height)
        )
        setActiveVideoIndex(index)
      }}
    />
  )
}
