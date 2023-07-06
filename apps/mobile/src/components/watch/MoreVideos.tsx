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
    marginTop: 10,
    marginHorizontal: 5
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5
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

  return (
    <>
      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onPress={() => haptic()}
          style={[styles.filter, { backgroundColor: theme.colors.white }]}
        >
          <Text
            style={[
              styles.text,
              {
                color: theme.colors.black
              }
            ]}
          >
            Watch next
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            haptic()
          }}
          style={styles.filter}
        >
          <Text
            style={[
              styles.text,
              {
                color: theme.colors.white
              }
            ]}
          >
            Related picks
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            haptic()
          }}
          style={styles.filter}
        >
          <Text
            style={[
              styles.text,
              {
                color: theme.colors.white
              }
            ]}
          >
            From the Creator
          </Text>
        </Pressable>
      </ScrollView>
      <View style={styles.videos}>
        <FlashList
          data={videos}
          estimatedItemSize={50}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() => (
            <ActivityIndicator style={{ paddingVertical: 20 }} />
          )}
          onEndReached={() => fetchMoreVideos()}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          renderItem={({ item }) => {
            return <VideoCard video={item} />
            // return item.id !== viewingId ? <VideoCard video={item} /> : null
          }}
        />
      </View>
    </>
  )
}

export default MoreVideos
