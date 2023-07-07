import { LENS_CUSTOM_FILTERS, LENSTUBE_APP_ID } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import VideoCard from './VideoCard'

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 5,
    flex: 1,
    minHeight: Dimensions.get('screen').height
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    paddingTop: 10
  },
  thumbnail: {
    width: '100%',
    height: 215,
    borderRadius: 10,
    backgroundColor: theme.colors.background
  },
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    opacity: 0.8
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const Timeline = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 30,
    noRandomize: false,
    sources: [LENSTUBE_APP_ID],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data } = useExploreQuery({
    variables: { request }
  })

  const videos = data?.explorePublications?.items as Publication[]

  const renderItem = useCallback(
    ({ item }: { item: Publication }) => <VideoCard video={item} />,
    []
  )

  return (
    <View style={styles.container}>
      <FlashList
        data={videos}
        estimatedItemSize={50}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  )
}

export default Timeline
