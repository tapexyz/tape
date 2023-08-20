import Ionicons from '@expo/vector-icons/Ionicons'
import { FEED_ALGORITHMS } from '@lenstube/constants'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { usePlatform } from '~/hooks'

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
  },
  group: {
    paddingBottom: 20
  },
  groupItems: {
    paddingLeft: 10,
    gap: 20
  },
  groupTitle: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    letterSpacing: 2,
    color: theme.colors.white
  }
})

export const FeedFlexModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const { isAndroid } = usePlatform()

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
        <Animated.View entering={SlideInDown.delay(10).duration(200)}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              goBack()
            }}
          >
            <Text
              style={[styles.text, { color: theme.colors.white, opacity: 0.7 }]}
            >
              See feed through
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {FEED_ALGORITHMS.map(({ algorithms, provider }, index) => (
          <View key={provider}>
            <View style={styles.group}>
              <Text style={styles.groupTitle}>{provider}</Text>
            </View>
            <View style={styles.groupItems}>
              {algorithms.map(({ name }) => (
                <Animated.View
                  key={name}
                  entering={SlideInDown.delay(index * 10).duration(200)}
                >
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      goBack()
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        { color: theme.colors.white, opacity: 0.7 }
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
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
        style={styles.close}
      >
        <Ionicons name="close-outline" color={theme.colors.black} size={35} />
      </Pressable>
    </BlurView>
  )
}
