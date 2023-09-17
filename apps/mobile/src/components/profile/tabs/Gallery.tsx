import { NFTS_URL } from '@lenstube/constants'
import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import { type Profile } from '@lenstube/lens'
import type {
  CustomNftItemType,
  MobileThemeConfig
} from '@lenstube/lens/custom-types'
import { ResizeMode, Video } from 'expo-av'
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
import useSWR from 'swr'

import NotFound from '~/components/ui/NotFound'
import { useMobileTheme } from '~/hooks'

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const GRID_GAP = 5
const NUM_COLUMNS = 2

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    card: {
      width: '100%',
      height: 210,
      borderRadius: GRID_GAP,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5,
      backgroundColor: themeConfig.backgroudColor2
    }
  })

const Gallery: FC<Props> = ({ profile, scrollHandler }) => {
  const { height, width } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const { data: nfts, isLoading } = useSWR(
    `${NFTS_URL}/${profile.handle}/200`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const renderItem = useCallback(
    ({ item, index }: { item: CustomNftItemType; index: number }) => (
      <View
        style={{
          marginRight: index % NUM_COLUMNS !== NUM_COLUMNS - 1 ? GRID_GAP : 0,
          width: (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
        }}
      >
        <Video
          isMuted
          isLooping
          usePoster
          shouldPlay={false}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          source={{ uri: item.contentValue.video ?? item.contentValue.audio }}
          posterStyle={{ flex: 1, resizeMode: 'cover' }}
          posterSource={{
            uri: imageCdn(
              item.metaData.image
                ? sanitizeDStorageUrl(item.metaData.image)
                : item.contentValue.video ?? item.contentValue.audio
            )
          }}
          style={style.card}
        />
      </View>
    ),
    [width, style]
  )

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <View style={[style.container, { height }]}>
      <Animated.FlatList
        contentContainerStyle={{
          paddingBottom: nfts.items?.length < 10 ? 500 : 180
        }}
        data={nfts.items}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.tokenId}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        ListEmptyComponent={() => !isLoading && <NotFound />}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        numColumns={NUM_COLUMNS}
        scrollEventThrottle={16}
      />
    </View>
  )
}

export default memo(Gallery)
