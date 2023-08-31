import Ionicons from '@expo/vector-icons/Ionicons'
import { MOBILE_PROFILE_ITEMS } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12)
  },
  image: {
    width: 20,
    height: 20
  }
})

type Props = {
  activeTab: number
  scrollToTab: (index: number) => void
}

const icons = [
  'bonfire-outline',
  'headset-outline',
  'videocam-outline',
  'chatbubble-outline',
  'shapes-outline'
] as (keyof typeof Ionicons.glyphMap)[]

const TabList: FC<Props> = ({ activeTab, scrollToTab }) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()

  const autoScroll = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      x: activeTab < 3 ? 0 : width * activeTab,
      animated: true
    })
  }, [activeTab, width])

  useEffect(() => {
    autoScroll()
  }, [activeTab, autoScroll])

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: themeConfig.backgroudColor
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'baseline',
          gap: 10
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {MOBILE_PROFILE_ITEMS.map((tab, index) => {
          const isActive = activeTab === index
          const color = isActive
            ? themeConfig.contrastTextColor
            : themeConfig.textColor
          const backgroundColor = isActive
            ? themeConfig.buttonBackgroundColor
            : 'transparent'
          return (
            <Pressable
              key={tab}
              onPress={() => {
                scrollToTab(index)
                autoScroll()
                haptic()
              }}
              style={[
                styles.filter,
                {
                  backgroundColor
                }
              ]}
            >
              <Ionicons name={icons[index]} color={color} size={20} />
              <Text
                style={[
                  styles.text,
                  {
                    color
                  }
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default memo(TabList)
