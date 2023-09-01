import type { Profile } from '@lenstube/lens'
import {
  MOBILE_PROFILE_ITEMS,
  type MobileProfileTabItemType
} from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { memo, useCallback, useRef, useState } from 'react'
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken
} from 'react-native'
import { FlatList, useWindowDimensions, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TabList from './TabList'
import Bytes from './tabs/Bytes'
import Clan from './tabs/Clan'
import Gallery from './tabs/Gallery'
import Media from './tabs/Media'
import Replies from './tabs/Replies'

type Props = {
  profile: Profile
  infoHeaderHeight: number
  contentScrollY: SharedValue<number>
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const TabContent: FC<Props> = (props) => {
  const { profile, scrollHandler, infoHeaderHeight, contentScrollY } = props
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const flatListRef = useRef<FlatList<MobileProfileTabItemType>>(null)

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      let viewableItem = viewableItems[0]
      if (viewableItems.length > 4) {
        viewableItem = viewableItems[Math.floor(viewableItems.length) / 2]
      }
      if (viewableItem) {
        const visibleIndex = Number(viewableItem.index)
        setActiveTabIndex(visibleIndex)
      }
    },
    []
  )

  const scrollToTab = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index })
  }

  const animatedScrollStyles = useAnimatedStyle(() => {
    return {
      flex: 1,
      position: 'absolute',
      marginTop: interpolate(
        contentScrollY.value,
        [0, infoHeaderHeight],
        [infoHeaderHeight, insets.top],
        Extrapolate.CLAMP
      )
    }
  })

  return (
    <Animated.View style={animatedScrollStyles}>
      <TabList activeTab={activeTabIndex} scrollToTab={scrollToTab} />
      <FlatList
        ref={flatListRef}
        style={{ height }}
        scrollEnabled
        horizontal
        snapToAlignment="center"
        decelerationRate="fast"
        data={MOBILE_PROFILE_ITEMS}
        bounces={false}
        pagingEnabled
        bouncesZoom={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: MobileProfileTabItemType }) => {
          const component = {
            Clan: <Clan profile={profile} scrollHandler={scrollHandler} />,
            Media: <Media profile={profile} scrollHandler={scrollHandler} />,
            Bytes: <Bytes profile={profile} scrollHandler={scrollHandler} />,
            Replies: (
              <Replies profile={profile} scrollHandler={scrollHandler} />
            ),
            Gallery: <Gallery profile={profile} scrollHandler={scrollHandler} />
          }[item]

          return <View style={{ width }}>{component}</View>
        }}
        keyExtractor={(item, i) => `${item}_${i}`}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </Animated.View>
  )
}

export default memo(TabContent)
