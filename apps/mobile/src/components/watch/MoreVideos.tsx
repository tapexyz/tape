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
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import VideoCard from '../common/VideoCard'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    marginRight: 10
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5,
    color: theme.colors.white
  },
  videos: {
    marginTop: 15,
    paddingHorizontal: 5,
    flex: 1,
    minHeight: Dimensions.get('screen').height
  }
})

type Props = {
  viewingId: string
}

const MoreVideos: FC<Props> = ({ viewingId }) => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 10,
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

  const renderFooter = () => {
    return <ActivityIndicator style={{ paddingVertical: 20 }} />
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onPress={() => haptic()}
          style={[styles.filter, { backgroundColor: theme.colors.grey }]}
        >
          <Text style={styles.text}>Watch next</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            haptic()
          }}
          style={styles.filter}
        >
          <Text style={styles.text}>Related picks</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            haptic()
          }}
          style={styles.filter}
        >
          <Text style={styles.text}>From Creator</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.videos}>
        <FlashList
          data={videos}
          estimatedItemSize={50}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          onEndReached={() => fetchMoreVideos()}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          renderItem={({ item }) => {
            return item.id !== viewingId ? <VideoCard video={item} /> : null
          }}
        />
      </View>
    </>
  )
}

export default MoreVideos
