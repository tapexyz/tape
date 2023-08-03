import type { Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React, { memo, useCallback, useRef, useState } from 'react'
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken
} from 'react-native'
import { FlatList, useWindowDimensions, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import Feed from './Feed'
import Gallery from './Gallery'
import Media from './Media'
import Replies from './Replies'
import Tabs from './Tabs'

const tabs = ['Feed', 'Media', 'Replies', 'Gallery']
type TabItemType = (typeof tabs)[number]

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const TabContent: FC<Props> = ({ profile, scrollHandler }) => {
  const { width, height } = useWindowDimensions()

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const flatListRef = useRef<FlatList<string>>(null)

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

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={FadeInRight.delay(200).duration(400)}
    >
      <Tabs activeTab={activeTabIndex} tabs={tabs} scrollToTab={scrollToTab} />
      <FlatList
        ref={flatListRef}
        style={{ height }}
        scrollEnabled
        horizontal
        snapToAlignment="center"
        decelerationRate="fast"
        data={tabs}
        bounces={false}
        pagingEnabled
        bouncesZoom={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: TabItemType }) => {
          const component = {
            Feed: <Feed profile={profile} scrollHandler={scrollHandler} />,
            Media: <Media profile={profile} />,
            Replies: <Replies profile={profile} />,
            Gallery: <Gallery profile={profile} />
          }[item]

          return (
            <View
              style={{
                width
              }}
            >
              {component}
            </View>
          )
        }}
        keyExtractor={(item, i) => `${item}_${i}`}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </Animated.View>
  )
}

export default memo(TabContent)
