import Ionicons from '@expo/vector-icons/Ionicons'
import { PublicationSortCriteria } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'

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
      alignItems: 'center',
      justifyContent: 'center'
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
      alignItems: 'center',
      gap: 30
    }
  })

export const TopsModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const { isAndroid } = usePlatform()
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
      <View style={style.listContainer}>
        <Animated.View entering={SlideInDown.duration(200)}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setSelectedExploreFilter({
                ...selectedExploreFilter,
                criteria: PublicationSortCriteria.TopCollected
              })
              goBack()
            }}
          >
            <Text style={[style.text, { opacity: 0.7 }]}>Top Collected</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={SlideInDown.duration(200)}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setSelectedExploreFilter({
                ...selectedExploreFilter,
                criteria: PublicationSortCriteria.TopCommented
              })
              goBack()
            }}
          >
            <Text style={[style.text, { opacity: 0.7 }]}>Top Commented</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={SlideInDown.duration(200)}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setSelectedExploreFilter({
                ...selectedExploreFilter,
                criteria: PublicationSortCriteria.TopMirrored
              })
              goBack()
            }}
          >
            <Text style={[style.text, { opacity: 0.7 }]}>Top Mirrored</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

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
