import Ionicons from '@expo/vector-icons/Ionicons'
import { FEED_ALGORITHMS } from '@lenstube/constants'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { TimelineFeedType } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme, usePlatform } from '~/hooks'
import useMobileHomeFeedStore from '~/store/feed'
import { isLightMode } from '~/store/persist'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      alignItems: 'center'
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(20),
      letterSpacing: 2,
      color: themeConfig.textColor
    },
    close: {
      position: 'absolute',
      backgroundColor: themeConfig.buttonBackgroundColor,
      padding: 10,
      borderRadius: 100,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      bottom: 50
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 30
    },
    group: {
      paddingBottom: 20
    },
    groupItems: {
      gap: 20
    },
    groupTitle: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      letterSpacing: 2,
      color: themeConfig.textColor
    }
  })

export const FeedFlexModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const { isAndroid } = usePlatform()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const setSelectedFeedType = useMobileHomeFeedStore(
    (state) => state.setSelectedFeedType
  )
  const selectedAlgoType = useMobileHomeFeedStore(
    (state) => state.selectedAlgoType
  )
  const setSelectedAlgoType = useMobileHomeFeedStore(
    (state) => state.setSelectedAlgoType
  )

  return (
    <BlurView
      intensity={100}
      tint={isLightMode() ? 'light' : 'dark'}
      style={[
        style.container,
        {
          backgroundColor: isAndroid
            ? themeConfig.backgroudColor
            : `${themeConfig.backgroudColor}80`
        }
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          style.listContainer,
          {
            paddingTop: top * 2,
            paddingBottom: height / 3
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {FEED_ALGORITHMS.map(({ algorithms, provider }) => (
          <View key={provider}>
            <View style={style.group}>
              <Text style={style.groupTitle}>{provider}</Text>
            </View>
            <View style={style.groupItems}>
              {algorithms.map(({ name, strategy }) => (
                <View key={name}>
                  <Pressable
                    onPress={() => {
                      setSelectedFeedType(TimelineFeedType.ALGORITHM)
                      setSelectedAlgoType(strategy)
                      goBack()
                    }}
                  >
                    <Text
                      style={[
                        style.text,
                        {
                          color: themeConfig.textColor,
                          opacity: selectedAlgoType === strategy ? 1 : 0.5
                        }
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => {
          haptic()
          goBack()
        }}
        style={style.close}
      >
        <Ionicons
          name="close-outline"
          color={themeConfig.buttonTextColor}
          size={35}
        />
      </Pressable>
    </BlurView>
  )
}
