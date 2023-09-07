import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import { getThumbnailUrl, imageCdn } from '@lenstube/generic'
import type {
  Profile,
  Publication,
  PublicationsQueryRequest
} from '@lenstube/lens'
import { PublicationTypes, useProfilePostsQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
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

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import NotFound from '~/components/ui/NotFound'
import { useMobileTheme } from '~/hooks'

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const GRID_GAP = 5
const NUM_COLUMNS = 3

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    thumbnail: {
      width: '100%',
      height: 210,
      borderRadius: GRID_GAP,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5,
      backgroundColor: themeConfig.backgroudColor2
    }
  })

const Bytes: FC<Props> = ({ profile, scrollHandler }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { height, width } = useWindowDimensions()

  const request: PublicationsQueryRequest = {
    publicationTypes: [PublicationTypes.Post],
    limit: 10,
    sources: [LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: profile?.id
  }

  const { data, loading, fetchMore, refetch } = useProfilePostsQuery({
    variables: {
      request
    },
    skip: !profile?.id,
    notifyOnNetworkStatusChange: true
  })

  const bytes = data?.publications?.items as Publication[]
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
    ({ item, index }: { item: Publication; index: number }) => (
      <View
        style={{
          marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
          width: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
        }}
      >
        <AnimatedPressable>
          <ExpoImage
            source={{
              uri: imageCdn(getThumbnailUrl(item, true), 'THUMBNAIL_V')
            }}
            transition={300}
            contentFit="cover"
            style={style.thumbnail}
          />
        </AnimatedPressable>
      </View>
    ),
    [width, style]
  )

  return (
    <View style={[style.container, { height }]}>
      <Animated.FlatList
        contentContainerStyle={{
          paddingBottom: bytes?.length < 10 ? 500 : 180
        }}
        data={bytes}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        numColumns={NUM_COLUMNS}
        scrollEventThrottle={16}
        onRefresh={() => refetch()}
        refreshing={Boolean(bytes?.length) && loading}
      />
    </View>
  )
}

export default memo(Bytes)
