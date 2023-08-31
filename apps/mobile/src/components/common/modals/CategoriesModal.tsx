import Ionicons from '@expo/vector-icons/Ionicons'
import { CREATOR_VIDEO_CATEGORIES } from '@lenstube/constants'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme, usePlatform } from '~/hooks'
import useMobileStore from '~/store'
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
    }
  })

export const CategoriesModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const { isAndroid } = usePlatform()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedExploreFilter = useMobileStore(
    (state) => state.selectedExploreFilter
  )
  const setSelectedExploreFilter = useMobileStore(
    (state) => state.setSelectedExploreFilter
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
        <Animated.View entering={SlideInDown.delay(10).duration(200)}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setSelectedExploreFilter({
                ...selectedExploreFilter,
                category: 'all'
              })
              goBack()
            }}
          >
            <Text
              style={[
                style.text,
                { color: themeConfig.textColor, opacity: 0.7 }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {CREATOR_VIDEO_CATEGORIES.map(({ tag, name }, index) => (
          <Animated.View
            key={tag}
            entering={SlideInDown.delay(index * 10).duration(200)}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSelectedExploreFilter({
                  ...selectedExploreFilter,
                  category: tag
                })
                goBack()
              }}
            >
              <Text
                style={[
                  style.text,
                  { color: themeConfig.textColor, opacity: 0.7 }
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
