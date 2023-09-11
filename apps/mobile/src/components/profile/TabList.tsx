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
  tab: {
    paddingVertical: 7,
    alignItems: 'center',
    gap: 3
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12)
  }
})

type Props = {
  activeTab: number
  scrollToTab: (index: number) => void
}

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
          gap: 25
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {MOBILE_PROFILE_ITEMS.map((tab, index) => {
          const isActive = activeTab === index
          const color = isActive
            ? themeConfig.textColor
            : `${themeConfig.secondaryTextColor}80`
          return (
            <Pressable
              key={tab}
              onPress={() => {
                scrollToTab(index)
                autoScroll()
                haptic()
              }}
              style={styles.tab}
            >
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
              {isActive ? (
                <Text style={{ color, fontSize: 3 }}>{'\u2B24'}</Text>
              ) : null}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default memo(TabList)
