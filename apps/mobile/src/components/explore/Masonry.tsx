import {
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@lenstube/constants'
import { getThumbnailUrl } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    minHeight: Dimensions.get('screen').height
  },
  item: {
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 10,
    flexGrow: 1
  },
  thumbnail: {
    borderRadius: 10,
    backgroundColor: theme.colors.backdrop,
    borderColor: theme.colors.grey,
    borderWidth: 0.5
  }
})

const Masonry = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }
  const { data } = useExploreQuery({
    variables: { request }
  })

  const publications = data?.explorePublications?.items as Publication[]

  const renderItem = (item: Publication) => (
    <View style={styles.item}>
      <Text style={{ color: 'black' }}>{item.metadata.mainContentFocus}</Text>
      <ExpoImage
        source={{ uri: getThumbnailUrl(item) }}
        contentFit="cover"
        style={[
          styles.thumbnail,
          {
            aspectRatio:
              item.appId === LENSTUBE_BYTES_APP_ID
                ? 9 / 16
                : item.metadata.mainContentFocus === PublicationMainFocus.Video
                ? 16 / 9
                : 1 / 1,
            height:
              item.metadata.mainContentFocus === PublicationMainFocus.Video
                ? 215
                : 150
          }
        ]}
      />
    </View>
  )

  if (!publications?.length) {
    return null
  }

  return (
    <View style={styles.container}>
      {publications.map((pub) => renderItem(pub))}
      {/* <MasonryFlashList
        optimizeItemArrangement
        overrideItemLayout={(layout, item) => {
          layout.size = publications.length
        }}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        data={publications}
        numColumns={2}
        // getColumnFlex={(_, index) => {
        //   return index % 2 === 0 ? 2 : 1
        // }}
        renderItem={renderItem}
        estimatedItemSize={publications?.length}
      /> */}
    </View>
  )
}

export default Masonry
