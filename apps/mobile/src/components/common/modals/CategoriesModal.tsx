import Ionicons from '@expo/vector-icons/Ionicons'
import { CREATOR_VIDEO_CATEGORIES } from '@lenstube/constants'
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
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { usePlatform } from '~/hooks'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(20),
    letterSpacing: 2,
    color: theme.colors.white
  },
  close: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
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

  const selectedExploreFilter = useMobileStore(
    (state) => state.selectedExploreFilter
  )
  const setSelectedExploreFilter = useMobileStore(
    (state) => state.setSelectedExploreFilter
  )

  return (
    <BlurView
      intensity={100}
      tint="dark"
      style={[
        styles.container,
        {
          backgroundColor: isAndroid ? theme.colors.black : '#00000080'
        }
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.listContainer,
          {
            paddingTop: top * 2,
            paddingBottom: height / 3
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {CREATOR_VIDEO_CATEGORIES.map(({ tag, name }) => (
          <TouchableOpacity
            key={tag}
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
              style={[styles.text, { color: theme.colors.white, opacity: 0.7 }]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => {
          haptic()
          goBack()
        }}
        style={styles.close}
      >
        <Ionicons name="close-outline" color={theme.colors.black} size={35} />
      </Pressable>
    </BlurView>
  )
}
