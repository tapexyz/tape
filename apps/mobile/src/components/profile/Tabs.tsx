import Ionicons from '@expo/vector-icons/Ionicons'
import type { FC } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
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
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 5
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
  tabs: string[]
  scrollToTab: (index: number) => void
}

const icons = [
  'planet-outline',
  'headset-outline',
  'chatbubble-outline',
  'shapes-outline'
] as (keyof typeof Ionicons.glyphMap)[]

const Tabs: FC<Props> = ({ activeTab, tabs, scrollToTab }) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()

  const autoScroll = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      x: width * activeTab,
      animated: true
    })
  }, [activeTab, width])

  useEffect(() => {
    autoScroll()
  }, [activeTab, autoScroll])

  return (
    <View style={{ flexDirection: 'row' }}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'baseline'
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === index
          const color = isActive ? theme.colors.black : theme.colors.white
          const backgroundColor = isActive ? theme.colors.white : 'transparent'
          return (
            <Pressable
              key={tab}
              onPress={() => {
                scrollToTab(index)
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

export default Tabs
